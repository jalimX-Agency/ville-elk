import { getDefaultDictionary } from "@/lib/i18n/get-dictionary";
import { flatten, getAt, type Field } from "./dictionary-paths";

/**
 * How the dashboard presents the site's copy: which parts of the dictionary
 * are one editing screen each, and a French label for every field. The owner
 * reads these, so they name what a visitor sees, not the code's keys.
 */
export const SECTIONS = [
  { key: "hero", title: "Accueil — ouverture", hint: "Le grand titre et les boutons du haut de la page d'accueil." },
  { key: "tour", title: "Accueil — niveau par niveau", hint: "Les quatre niveaux de la villa et leurs espaces." },
  { key: "amenities", title: "Accueil — prestations", hint: "Le titre de la section. Les prestations elles-mêmes se modifient dans « Prestations »." },
  { key: "location", title: "Accueil — emplacement", hint: "Les temps de trajet affichés sur la page d'accueil." },
  { key: "suites", title: "Page Suites", hint: "Les textes de la page des suites et des pages de chaque suite." },
  { key: "gallery", title: "Page Galerie", hint: "Le titre, l'introduction et les noms des catégories." },
  { key: "reserve", title: "Page Réservation", hint: "Le formulaire, ses messages et l'encadré « Bon à savoir »." },
  { key: "stay", title: "Tarifs & séjour minimum", hint: "Le prix, la taxe de séjour, le séjour minimum et les langues parlées. Affichés sur la réservation, le menu du téléphone, l'accueil et le pied de page." },
  { key: "concierge", title: "Page Conciergerie", hint: "Le « menu » des services de conciergerie. La photo se change dans « Réglages »." },
  { key: "contact", title: "Contact", hint: "Les textes de la page contact. Le numéro et l'email se modifient dans « Réglages »." },
  { key: "meta", title: "Google — page d'accueil", hint: "Le titre et la description qui apparaissent dans les résultats de recherche." },
  { key: "nav", title: "Menu", hint: "Les liens du menu en haut de chaque page." },
  { key: "footer", title: "Pied de page", hint: "" },
  { key: "theme", title: "Bouton clair / sombre", hint: "Ce que lit un lecteur d'écran sur le bouton en bas à gauche." },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];

export function isSectionKey(key: string): key is SectionKey {
  return SECTIONS.some((section) => section.key === key);
}

/**
 * Fields that steer behaviour rather than wording: the level codes drive the
 * section drawing and the order of the tour, so changing one would break it.
 */
const LOCKED = [/^tour\.levels\.\d+\.code$/];

export function sectionFields(section: SectionKey): Field[] {
  return flatten(getDefaultDictionary("fr"))
    .filter((field) => field.path === section || field.path.startsWith(`${section}.`))
    .filter((field) => !LOCKED.some((rule) => rule.test(field.path)));
}

const WORDS: Record<string, string> = {
  title: "Titre",
  eyebrow: "Surtitre",
  subtitle: "Sous-titre",
  intro: "Introduction",
  body: "Texte",
  description: "Description",
  cta: "Bouton",
  bookCta: "Bouton de réservation",
  scroll: "Invitation à entrer",
  threshold: "Grand titre",
  name: "Nom",
  spaces: "Espaces (un par ligne)",
  main: "description de la photo principale",
  detail: "description de la petite photo",
  minutes: "Minutes",
  label: "Lieu",
  unit: "Unité des minutes",
  note: "Note",
  levelLabel: "Le mot « Niveau »",
  home: "Accueil",
  rooms: "Suites",
  gallery: "Galerie",
  amenities: "Prestations",
  contact: "Contact",
  bookNow: "Bouton Réserver",
  asideTitle: "Encadré — titre",
  asideLines: "Encadré — lignes (une par ligne)",
  areaLabel: "Mot avant la surface",
  ground: "Rez-de-chaussée",
  upper: "Étage",
  viewSuite: "Lien « Voir la suite »",
  backToSuites: "Lien de retour",
  featuresTitle: "Titre des équipements",
  photosTitle: "Titre des photos",
  otherSuites: "Titre « autres suites »",
  allPhotos: "Bouton « toutes les photos »",
  photosUnit: "Le mot « photos »",
  ctaTitle: "Titre de l'appel à réserver",
  suiteLabel: "Le mot « Suite »",
  bedroom: "Chambre",
  desk: "Coin bureau",
  bathroom: "Salle de bain",
  balcony: "Balcon",
  details: "Détails",
  other: "Photos non classées",
  filterLabel: "Titre des filtres (lecteur d'écran)",
  showMore: "Bouton « afficher plus »",
  shownOf: "Compteur « photos affichées sur »",
  open: "Agrandir",
  close: "Fermer",
  previous: "Précédente",
  next: "Suivante",
  all: "Tout",
  exterieur: "Extérieur",
  rdc: "Rez-de-chaussée",
  sousSol: "Sous-sol",
  rooftop: "Rooftop",
  suites: "Suites",
  whatsappCta: "Bouton WhatsApp",
  emailCta: "Bouton email",
  instagramCta: "Bouton Instagram",
  addressTitle: "Titre de l'adresse",
  address: "Adresse",
  reachTitle: "Titre « nous joindre »",
  rights: "Mention « tous droits réservés »",
  toDark: "Passer en sombre",
  toLight: "Passer en clair",
  email: "Email",
  phone: "Téléphone",
  phoneHint: "Aide sous le téléphone",
  arrival: "Arrivée",
  departure: "Départ",
  guests: "Invités",
  message: "Message",
  messageHint: "Aide sous le message",
  submit: "Bouton d'envoi",
  submitting: "Pendant l'envoi",
  nights: "Le mot « nuits »",
  again: "Lien « nouvelle demande »",
  order: "Départ avant l'arrivée",
  past: "Date passée",
  generic: "Erreur d'envoi",
  concierge: "Conciergerie",
  conciergeLink: "Lien vers la conciergerie",
  minStay: "Séjour minimum",
  from: "« À partir de »",
  price: "Prix",
  per: "« la nuit »",
  approx: "Prix en euros",
  taxLabel: "Titre de la taxe de séjour",
  tax: "Taxe de séjour",
  taxApprox: "Taxe en euros",
  languages: "Langues parlées",
  onDemandTitle: "« Sur demande » — titre",
  onDemand: "« Sur demande » — texte",
  stepsTitle: "« Votre envie » — titre",
  stepsIntro: "« Votre envie » — texte",
  steps: "Étapes (une par ligne)",
  exclusive: "Réservé aux clients",
  terms: "Conditions",
  imageAlt: "Description de la photo",
};

/** Names for the numbered entries of a list: "Rubrique 2 — Service 1 — Nom". */
const INDEXED: Record<string, string> = { places: "Lieu", groups: "Rubrique", items: "Service" };

const GROUPS: Record<string, string> = {
  meta: "Google",
  form: "Formulaire",
  success: "Confirmation",
  errors: "Erreurs",
  levelNames: "Niveaux",
  categories: "Catégories",
  viewer: "Visionneuse",
  photos: "Photo",
  spaces: "Parties de la suite",
};

/** "tour.levels.2.photos.main" → "Niveau +1 — Photo — description de la photo principale". */
export function fieldLabel(path: string): string {
  const keys = path.split(".").slice(1); // the section is the screen's title
  const parts: string[] = [];
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const isLast = i === keys.length - 1;
    const nextIsIndex = /^\d+$/.test(keys[i + 1] ?? "");
    if (/^\d+$/.test(key)) continue;
    if (nextIsIndex) {
      const index = Number(keys[i + 1]);
      if (path.startsWith("tour.levels.")) {
        const code = getAt(getDefaultDictionary("fr"), `tour.levels.${index}.code`);
        parts.push(`Niveau ${code}`);
      } else {
        parts.push(`${INDEXED[key] ?? key} ${index + 1}`);
      }
      continue;
    }
    if (isLast) parts.push(WORDS[key] ?? key);
    else parts.push(GROUPS[key] ?? WORDS[key] ?? key);
  }
  return parts.join(" — ") || path;
}
