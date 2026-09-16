import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.villaelk.com";
  return locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === "fr" ? 1 : 0.8,
  }));
}
