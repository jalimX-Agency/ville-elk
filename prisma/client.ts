/**
 * The Prisma client the command-line scripts use.
 *
 * It mirrors src/lib/db/client.ts, including the retry: Neon suspends an idle
 * database and wakes it on the next connection, so a seed or an account
 * creation should not fail because the instance was asleep.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const TRANSIENT = new Set(["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "EPIPE", "P1001", "P1017"]);

function isTransient(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  return typeof code === "string" && TRANSIENT.has(code);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function scriptClient() {
  // The unpooled host is preferred for migrations, but scripts are ordinary
  // queries and the pooled host is the one that is always up.
  const connectionString = process.env.DATABASE_URL?.trim() || process.env.DIRECT_URL?.trim();
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString, connectionTimeoutMillis: 15_000 }),
  }).$extends({
    query: {
      async $allOperations({ args, query }) {
        let lastError: unknown;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          try {
            return await query(args);
          } catch (error) {
            if (!isTransient(error)) throw error;
            lastError = error;
            await wait(400 * 2 ** attempt);
          }
        }
        throw lastError;
      },
    },
  });
}
