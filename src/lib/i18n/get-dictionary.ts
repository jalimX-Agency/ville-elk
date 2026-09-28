import { type Locale } from "./locales";
import { fr } from "./dictionaries/fr";
import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";
import { es } from "./dictionaries/es";
import type { Dictionary } from "./dictionaries/types";

const dictionaries = { fr, en, ar, es };

/**
 * The copy as written in the code, before the owner's changes. The site reads
 * getDictionary in lib/content/site.ts, which applies them; this is for the
 * dashboard, which shows the original next to each field.
 */
export function getDefaultDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
