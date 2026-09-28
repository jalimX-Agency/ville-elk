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

// Two kinds of failure. A connection that never opened means the statement
// never reached Postgres, so anything may be retried. A connection that dropped
// mid-way may have run the statement already, so only reads are retried —
// retrying a write there could, say, record one booking request twice.
const NEVER_CONNECTED = /connection terminated due to connection timeout|timeout exceeded when trying to connect|ECONNREFUSED|P1001/i;
const DROPPED = /connection terminated unexpectedly|ECONNRESET|EPIPE|ETIMEDOUT|P1017/i;
const READS = new Set(["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany", "count", "aggregate", "groupBy"]);

function canRetry(error: unknown, operation: string): boolean {
  const e = error as { code?: unknown; message?: unknown; cause?: { message?: unknown; code?: unknown } };
  const text = [e?.code, e?.message, e?.cause?.code, e?.cause?.message].filter((v) => typeof v === "string").join(" ");
  if (NEVER_CONNECTED.test(text)) return true;
  return DROPPED.test(text) && READS.has(operation);
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
      async $allOperations({ args, query, operation }) {
        let lastError: unknown;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          try {
            return await query(args);
          } catch (error) {
            if (!canRetry(error, operation)) throw error;
            lastError = error;
            await wait(400 * 2 ** attempt);
          }
        }
        throw lastError;
      },
    },
  });
}
