import "server-only";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

/**
 * Server Actions are reachable by direct POST, so every one of them checks the
 * session itself rather than trusting the page that rendered the form.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}

/**
 * The public pages are prerendered. A content change can show on any of them —
 * an amenity on the home page, a photograph in the gallery and on its suite's
 * page — so everything under the public layout is refreshed, in every language.
 */
export function refreshPublicPages() {
  revalidatePath("/[locale]", "layout");
}
