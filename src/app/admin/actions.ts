"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { auth, signIn, signOut } from "@/auth";
import { locales } from "@/lib/i18n/locales";
import { deleteImage } from "@/lib/storage/r2";

/**
 * Server Actions are reachable by direct POST, so every one of them checks the
 * session itself rather than trusting the page that rendered the form.
 */
async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}

/** The public pages are prerendered per locale; a content change refreshes them all. */
function refreshPublicPages() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
  }
}

export type LoginState = { error?: string };

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    // `signIn` redirects by throwing, so that throw has to pass through.
    if (error instanceof AuthError) {
      // One message for an unknown email and for a wrong password, so the form
      // cannot be used to find out which accounts exist.
      return { error: "Email ou mot de passe incorrect." };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
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

  const previous = await db.amenity.findUnique({ where: { id }, select: { imageUrl: true } });

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

  // The old photograph is now unreferenced; leaving it would cost storage for
  // every replacement the owner ever makes.
  if (previous?.imageUrl && previous.imageUrl !== imageUrl) {
    await deleteImage(previous.imageUrl);
  }

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
