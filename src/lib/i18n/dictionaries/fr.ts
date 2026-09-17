import type { Dictionary } from "./types";

export const fr = {
  meta: {
    title: "Villa Elk — Villa de luxe à Golf Argan, Marrakech",
    description:
      "Villa Elk, villa contemporaine de 4 chambres sur 3 niveaux à Golf Argan Resort, quartier Agdal, Marrakech. Piscine privée, hammam, cinéma privé — jusqu'à 10 invités.",
  },
  nav: {
    home: "Accueil",
    rooms: "Chambres",
    gallery: "Galerie",
    amenities: "Prestations",
    contact: "Contact",
    bookNow: "Réserver",
  },
  hero: {
    eyebrow: "Golf Argan · Agdal · Marrakech",
    title: "Villa Elk",
    threshold: "Passez le seuil.",
    scroll: "Entrer",
    subtitle:
      "Une villa de ville à l'architecture moderne et épurée, sur trois niveaux, au cœur du quartier touristique d'Agdal.",
    cta: "Découvrir la villa",
    bookCta: "Demander une disponibilité",
  },
  concept: {
    eyebrow: "L'esprit du lieu",
    title: "Trois niveaux, une seule idée : le calme",
    body: "Golf Argan Resort, extension — villa 2. À quelques minutes du golf et du cœur d'Agdal, Villa Elk déroule ses volumes sur trois niveaux : lignes nettes, pierre claire et lumière rasante, pensés pour des séjours entre proches ou en famille.",
    stats: [
      { value: "04", label: "Chambres / suites" },
      { value: "10", label: "Invités maximum" },
      { value: "03", label: "Niveaux" },
    ],
  },
  tour: {
    eyebrow: "La villa",
    title: "Niveau par niveau",
    levelLabel: "Niveau",
    levels: [
      {
        code: "0",
        name: "Rez-de-chaussée",
        title: "Vivre",
        body: "Le seuil franchi, les salons et la salle à manger s'ouvrent de plain-pied sur la terrasse et la piscine privée.",
        spaces: ["Salon marocain", "Salon & cheminée", "Salle à manger", "Piscine & terrasse", "Coin barbecue"],
      },
      {
        code: "−1",
        name: "Niveau inférieur",
        title: "Se ressourcer",
        body: "En contrebas, à l'abri de la chaleur : le hammam, la salle de sport ouverte sur un patio de bambous, et la salle de cinéma.",
        spaces: ["Hammam", "Salle de sport", "Salle de cinéma"],
      },
      {
        code: "+1",
        name: "Étage",
        title: "Dormir",
        body: "À l'étage, quatre chambres accueillent jusqu'à dix invités, avec des salles de bain en marbre.",
        spaces: ["4 chambres", "Salles de bain en marbre", "Jusqu'à 10 invités"],
      },
    ],
  },
  amenities: {
    eyebrow: "Prestations",
    title: "Ce que la villa réserve",
    items: {
      piscine: "Piscine privée & terrasse",
      hammam: "Hammam & spa",
      jardin: "Jardin paysager",
      gym: "Salle de sport",
      cinema: "Salle de cinéma privée",
      parking: "Parking sécurisé",
      climatisation: "Climatisation intégrale",
      barbecue: "Coin barbecue sur la terrasse",
    },
  },
  gallery: {
    eyebrow: "Visite",
    title: "À l'intérieur de Villa Elk",
    note: "Photos prises par le propriétaire — un reportage professionnel suivra prochainement.",
  },
  booking: {
    eyebrow: "Réservation",
    title: "Conditions de séjour",
    currency: "Tarifs affichés en MAD (Dirham marocain)",
    policyTitle: "Politique de réservation",
    policyLines: [
      "Acompte obligatoire à la réservation",
      "Annulation possible jusqu'à 48h avant l'arrivée",
      "Paiement par virement, espèces ou carte bancaire",
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre séjour",
    description:
      "Fatima-Zahra et l'équipe de Villa Elk répondent sous 24h pour organiser votre séjour à Marrakech.",
    name: "Fatima-Zahra",
    whatsappCta: "Écrire sur WhatsApp",
    emailCta: "Envoyer un email",
  },
  building: {
    eyebrow: "Site en construction",
    title: "La suite arrive bientôt",
    body: "Réservation en ligne, galerie, prestations et informations pratiques sont en cours de préparation. En attendant, écrivez-nous directement : nous répondons sous 24h.",
  },
  theme: {
    toDark: "Passer en mode sombre",
    toLight: "Passer en mode clair",
  },
  footer: {
    description: "Villa Elk — Golf Argan Resort, Agdal, Marrakech.",
    rights: "Tous droits réservés.",
  },
} satisfies Dictionary;
