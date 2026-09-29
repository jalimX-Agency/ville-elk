import { db } from "@/lib/db/client";
import type { ActivityModel } from "@/generated/prisma/models";
import type { ContentImage, Localized } from "./types";
import { VILLA_LOCATION } from "./location";

export const ACTIVITY_CATEGORIES = ["golf", "loisirs", "aquatique", "restauration"] as const;
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export const isActivityCategory = (value: string): value is ActivityCategory =>
  (ACTIVITY_CATEGORIES as readonly string[]).includes(value);

export type Activity = {
  id: string;
  slug: string;
  category: ActivityCategory;
  minutes: number;
  name: Localized;
  description: Localized;
  image: (ContentImage & { credit: string }) | null;
  websiteUrl: string;
  /** Google Maps directions from the villa, so the drive time shown is the villa's. */
  directionsUrl: string | null;
};

export function toActivity(row: ActivityModel): Activity {
  return {
    id: row.id,
    slug: row.slug,
    category: isActivityCategory(row.category) ? row.category : "loisirs",
    minutes: row.minutes,
    name: { fr: row.nameFr, en: row.nameEn, es: row.nameEs, ar: row.nameAr },
    description: { fr: row.descriptionFr, en: row.descriptionEn, es: row.descriptionEs, ar: row.descriptionAr },
    image: row.imageUrl
      ? {
          src: row.imageUrl,
          alt: { fr: row.altFr, en: row.altEn, es: row.altEs, ar: row.altAr },
          credit: row.imageCredit,
        }
      : null,
    websiteUrl: row.websiteUrl,
    directionsUrl: row.mapsQuery
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(VILLA_LOCATION.mapsQuery)}&destination=${encodeURIComponent(row.mapsQuery)}&travelmode=driving`
      : null,
  };
}

/** The places the owner has published, in the order they set. */
export async function getActivities(): Promise<Activity[]> {
  const rows = await db.activity.findMany({ where: { published: true }, orderBy: { position: "asc" } });
  return rows.map(toActivity);
}
