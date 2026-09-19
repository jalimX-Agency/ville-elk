/**
 * Creates or updates a dashboard account. Passwords are never stored in the
 * repository — pass them on the command line, which keeps them out of .env too:
 *
 *   npx tsx prisma/create-user.ts owner@example.com "Fatima-Zahra" "the-password"
 */
import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const [email, name, password] = process.argv.slice(2);
  if (!email || !name || !password) {
    console.error('Usage: tsx prisma/create-user.ts <email> "<name>" "<password>"');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("Choose a password of at least 10 characters.");
    process.exit(1);
  }

  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  const passwordHash = await hash(password, 12);
  const user = await db.user.upsert({
    where: { email: email.toLowerCase() },
    create: { email: email.toLowerCase(), name, passwordHash },
    update: { name, passwordHash },
  });

  console.log(`Account ready: ${user.email} (${user.role})`);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
