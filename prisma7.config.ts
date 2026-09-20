import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Neon's pooled connection cannot hold the advisory locks migrations need, so
 * the CLI prefers the unpooled host; set DIRECT_URL empty to fall back to the
 * pooled one when the unpooled endpoint is unreachable.
 *
 * `channel_binding` is a libpq option the migration engine does not understand
 * and refuses the connection over, so it is stripped here. The application's
 * own connection keeps it.
 */
function migrationUrl(): string | undefined {
  const chosen = process.env["DIRECT_URL"]?.trim() || process.env["DATABASE_URL"]?.trim();
  if (!chosen) return undefined;

  const url = new URL(chosen);
  url.searchParams.delete("channel_binding");
  return url.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl(),
  },
});
