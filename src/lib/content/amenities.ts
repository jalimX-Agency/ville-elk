import { db } from "@/lib/db/client";
import type { AmenityModel } from "@/generated/prisma/models";
import type { Amenity } from "./types";

/**
 * Turn a database row into the shape the public components read. The four
 * language columns collapse into one object here so no component has to know
 * how the dashboard stores them.
 */
export function toAmenity(row: AmenityModel): Amenity {
  return {
    id: row.id,
    slug: row.slug,
    name: { fr: row.nameFr, en: row.nameEn, es: row.nameEs, ar: row.nameAr },
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

/** The amenities the owner has published, in the order they set. */
export async function getAmenities(): Promise<Amenity[]> {
  const rows = await db.amenity.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
  });
  return rows.map(toAmenity);
}
