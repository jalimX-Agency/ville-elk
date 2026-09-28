import "server-only";
import { cache } from "react";
import { db } from "@/lib/db/client";
import { getDefaultDictionary } from "@/lib/i18n/get-dictionary";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { Locale } from "@/lib/i18n/locales";
import { setAt } from "./dictionary-paths";

/**
 * The site's copy in one language: the text in the code, with the owner's
 * changes from the dashboard laid over it. Memoised per request, and never the
 * reason a page fails — if the database cannot be reached, the original text
 * is served.
 */
export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const dictionary = structuredClone(getDefaultDictionary(locale));
  try {
    const rows = await db.siteText.findMany({ where: { locale } });
    for (const row of rows) setAt(dictionary, row.key, row.value);
  } catch (error) {
    console.error("Site text unavailable, serving the defaults", error);
  }
  return dictionary;
});

/** Settings the owner can change, with the value the site uses when they have not. */
export const SETTING_DEFAULTS = {
  "contact.whatsapp": "33627874284",
  "contact.email": "contact@villaelk.com",
  "contact.instagram": "villaelkkech",
  "image.hero": "/images/villa-elk/piscine.jpg",
  "image.levels.0.main": "/images/villa-elk/piscine-terrasse.jpg",
  "image.levels.0.detail": "/images/villa-elk/salon-marocain.jpg",
  "image.levels.1.main": "/images/villa-elk/hammam.jpg",
  "image.levels.1.detail": "/images/villa-elk/salle-de-sport.jpg",
  "image.levels.2.main": "/images/villa-elk/suite-parentale.jpg",
  "image.levels.2.detail": "/images/villa-elk/suite-parentale-baignoire.jpg",
  "image.levels.3.main": "/images/villa-elk/sta7.jpg",
  "image.levels.3.detail": "/images/villa-elk/sta7-four-a-pizza.jpg",
  "image.explore.suites": "/images/villa-elk/suite-parentale.jpg",
  "image.explore.gallery": "/images/villa-elk/salon-europeen.jpg",
  "image.concierge": "/images/villa-elk/salon-marocain.jpg",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type Settings = Record<SettingKey, string>;

export function isSettingKey(key: string): key is SettingKey {
  return key in SETTING_DEFAULTS;
}

export const getSettings = cache(async (): Promise<Settings> => {
  const settings: Settings = { ...SETTING_DEFAULTS };
  try {
    const rows = await db.siteSetting.findMany();
    for (const row of rows) {
      if (isSettingKey(row.key) && row.value.trim()) settings[row.key] = row.value.trim();
    }
  } catch (error) {
    console.error("Site settings unavailable, serving the defaults", error);
  }
  return settings;
});

export type Contact = { whatsapp: string; email: string; instagram: string };

export async function getContact(): Promise<Contact> {
  const s = await getSettings();
  return {
    // wa.me wants digits only
    whatsapp: s["contact.whatsapp"].replace(/\D/g, ""),
    email: s["contact.email"],
    instagram: s["contact.instagram"].replace(/^@/, ""),
  };
}
