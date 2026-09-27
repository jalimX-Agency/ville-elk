import type { GalleryCategory } from "@/lib/content/types";

/** The dashboard is in French; these are the names the owner picks from. */
export const CATEGORY_OPTIONS: { value: GalleryCategory; label: string }[] = [
  { value: "exterieur", label: "Extérieur" },
  { value: "rdc", label: "Rez-de-chaussée" },
  { value: "sous-sol", label: "Sous-sol" },
  { value: "suites", label: "Suites" },
  { value: "rooftop", label: "Rooftop" },
];
