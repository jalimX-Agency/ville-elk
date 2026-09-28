import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";

export type AdminUser = { id: string; name: string; email: string; role: string };

/**
 * The signed-in account, or null. The session is an encrypted cookie valid for
 * two weeks, so on its own it proves only that an account existed when it
 * signed in: a deleted account kept its access until the cookie expired. The
 * row is checked on every request, so deleting an account shuts it out at once.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
  return user;
});

/**
 * Server Actions are reachable by direct POST, so every one of them checks the
 * account itself rather than trusting the page that rendered the form.
 */
export async function requireUser(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * The public pages are prerendered. A content change can show on any of them —
 * an amenity on the home page, a photograph in the gallery and on its suite's
 * page — so everything under the public layout is refreshed, in every language.
 */
export function refreshPublicPages() {
  revalidatePath("/[locale]", "layout");
}
