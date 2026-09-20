/**
 * Applies pending migrations over the same connection the application uses.
 *
 * `prisma migrate deploy` is the normal route and should be preferred. This
 * exists because Prisma's migration engine cannot always open a connection
 * where the Node driver can — on a restricted network it fails with P1001
 * while `pg` connects fine. The SQL and the bookkeeping are identical to what
 * the CLI does, so `prisma migrate status` stays truthful afterwards.
 *
 *   npx tsx scripts/apply-migrations.ts
 */
import "dotenv/config";
import { createHash, randomUUID } from "node:crypto";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

const MIGRATIONS = join(process.cwd(), "prisma", "migrations");

async function main() {
  const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const db = new Client({ connectionString, connectionTimeoutMillis: 30_000 });
  await db.connect();

  // Same table and shape the Prisma CLI maintains.
  await db.query(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id"                    VARCHAR(36) PRIMARY KEY NOT NULL,
      "checksum"              VARCHAR(64) NOT NULL,
      "finished_at"           TIMESTAMPTZ,
      "migration_name"        VARCHAR(255) NOT NULL,
      "logs"                  TEXT,
      "rolled_back_at"        TIMESTAMPTZ,
      "started_at"            TIMESTAMPTZ NOT NULL DEFAULT now(),
      "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
    )
  `);

  const applied = new Set<string>(
    (await db.query<{ migration_name: string }>(
      `SELECT migration_name FROM "_prisma_migrations" WHERE rolled_back_at IS NULL`,
    )).rows.map((row) => row.migration_name),
  );

  const names = readdirSync(MIGRATIONS, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  let count = 0;
  for (const name of names) {
    if (applied.has(name)) continue;

    const file = join(MIGRATIONS, name, "migration.sql");
    if (!existsSync(file)) continue;
    const sql = readFileSync(file, "utf8");

    // One transaction per migration: a failure leaves nothing half-applied and
    // nothing recorded, so re-running picks up where it stopped.
    await db.query("BEGIN");
    try {
      await db.query(sql);
      await db.query(
        `INSERT INTO "_prisma_migrations"
           (id, checksum, migration_name, finished_at, started_at, applied_steps_count)
         VALUES ($1, $2, $3, now(), now(), 1)`,
        [randomUUID(), createHash("sha256").update(sql).digest("hex"), name],
      );
      await db.query("COMMIT");
      console.log(`applied ${name}`);
      count += 1;
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }

  console.log(count === 0 ? "Nothing to apply." : `Applied ${count} migration(s).`);
  await db.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
