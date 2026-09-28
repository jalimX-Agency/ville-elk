import type { Dictionary } from "./types";

export const fr = {
  meta: {
    title: "Villa Elk — Villa de luxe à Golf Argan, Marrakech",
    description:
      "Villa privée de quatre suites à Golf Argan, Marrakech, à 12 minutes de l'aéroport : piscine, hammam, cinéma, salle de sport et rooftop marocain. Jusqu'à 10 invités.",
  },
  nav: {
    home: "Accueil",
    rooms: "Suites",
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
      "Une maison de ville contemporaine sur trois niveaux et un rooftop, au calme, à douze minutes de l'aéroport.",
    cta: "Découvrir la villa",
    bookCta: "Demander une disponibilité",
  },
  tour: {
    eyebrow: "La villa",
    title: "Niveau par niveau",
    levelLabel: "Niveau",
    levels: [
      {
        code: "0",
        name: "Rez-de-chaussée",
        title: "Recevoir",
        body: "Le cœur de la maison : un double séjour, salon marocain et salon européen autour d'une cheminée contemporaine, la salle à manger et une cuisine entièrement équipée. Tout s'ouvre sur la terrasse et sa piscine privée, que des voilages protègent des regards.",
        spaces: ["Salon marocain & salon européen", "Cheminée contemporaine", "Salle à manger", "Cuisine équipée", "Suite avec salle d'eau", "Toilettes invités", "Piscine privée", "Terrasse, barbecue & table extérieure", "Garage intérieur sécurisé"],
        photos: { main: "La piscine privée sous sa pergola", detail: "Le salon marocain" },
      },
      {
        code: "−1",
        name: "Sous-sol",
        title: "Se ressourcer",
        body: "En contrebas, un étage entier consacré au bien-être : un spa avec hammam, une salle de sport ouverte sur un patio, une salle de cinéma privée et un espace coiffure. De quoi ne pas avoir à sortir.",
        spaces: ["Spa & hammam", "Salle de sport sur patio", "Salle de cinéma", "Espace coiffure", "Rangements"],
        photos: { main: "Le hammam", detail: "La salle de sport ouverte sur le patio" },
      },
      {
        code: "+1",
        name: "Étage",
        title: "Dormir",
        body: "Trois suites pensées comme des chambres d'hôtel, chacune avec son balcon privé. La suite parentale, d'environ 60 m², réunit dressing, bureau et une salle de bain avec baignoire en marbre et douche à l'italienne.",
        spaces: ["Suite parentale · environ 60 m²", "Deux suites avec balcon", "Baignoire en marbre", "Douches à l'italienne", "Literie haut de gamme"],
        photos: { main: "La suite parentale", detail: "La baignoire en marbre de la suite parentale" },
      },
      {
        code: "+2",
        name: "Rooftop",
        title: "Le Sta7",
        body: "Au sommet, le Sta7 change d'atmosphère : un salon marocain habillé de zellige, une cuisine d'été avec four à pizza et barbecue, et la vue jusqu'à l'Atlas. Pour les déjeuners qui durent et les dîners sous le ciel de Marrakech.",
        spaces: ["Salon marocain en zellige", "Cuisine d'été", "Four à pizza", "Barbecue", "Vue sur l'Atlas"],
        photos: { main: "Le salon marocain du rooftop", detail: "Le four à pizza du rooftop" },
      },
    ],
  },
  amenities: {
    eyebrow: "Prestations",
    title: "Ce que la villa réserve",
  },
  location: {
    eyebrow: "Emplacement",
    title: "Au calme, à quelques minutes de tout",
    intro:
      "Golf Argan Resort, dans le quartier d'Agdal : une rue tranquille, sans nuisance sonore, et pourtant tout Marrakech à portée de voiture.",
    places: [
      { minutes: "12", label: "Aéroport Marrakech-Ménara" },
      { minutes: "3", label: "Golfs Nouria & Argan" },
      { minutes: "3", label: "Avenue Mohammed VI" },
      { minutes: "5", label: "Morocco Mall" },
      { minutes: "5", label: "Al Mazar & cinéma Mégarama" },
    ],
    unit: "min",
    note: "Temps de trajet en voiture.",
  },
  suites: {
    meta: {
      title: "Suites — Villa Elk, Marrakech",
      description:
        "Quatre suites avec salle de bain, dont une suite parentale d'environ 60 m² avec baignoire en marbre, dressing et bureau. Balcons privés, literie haut de gamme.",
    },
    eyebrow: "Dormir",
    title: "Quatre suites",
    intro:
      "Trois suites à l'étage, chacune avec son balcon privé, et une quatrième de plain-pied près du séjour. Toutes ont leur salle de bain, une télévision, de nombreux rangements et une literie haut de gamme choisie pour des nuits vraiment reposantes.",
    levelNames: { ground: "Rez-de-chaussée", upper: "Étage" },
    areaLabel: "Environ",
    viewSuite: "Voir la suite",
    backToSuites: "Toutes les suites",
    featuresTitle: "Dans la suite",
    photosTitle: "En images",
    otherSuites: "Les autres suites",
    allPhotos: "Toutes les photos",
    photosUnit: "photos",
    ctaTitle: "La villa entière, pour vous seuls",
    suiteLabel: "Suite",
    spaces: {
      bedroom: "Chambre",
      desk: "Coin bureau",
      bathroom: "Salle de bain",
      balcony: "Balcon",
      details: "Détails",
      other: "Autres",
    },
  },
  gallery: {
    meta: {
      title: "Galerie — Villa Elk, Golf Argan, Marrakech",
      description:
        "La villa en images : piscine, rooftop, suites, hammam, cinéma et salle de sport, à Golf Argan, quartier Agdal, Marrakech.",
    },
    intro: "La villa telle qu'elle est, niveau par niveau — du sous-sol au rooftop.",
    eyebrow: "Visite",
    title: "À l'intérieur de Villa Elk",
    categories: {
      all: "Tout",
      exterieur: "Extérieur",
      rdc: "Rez-de-chaussée",
      sousSol: "Sous-sol",
      suites: "Suites",
      rooftop: "Rooftop",
    },
    filterLabel: "Filtrer par espace",
    showMore: "Afficher plus de photos",
    shownOf: "photos affichées sur",
    viewer: { open: "Agrandir la photo", close: "Fermer", previous: "Photo précédente", next: "Photo suivante" },
  },
  reserve: {
    meta: {
      title: "Réserver Villa Elk — Location de villa entière à Marrakech",
      description:
        "Demandez vos dates pour Villa Elk, villa privée de quatre suites à Golf Argan, Marrakech. Location de la villa entière, jusqu'à 10 invités. Réponse sous 24h.",
    },
    eyebrow: "Réservation",
    title: "Demandez vos dates",
    intro:
      "Villa Elk se loue entière, à un seul groupe à la fois. Dites-nous quand vous souhaitez venir et à combien : notre équipe vous répond sous 24 heures avec le tarif et les disponibilités.",
    asideTitle: "Bon à savoir",
    asideLines: [
      "La villa entière, jamais partagée",
      "Jusqu'à 10 invités",
      "Cette demande ne bloque aucune date et n'engage à rien",
      "Acompte à la confirmation, solde à l'arrivée",
      "Annulation possible jusqu'à 48h avant l'arrivée",
    ],
    form: {
      name: "Nom complet",
      email: "Email",
      phone: "Téléphone ou WhatsApp",
      phoneHint: "Facultatif — le plus rapide pour vous répondre",
      arrival: "Arrivée",
      departure: "Départ",
      guests: "Nombre d'invités",
      message: "Votre séjour",
      messageHint: "Facultatif — occasion, horaires d'arrivée, demandes particulières",
      submit: "Envoyer la demande",
      submitting: "Envoi…",
      nights: "nuits",
    },
    success: {
      title: "Demande envoyée",
      body: "Merci. Notre équipe revient vers vous sous 24 heures avec le tarif et la disponibilité de vos dates.",
      again: "Faire une autre demande",
    },
    errors: {
      name: "Indiquez votre nom.",
      email: "Indiquez une adresse email valide.",
      arrival: "Choisissez une date d'arrivée.",
      departure: "Choisissez une date de départ.",
      order: "Le départ doit suivre l'arrivée.",
      past: "Choisissez une date d'arrivée à venir.",
      guests: "La villa accueille jusqu'à 10 invités.",
      generic: "L'envoi a échoué. Réessayez, ou écrivez-nous sur WhatsApp.",
    },
  },
  contact: {
    meta: {
      title: "Contact — Villa Elk, Marrakech",
      description:
        "Écrivez à Villa Elk par WhatsApp ou par email. Golf Argan Resort, quartier Agdal, Marrakech. Réponse sous 24 heures.",
    },
    addressTitle: "Adresse",
    address: "Golf Argan Resort, extension — villa 2\nQuartier Agdal, Marrakech, Maroc",
    instagramCta: "Suivre sur Instagram",
    reachTitle: "Nous joindre",
    eyebrow: "Contact",
    title: "Parlons de votre séjour",
    description:
      "L'équipe de Villa Elk répond sous 24h pour organiser votre séjour à Marrakech.",
    whatsappCta: "Écrire sur WhatsApp",
    emailCta: "Envoyer un email",
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
