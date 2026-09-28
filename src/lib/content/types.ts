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

/** One room the villa lets, as the public pages read it. */
export type Suite = {
  id: string;
  slug: string;
  /** Matches the levels tour: "0" for the ground floor, "+1" for upstairs. */
  level: string;
  areaSqm: number | null;
  name: Localized;
  description: Localized;
  features: Record<Locale, string[]>;
  image: ContentImage | null;
};

/** The parts of the house the gallery is filtered by, in visiting order. */
export const GALLERY_CATEGORIES = ["exterieur", "rdc", "sous-sol", "suites", "rooftop"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(value);
}

/** The parts of a suite its photographs are sorted into, in page order. */
export const SUITE_SPACES = ["bedroom", "desk", "bathroom", "balcony", "details"] as const;
export type SuiteSpace = (typeof SUITE_SPACES)[number];

export function isSuiteSpace(value: string): value is SuiteSpace {
  return (SUITE_SPACES as readonly string[]).includes(value);
}

/**
 * A suite's photographs grouped by part, in the order of SUITE_SPACES, with
 * unsorted ones last. The sort is stable, so each part keeps the order given.
 */
export function sortBySpace<T>(items: T[], spaceOf: (item: T) => string | null | undefined): T[] {
  const rank = (item: T) => {
    const space = spaceOf(item);
    return space && isSuiteSpace(space) ? SUITE_SPACES.indexOf(space) : SUITE_SPACES.length;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}

/** One photograph in the gallery. The alt text is the only copy it carries. */
export type GalleryPhoto = {
  id: string;
  category: GalleryCategory;
  /** On a suite's page, the part of the suite it shows; null when unsorted. */
  space?: SuiteSpace | null;
  image: ContentImage;
};
