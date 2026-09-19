import type { Locale } from "@/lib/i18n/locales";

/** A field the owner writes once per language in the dashboard. */
export type Localized = Record<Locale, string>;

export type ContentImage = {
  /** A path under /public today, an uploaded URL once the dashboard stores images. */
  src: string;
  alt: Localized;
};

/**
 * What the public components need from one amenity. The database row carries
 * more (position, published, timestamps); the query applies those, so the view
 * never has to.
 */
export type Amenity = {
  id: string;
  slug: string;
  name: Localized;
  image: ContentImage | null;
};

export function pick(text: Localized, locale: Locale): string {
  return text[locale] || text.fr;
}
