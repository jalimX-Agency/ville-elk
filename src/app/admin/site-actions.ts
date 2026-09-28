"use server";

import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { locales } from "@/lib/i18n/locales";
import { getDefaultDictionary } from "@/lib/i18n/get-dictionary";
import { getAt } from "@/lib/content/dictionary-paths";
import { isSectionKey, sectionFields } from "@/lib/content/site-sections";
import { SETTING_DEFAULTS, isSettingKey } from "@/lib/content/site";
import { isStoredImage } from "@/lib/storage/r2";
import { deleteUnusedImage } from "@/lib/storage/cleanup";
import { requireUser, refreshPublicPages } from "./guard";

export type FormState = { error?: string; saved?: boolean };

const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * Saves one screen of copy. Only differences from the text in the code are
 * stored: a field put back to its original, or emptied, loses its row and the
 * original shows again.
 */
export async function saveSection(_state: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const section = String(formData.get("section") ?? "");
  if (!isSectionKey(section)) return { error: "Section inconnue." };

  const writes: Promise<unknown>[] = [];
  for (const field of sectionFields(section)) {
    for (const locale of locales) {
      const raw = formData.get(`${locale}|${field.path}`);
      if (raw === null) continue;
      const original = getAt(getDefaultDictionary(locale), field.path);
      const value = field.kind === "list" ? lines(String(raw)) : String(raw).trim();
      const empty = field.kind === "list" ? (value as string[]).length === 0 : value === "";

      if (empty || JSON.stringify(value) === JSON.stringify(original)) {
        writes.push(db.siteText.deleteMany({ where: { locale, key: field.path } }));
      } else {
        writes.push(
          db.siteText.upsert({
            where: { locale_key: { locale, key: field.path } },
            create: { locale, key: field.path, value },
            update: { value },
          }),
        );
      }
    }
  }
  await Promise.all(writes);

  refreshPublicPages();
  revalidatePath(`/admin/textes/${section}`);
  return { saved: true };
}

/** Puts one field back to the text in the code, in every language. */
export async function resetField(formData: FormData) {
  await requireUser();
  const key = String(formData.get("reset") ?? "");
  const section = key.split(".")[0];
  if (!isSectionKey(section) || !sectionFields(section).some((field) => field.path === key)) return;

  await db.siteText.deleteMany({ where: { key } });
  refreshPublicPages();
  revalidatePath(`/admin/textes/${section}`);
}

export async function saveSettings(_state: FormState, formData: FormData): Promise<FormState> {
  await requireUser();

  const email = String(formData.get("contact.email") ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: "L'adresse email n'est pas valide." };
  }
  const whatsapp = String(formData.get("contact.whatsapp") ?? "").replace(/\D/g, "");
  if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 15)) {
    return { error: "Le numéro WhatsApp doit contenir l'indicatif du pays, par exemple 33627874284." };
  }

  const current = new Map((await db.siteSetting.findMany()).map((row) => [row.key, row.value]));
  const replacedImages: string[] = [];

  for (const [key, fallback] of Object.entries(SETTING_DEFAULTS)) {
    if (!isSettingKey(key) || !formData.has(key)) continue;
    let value = String(formData.get(key) ?? "").trim();
    if (key === "contact.whatsapp") value = whatsapp;
    if (key === "contact.instagram") value = value.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");

    const previous = current.get(key);
    if (!value || value === fallback) {
      if (previous !== undefined) await db.siteSetting.delete({ where: { key } });
    } else if (value !== previous) {
      await db.siteSetting.upsert({ where: { key }, create: { key, value }, update: { value } });
    } else {
      continue;
    }
    // An uploaded photograph that is no longer used by any setting can go.
    if (previous && previous !== value && isStoredImage(previous)) replacedImages.push(previous);
  }

  for (const url of replacedImages) await deleteUnusedImage(url);

  refreshPublicPages();
  revalidatePath("/admin/reglages");
  return { saved: true };
}

/* ---------------------------------------------------------------- amenities */

function nextPositionOf(rows: { position: number }[]) {
  return rows.reduce((max, row) => Math.max(max, row.position), 0) + 1;
}

export async function createAmenity(_state: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const nameFr = String(formData.get("nameFr") ?? "").trim();
  if (!nameFr) return { error: "Donnez un nom en français." };

  const rows = await db.amenity.findMany({ select: { position: true, slug: true } });
  const created = await db.amenity.create({
    data: {
      slug: await uniqueSlug(nameFr, rows.map((row) => row.slug)),
      position: nextPositionOf(rows),
      nameFr,
      nameEn: nameFr,
      nameEs: nameFr,
      nameAr: nameFr,
    },
  });
  refreshPublicPages();
  // Straight to its page, where the other languages and a photo are filled in.
  redirect(`/admin/prestations/${created.id}`);
}

export async function deleteAmenity(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const amenity = await db.amenity.findUnique({ where: { id } });
  if (!amenity) return;
  await db.amenity.delete({ where: { id } });
  await deleteUnusedImage(amenity.imageUrl);
  refreshPublicPages();
  redirect("/admin/prestations");
}

/* ------------------------------------------------------------------- suites */

export async function createSuite(_state: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const nameFr = String(formData.get("nameFr") ?? "").trim();
  if (!nameFr) return { error: "Donnez un nom en français." };
  const level = formData.get("level") === "0" ? "0" : "+1";

  const rows = await db.suite.findMany({ select: { position: true, slug: true } });
  const created = await db.suite.create({
    data: {
      slug: await uniqueSlug(nameFr, rows.map((row) => row.slug)),
      position: nextPositionOf(rows),
      level,
      nameFr,
      nameEn: nameFr,
      nameEs: nameFr,
      nameAr: nameFr,
      descriptionFr: "",
      descriptionEn: "",
      descriptionEs: "",
      descriptionAr: "",
      // New rooms start hidden: a half-written suite should not appear on the site.
      published: false,
    },
  });
  refreshPublicPages();
  redirect(`/admin/suites/${created.id}`);
}

export async function deleteSuite(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const suite = await db.suite.findUnique({ where: { id } });
  if (!suite) return;
  // Its gallery photographs stay in the gallery; the relation is cleared.
  await db.suite.delete({ where: { id } });
  await deleteUnusedImage(suite.imageUrl);
  refreshPublicPages();
  redirect("/admin/suites");
}

/**
 * A URL slug from a French name: "Suite de l'Atlas" → "suite-de-l-atlas".
 * It becomes the page address, so it is made once and never changes after.
 */
async function uniqueSlug(name: string, taken: string[]): Promise<string> {
  const base =
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "element";
  let slug = base;
  for (let n = 2; taken.includes(slug); n += 1) slug = `${base}-${n}`;
  return slug;
}

/* ------------------------------------------------------------------ account */

export async function changePassword(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const currentPassword = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) return { error: "Le nouveau mot de passe doit faire au moins 10 caractères." };
  if (next !== confirm) return { error: "Les deux nouveaux mots de passe ne correspondent pas." };

  const row = await db.user.findUnique({ where: { id: user.id } });
  if (!row || !(await compare(currentPassword, row.passwordHash))) {
    return { error: "Le mot de passe actuel est incorrect." };
  }

  await db.user.update({ where: { id: row.id }, data: { passwordHash: await hash(next, 12) } });
  return { saved: true };
}

