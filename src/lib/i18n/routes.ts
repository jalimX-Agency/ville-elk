import type { Locale } from "./locales";
import { locales } from "./locales";

/**
 * Every page below the home page has its own slug per language, so each locale
 * gets a URL a search engine can read in that language rather than four copies
 * of a French word.
 */
export const pageSlugs = {
  suites: { fr: "suites", en: "suites", es: "suites", ar: "ajniha" },
  gallery: { fr: "galerie", en: "gallery", es: "galeria", ar: "maarid" },
  booking: { fr: "reserver", en: "booking", es: "reservar", ar: "hajz" },
  contact: { fr: "contact", en: "contact", es: "contacto", ar: "ittisal" },
  concierge: { fr: "conciergerie", en: "concierge", es: "conserjeria", ar: "khadamat" },
  activities: { fr: "activites", en: "activities", es: "actividades", ar: "anshita" },
  legal: { fr: "mentions-legales", en: "legal-notice", es: "aviso-legal", ar: "ishaar-qanouni" },
  privacy: { fr: "confidentialite", en: "privacy", es: "privacidad", ar: "khususiya" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pageSlugs;

export function slugFor(page: PageKey, locale: Locale): string {
  return pageSlugs[page][locale];
}

export function hrefFor(page: PageKey, locale: Locale): string {
  return `/${locale}/${slugFor(page, locale)}`;
}

/** The page a slug belongs to, or null when it is not one of ours. */
export function pageForSlug(slug: string, locale: Locale): PageKey | null {
  const entry = Object.entries(pageSlugs).find(([, slugs]) => slugs[locale] === slug);
  return entry ? (entry[0] as PageKey) : null;
}

/** Every locale/slug pair, for prerendering. */
export function allPageParams(): { locale: Locale; slug: string }[] {
  return locales.flatMap((locale) =>
    Object.values(pageSlugs).map((slugs) => ({ locale, slug: slugs[locale] })),
  );
}

/**
 * The same page in another language. The slug changes with the locale, so the
 * language switcher cannot simply swap the first segment: /fr/reserver has to
 * become /en/booking, not /en/reserver.
 */
export function translatePath(pathname: string, from: Locale, to: Locale): string {
  const rest = pathname.replace(new RegExp(`^/${from}(?=/|$)`), "");
  const [slug, ...tail] = rest.replace(/^\//, "").split("/");
  if (!slug) return `/${to}`;

  // Only the page segment is translated; what follows it (a suite's own slug)
  // is the same in every language.
  const page = pageForSlug(slug, from);
  const after = tail.length ? `/${tail.join("/")}` : "";
  return page ? `/${to}/${slugFor(page, to)}${after}` : `/${to}${rest}`;
}

/** A suite's own page: /fr/suites/suite-parentale, /ar/ajniha/suite-parentale… */
export function suiteHref(suiteSlug: string, locale: Locale): string {
  return `${hrefFor("suites", locale)}/${suiteSlug}`;
}
