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
    concierge: "Conciergerie",
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
    conciergeLink: "Découvrir la conciergerie privée",
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
      booked: "Réservé",
      pickArrival: "Choisissez votre arrivée",
      pickDeparture: "Choisissez votre départ",
      clear: "Effacer les dates",
      done: "Valider",
      previousMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      fewer: "Moins d'invités",
      more: "Plus d'invités",
      datePlaceholder: "Choisir",
    },
    wizard: {
      step: "Étape",
      datesTitle: "Vos dates",
      detailsTitle: "Vos coordonnées",
      continue: "Continuer",
      edit: "Modifier",
      available: "Ces dates sont disponibles.",
      summary: "Votre séjour",
      estimate: "Estimation",
      estimateNote: "au tarif de base, taxe de séjour en sus",
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
      minStay: "Le séjour minimum est de 3 nuits.",
      unavailable: "Ces dates ne sont plus disponibles : la villa est déjà réservée sur une partie de ce séjour. Choisissez d'autres dates.",
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
  stay: {
    eyebrow: "Tarifs",
    from: "À partir de",
    price: "3 700 DH",
    per: "la nuit",
    approx: "environ 350 €",
    taxLabel: "Taxe de séjour",
    tax: "31 DH par personne et par nuit",
    taxApprox: "environ 3 €",
    minStay: "Séjour minimum de 3 nuits afin de garantir une expérience privilégiée.",
    languages: "Notre équipe vous parle arabe, français et anglais.",
  },
  concierge: {
    meta: {
      title: "Conciergerie privée — Villa Elk, Marrakech",
      description: "Transferts, chef privé, excursions, soins à domicile, garde d'enfants : la conciergerie privée de Villa Elk organise votre séjour à Marrakech, sur simple demande.",
    },
    eyebrow: "Conciergerie privée",
    title: "L'art de vivre Marrakech, en toute simplicité.",
    intro: [
      "Parce qu'un séjour d'exception ne se limite pas à une belle villa, Villa Elk vous ouvre les portes d'un service de conciergerie privé, pensé pour répondre à vos envies et vous faire profiter pleinement de Marrakech.",
      "À travers notre réseau de partenaires soigneusement sélectionnés, nous vous accompagnons avant votre arrivée et tout au long de votre séjour afin d'organiser, sur simple demande, les services dont vous avez besoin.",
    ],
    groups: [
      {
        title: "Arrivée & transport",
        items: [
          {
            name: "Transferts privés depuis et vers l'aéroport",
            body: "Accueil personnalisé et organisation de vos déplacements.",
          },
          {
            name: "Location de véhicules",
            body: "Véhicules de standing, avec ou sans chauffeur, selon vos besoins.",
          },
        ],
      },
      {
        title: "Art de vivre & restauration",
        items: [
          {
            name: "Réservations exclusives",
            body: "Restaurants, tables privilégiées, rooftops, établissements tendance, beach clubs et adresses confidentielles.",
          },
          {
            name: "Chef & cuisinier privé",
            body: "Petit-déjeuner, déjeuner, dîner ou réception privée directement à la villa, selon vos envies.",
          },
        ],
      },
      {
        title: "Expériences privées",
        items: [
          {
            name: "Excursions & découvertes sur mesure",
            body: "Atlas, désert d'Agafay, escapades privées, activités culturelles et expériences authentiques autour de Marrakech.",
          },
          {
            name: "Programmes personnalisés",
            body: "Nous pouvons également organiser des programmes personnalisés pour vous faire découvrir la région à votre rythme.",
          },
        ],
      },
      {
        title: "Beauté & bien-être",
        items: [
          {
            name: "Beauté à domicile",
            body: "Soins, massages et prestations bien-être directement dans l'intimité de votre villa.",
          },
          {
            name: "Coiffeur & soins traditionnels",
            body: "Coiffure, hammam, gommage traditionnel et soins de beauté réalisés par des professionnels sélectionnés.",
          },
        ],
      },
      {
        title: "Sport & bien-être",
        items: [
          {
            name: "Coach sportif privé",
            body: "Séances personnalisées à la villa ou dans un espace adapté, selon vos objectifs et votre programme.",
          },
        ],
      },
      {
        title: "Services pour les familles",
        items: [
          {
            name: "Nounou & garde d'enfants",
            body: "Mise en relation avec des professionnels sélectionnés afin de permettre aux parents de profiter pleinement de leur séjour, en toute sérénité.",
          },
        ],
      },
    ],
    onDemandTitle: "Et tout ce dont vous avez besoin",
    onDemand: "Un besoin qui ne figure pas dans cette liste ? Demandez-nous : nous l'organisons sur demande.",
    stepsTitle: "Votre envie, notre organisation",
    stepsIntro: "À Villa Elk, nous souhaitons que chaque détail de votre séjour soit simple, fluide et personnalisé.",
    steps: [
      "Vous nous faites part de votre souhait.",
      "Nous vous mettons en relation avec le partenaire adapté.",
    ],
    exclusive: "Notre service de conciergerie est exclusivement proposé aux clients de Villa Elk.",
    terms: "Les prestations sont réalisées directement par nos partenaires et sont soumises à disponibilité, réservation préalable et tarification selon les services demandés.",
    cta: "Demander un service",
    imageAlt: "Le salon marocain de la villa",
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
