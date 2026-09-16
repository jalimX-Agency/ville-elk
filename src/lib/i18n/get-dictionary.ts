import { type Locale } from "./locales";
import { fr } from "./dictionaries/fr";
import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";
import { es } from "./dictionaries/es";

const dictionaries = { fr, en, ar, es };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
