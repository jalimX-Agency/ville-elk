import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/locales";
import { hrefFor, pageSlugs, type PageKey } from "@/lib/i18n/routes";

const BASE = "https://www.villaelk.com";

/**
 * Every page in every language, each one declaring the other three, so search
 * engines serve the right language rather than picking one and translating it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = (path: (locale: (typeof locales)[number]) => string) =>
    Object.fromEntries(locales.map((locale) => [locale, `${BASE}${path(locale)}`]));

  const home = locales.map((locale) => ({
    url: `${BASE}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "fr" ? 1 : 0.8,
    alternates: { languages: alternates((l) => `/${l}`) },
  }));

  const pages = (Object.keys(pageSlugs) as PageKey[]).flatMap((page) =>
    locales.map((locale) => ({
      url: `${BASE}${hrefFor(page, locale)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === "fr" ? 0.9 : 0.7,
      alternates: { languages: alternates((l) => hrefFor(page, l)) },
    })),
  );

  return [...home, ...pages];
}
