import type { Locale } from "@/lib/i18n/locales";

/** A field the owner edits once per language in the dashboard. */
export type Localized = Record<Locale, string>;

export type ContentImage = {
  /** Local path today, an R2 URL once the dashboard uploads images. */
  src: string;
  alt: Localized;
};

/**
 * One row of the future `Amenity` table. Keep this shape in sync with the
 * Prisma model: the dashboard writes these fields and `getAmenities` is the
 * only place that needs to change when it goes live.
 */
export type Amenity = {
  id: string;
  order: number;
  published: boolean;
  name: Localized;
  image: ContentImage | null;
};

export function pick(text: Localized, locale: Locale): string {
  return text[locale] || text.fr;
}
