"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { createSession, destroySession, getSessionUser } from "@/lib/auth/session";
import { locales } from "@/lib/i18n/locales";

/**
 * Server Actions are reachable by direct POST, so every one of them checks the
 * session itself rather than trusting the page that rendered the form.
 */
async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** The public pages are prerendered per locale; a content change refreshes them all. */
function refreshPublicPages() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
  }
}

export type LoginState = { error?: string };

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Renseignez votre email et votre mot de passe." };
  }

  const user = await db.user.findUnique({ where: { email } });
  // The same message for an unknown email and a wrong password, so the form
  // cannot be used to find out which accounts exist.
  const ok = user ? await compare(password, user.passwordHash) : false;
  if (!user || !ok) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export type AmenityState = { error?: string; saved?: boolean };

export async function saveAmenity(_state: AmenityState, formData: FormData): Promise<AmenityState> {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const text = (field: string) => String(formData.get(field) ?? "").trim();

  const nameFr = text("nameFr");
  if (!nameFr) return { error: "Le nom en français est obligatoire." };

  const imageUrl = text("imageUrl") || null;
  // Alt text describes a photograph; without one there is nothing to describe.
  const alt = (field: string) => (imageUrl ? text(field) || null : null);

  await db.amenity.update({
    where: { id },
    data: {
      nameFr,
      nameEn: text("nameEn") || nameFr,
      nameEs: text("nameEs") || nameFr,
      nameAr: text("nameAr") || nameFr,
      imageUrl,
      altFr: alt("altFr"),
      altEn: alt("altEn"),
      altEs: alt("altEs"),
      altAr: alt("altAr"),
    },
  });

  refreshPublicPages();
  revalidatePath("/admin/prestations");
  return { saved: true };
}

export async function toggleAmenity(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");

  const amenity = await db.amenity.findUnique({ where: { id }, select: { published: true } });
  if (!amenity) return;

  await db.amenity.update({ where: { id }, data: { published: !amenity.published } });
  refreshPublicPages();
  revalidatePath("/admin/prestations");
}

/** Swaps a row with its neighbour, which is all reordering a short list needs. */
export async function moveAmenity(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";

  const current = await db.amenity.findUnique({ where: { id } });
  if (!current) return;

  const neighbour = await db.amenity.findFirst({
    where:
      direction === "up"
        ? { position: { lt: current.position } }
        : { position: { gt: current.position } },
    orderBy: { position: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbour) return;

  await db.$transaction([
    db.amenity.update({ where: { id: current.id }, data: { position: neighbour.position } }),
    db.amenity.update({ where: { id: neighbour.id }, data: { position: current.position } }),
  ]);

  refreshPublicPages();
  revalidatePath("/admin/prestations");
}
