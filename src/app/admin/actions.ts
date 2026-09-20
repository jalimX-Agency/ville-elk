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

/**
 * Swaps a row with its neighbour, which is all reordering a short list needs.
 *
 * The three ordered tables share the same `position` column, and Prisma's
 * per-model clients are not interchangeable, so this speaks SQL. The table name
 * comes from the union type below and never from user input.
 */
const ORDERED_TABLES = {
  amenity: "Amenity",
  suite: "Suite",
  galleryImage: "GalleryImage",
} as const;

type Ordered = { id: string; position: number };

async function swapPosition(
  model: keyof typeof ORDERED_TABLES,
  id: string,
  rawDirection: FormDataEntryValue | null,
) {
  if (!id) return;
  const table = ORDERED_TABLES[model];
  const up = rawDirection === "up";

  const [current] = await db.$queryRawUnsafe<Ordered[]>(
    `SELECT id, position FROM "${table}" WHERE id = $1`,
    id,
  );
  if (!current) return;

  const [neighbour] = await db.$queryRawUnsafe<Ordered[]>(
    `SELECT id, position FROM "${table}"
      WHERE position ${up ? "<" : ">"} $1
      ORDER BY position ${up ? "DESC" : "ASC"}
      LIMIT 1`,
    current.position,
  );
  if (!neighbour) return;

  // One statement, so the two rows can never be left holding the same position.
  await db.$executeRawUnsafe(
    `UPDATE "${table}"
        SET position = CASE id WHEN $1 THEN $2::int ELSE $4::int END
      WHERE id IN ($1, $3)`,
    current.id,
    neighbour.position,
    neighbour.id,
    current.position,
  );
}

export async function moveAmenity(formData: FormData) {
  await requireUser();
  await swapPosition("amenity", String(formData.get("id") ?? ""), formData.get("direction"));
  refreshPublicPages();
  revalidatePath("/admin/prestations");
}

const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED"] as const;
type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

/** Moves a request along. Nothing here is visible on the public site. */
export async function setEnquiryStatus(formData: FormData) {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ENQUIRY_STATUSES.includes(status as EnquiryStatus)) return;

  await db.enquiry.update({ where: { id }, data: { status: status as EnquiryStatus } });
  revalidatePath("/admin/demandes");
  revalidatePath("/admin");
}

export type SuiteState = { error?: string; saved?: boolean };

export async function saveSuite(_state: SuiteState, formData: FormData): Promise<SuiteState> {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const text = (field: string) => String(formData.get(field) ?? "").trim();

  const nameFr = text("nameFr");
  if (!nameFr) return { error: "Le nom en français est obligatoire." };

  const area = text("areaSqm");
  const areaSqm = area ? Number(area) : null;
  if (areaSqm !== null && (!Number.isInteger(areaSqm) || areaSqm < 1 || areaSqm > 2000)) {
    return { error: "La surface doit être un nombre de mètres carrés." };
  }

  const imageUrl = text("imageUrl") || null;
  const alt = (field: string) => (imageUrl ? text(field) || null : null);

  const previous = await db.suite.findUnique({ where: { id }, select: { imageUrl: true } });

  await db.suite.update({
    where: { id },
    data: {
      nameFr,
      nameEn: text("nameEn") || nameFr,
      nameEs: text("nameEs") || nameFr,
      nameAr: text("nameAr") || nameFr,
      descriptionFr: text("descriptionFr"),
      descriptionEn: text("descriptionEn") || text("descriptionFr"),
      descriptionEs: text("descriptionEs") || text("descriptionFr"),
      descriptionAr: text("descriptionAr") || text("descriptionFr"),
      level: text("level") === "0" ? "0" : "+1",
      areaSqm,
      imageUrl,
      altFr: alt("altFr"),
      altEn: alt("altEn"),
      altEs: alt("altEs"),
      altAr: alt("altAr"),
    },
  });

  if (previous?.imageUrl && previous.imageUrl !== imageUrl) {
    await deleteImage(previous.imageUrl);
  }

  refreshPublicPages();
  revalidatePath("/admin/suites");
  return { saved: true };
}

export async function toggleSuite(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");

  const suite = await db.suite.findUnique({ where: { id }, select: { published: true } });
  if (!suite) return;

  await db.suite.update({ where: { id }, data: { published: !suite.published } });
  refreshPublicPages();
  revalidatePath("/admin/suites");
}

export async function moveSuite(formData: FormData) {
  await requireUser();
  await swapPosition("suite", String(formData.get("id") ?? ""), formData.get("direction"));
  refreshPublicPages();
  revalidatePath("/admin/suites");
}

export async function toggleGalleryImage(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");

  const photo = await db.galleryImage.findUnique({ where: { id }, select: { published: true } });
  if (!photo) return;

  await db.galleryImage.update({ where: { id }, data: { published: !photo.published } });
  refreshPublicPages();
  revalidatePath("/admin/galerie");
}

export async function moveGalleryImage(formData: FormData) {
  await requireUser();
  await swapPosition("galleryImage", String(formData.get("id") ?? ""), formData.get("direction"));
  refreshPublicPages();
  revalidatePath("/admin/galerie");
}

export async function deleteGalleryImage(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");

  const photo = await db.galleryImage.findUnique({ where: { id } });
  if (!photo) return;

  await db.galleryImage.delete({ where: { id } });
  await deleteImage(photo.imageUrl);

  refreshPublicPages();
  revalidatePath("/admin/galerie");
}

export type GalleryState = { error?: string; added?: number };

export async function addGalleryImages(
  _state: GalleryState,
  formData: FormData,
): Promise<GalleryState> {
  await requireUser();

  // The picker uploads first and posts the URLs, so this only records them.
  const urls = formData.getAll("imageUrl").map(String).filter(Boolean);
  if (urls.length === 0) return { error: "Choisissez au moins une photo." };

  const last = await db.galleryImage.findFirst({ orderBy: { position: "desc" } });
  let position = (last?.position ?? 0) + 1;

  for (const imageUrl of urls) {
    // Alt text starts empty; the owner writes it on the row.
    await db.galleryImage.create({
      data: { imageUrl, position, altFr: "", altEn: "", altEs: "", altAr: "" },
    });
    position += 1;
  }

  refreshPublicPages();
  revalidatePath("/admin/galerie");
  return { added: urls.length };
}

export type GalleryAltState = { error?: string; saved?: boolean };

export async function saveGalleryAlt(
  _state: GalleryAltState,
  formData: FormData,
): Promise<GalleryAltState> {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const text = (field: string) => String(formData.get(field) ?? "").trim();

  const altFr = text("altFr");
  if (!altFr) return { error: "La description en français est obligatoire." };

  await db.galleryImage.update({
    where: { id },
    data: {
      altFr,
      altEn: text("altEn") || altFr,
      altEs: text("altEs") || altFr,
      altAr: text("altAr") || altFr,
    },
  });

  refreshPublicPages();
  revalidatePath("/admin/galerie");
  return { saved: true };
}
