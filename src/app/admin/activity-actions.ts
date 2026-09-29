"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { deleteUnusedImage } from "@/lib/storage/cleanup";
import { isActivityCategory } from "@/lib/content/activities";
import { requireUser, refreshPublicPages } from "./guard";

export type ActivityState = { error?: string; saved?: boolean };

/** A link the owner typed, made into one a browser opens: "oasiria.com" → "https://oasiria.com". */
function website(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export async function saveActivity(_state: ActivityState, formData: FormData): Promise<ActivityState> {
  await requireUser();
  const text = (field: string) => String(formData.get(field) ?? "").trim();
  const id = text("id");

  const nameFr = text("nameFr");
  if (!nameFr) return { error: "Le nom en français est obligatoire." };

  const minutes = Number(text("minutes"));
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 240) {
    return { error: "Indiquez le temps de trajet en minutes (un nombre)." };
  }
  const category = text("category");
  if (!isActivityCategory(category)) return { error: "Choisissez une catégorie." };

  const websiteUrl = website(text("websiteUrl"));
  if (websiteUrl === null) return { error: "Le lien du site n'est pas une adresse web valide." };

  const imageUrl = text("imageUrl") || null;
  const previous = await db.activity.findUnique({ where: { id }, select: { imageUrl: true, imageCredit: true } });
  if (!previous) return { error: "Cette activité n'existe plus." };

  const descriptionFr = text("descriptionFr");
  await db.activity.update({
    where: { id },
    data: {
      category,
      minutes,
      nameFr,
      nameEn: text("nameEn") || nameFr,
      nameEs: text("nameEs") || nameFr,
      nameAr: text("nameAr") || nameFr,
      descriptionFr,
      descriptionEn: text("descriptionEn") || descriptionFr,
      descriptionEs: text("descriptionEs") || descriptionFr,
      descriptionAr: text("descriptionAr") || descriptionFr,
      imageUrl,
      altFr: text("altFr"),
      altEn: text("altEn") || text("altFr"),
      altEs: text("altEs") || text("altFr"),
      altAr: text("altAr") || text("altFr"),
      // A photo the owner uploads is theirs: the stock credit goes with the old one.
      imageCredit: imageUrl === previous.imageUrl ? previous.imageCredit : "",
      websiteUrl,
      mapsQuery: text("mapsQuery") || nameFr,
    },
  });

  if (previous.imageUrl && previous.imageUrl !== imageUrl) await deleteUnusedImage(previous.imageUrl);

  refreshPublicPages();
  revalidatePath("/admin/activites");
  return { saved: true };
}

export async function createActivity(_state: ActivityState, formData: FormData): Promise<ActivityState> {
  await requireUser();
  const nameFr = String(formData.get("nameFr") ?? "").trim();
  if (!nameFr) return { error: "Donnez un nom." };

  const rows = await db.activity.findMany({ select: { position: true, slug: true } });
  const base =
    nameFr
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "activite";
  let slug = base;
  for (let n = 2; rows.some((row) => row.slug === slug); n += 1) slug = `${base}-${n}`;

  const created = await db.activity.create({
    data: {
      slug,
      position: rows.reduce((max, row) => Math.max(max, row.position), 0) + 1,
      category: "loisirs",
      minutes: 5,
      nameFr,
      nameEn: nameFr,
      nameEs: nameFr,
      nameAr: nameFr,
      mapsQuery: `${nameFr} Marrakech`,
      // Hidden until its photo and texts are in.
      published: false,
    },
  });
  refreshPublicPages();
  redirect(`/admin/activites/${created.id}`);
}

export async function deleteActivity(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const activity = await db.activity.findUnique({ where: { id } });
  if (!activity) return;
  await db.activity.delete({ where: { id } });
  await deleteUnusedImage(activity.imageUrl);
  refreshPublicPages();
  redirect("/admin/activites");
}
