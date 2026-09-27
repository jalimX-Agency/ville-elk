import { db } from "@/lib/db/client";
import type { GalleryImageModel, SuiteModel } from "@/generated/prisma/models";
import { isGalleryCategory, type GalleryPhoto, type Suite } from "./types";

function toSuite(row: SuiteModel): Suite {
  return {
    id: row.id,
    slug: row.slug,
    level: row.level,
    areaSqm: row.areaSqm,
    name: { fr: row.nameFr, en: row.nameEn, es: row.nameEs, ar: row.nameAr },
    description: {
      fr: row.descriptionFr,
      en: row.descriptionEn,
      es: row.descriptionEs,
      ar: row.descriptionAr,
    },
    features: { fr: row.featuresFr, en: row.featuresEn, es: row.featuresEs, ar: row.featuresAr },
    image: row.imageUrl
      ? {
          src: row.imageUrl,
          alt: {
            fr: row.altFr ?? "",
            en: row.altEn ?? "",
            es: row.altEs ?? "",
            ar: row.altAr ?? "",
          },
        }
      : null,
  };
}

/** The rooms the owner has published, in the order they set. */
export async function getSuites(): Promise<Suite[]> {
  const rows = await db.suite.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
  });
  return rows.map(toSuite);
}

function toPhoto(row: GalleryImageModel): GalleryPhoto {
  return {
    id: row.id,
    // A value the gallery does not know still shows under "all".
    category: isGalleryCategory(row.category) ? row.category : "rdc",
    image: {
      src: row.imageUrl,
      alt: { fr: row.altFr, en: row.altEn, es: row.altEs, ar: row.altAr },
    },
  };
}

export async function getGallery(): Promise<GalleryPhoto[]> {
  const rows = await db.galleryImage.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
  });
  return rows.map(toPhoto);
}

/** One published suite and the gallery photographs that show it, or null. */
export async function getSuite(slug: string): Promise<{ suite: Suite; photos: GalleryPhoto[] } | null> {
  const row = await db.suite.findFirst({
    where: { slug, published: true },
    include: { photos: { where: { published: true }, orderBy: { position: "asc" } } },
  });
  if (!row) return null;
  return { suite: toSuite(row), photos: row.photos.map(toPhoto) };
}

/** Slugs of the published suites, for prerendering their pages. */
export async function getSuiteSlugs(): Promise<string[]> {
  const rows = await db.suite.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
    select: { slug: true },
  });
  return rows.map((row) => row.slug);
}
