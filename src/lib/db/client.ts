import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 talks to Postgres through a driver adapter. Neon's pooled host is
 * the right target at runtime — the migration CLI uses DIRECT_URL instead.
 */

/**
 * Neon suspends an idle database and wakes it on the next connection, so the
 * first query after a quiet spell can time out before the instance is up.
 * These are failures to *open* a connection, which means the statement never
 * reached Postgres — retrying cannot duplicate a write.
 */
const TRANSIENT = new Set(["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "EPIPE", "P1001", "P1017"]);

function isTransient(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  return typeof code === "string" && TRANSIENT.has(code);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString, connectionTimeoutMillis: 15_000 }),
  });

  return client.$extends({
    query: {
      async $allOperations({ args, query }) {
        let lastError: unknown;
        // Three tries, backing off, so a waking database costs a slow page
        // rather than a broken one.
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            return await query(args);
          } catch (error) {
            if (!isTransient(error)) throw error;
            lastError = error;
            await wait(250 * 2 ** attempt);
          }
        }
        throw lastError;
      },
    },
  });
}

// `next dev` re-evaluates modules on every edit; without this the pool would
// grow one connection per reload until Neon refuses new ones.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
