import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 talks to Postgres through a driver adapter. Neon's pooled host is
 * the right target at runtime — the migration CLI uses DIRECT_URL instead.
 */

// Neon suspends an idle database and wakes it on the next connection, so the
// first query after a quiet spell can fail before the instance is up.
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
      async $allOperations({ args, query, operation }) {
        let lastError: unknown;
        // Three tries, backing off, so a waking database costs a slow page
        // rather than a broken one.
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            return await query(args);
          } catch (error) {
            if (!canRetry(error, operation)) throw error;
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
