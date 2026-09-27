export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    rooms: string;
    gallery: string;
    amenities: string;
    contact: string;
    bookNow: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    threshold: string;
    scroll: string;
    subtitle: string;
    cta: string;
    bookCta: string;
  };
  tour: {
    eyebrow: string;
    title: string;
    levelLabel: string;
    levels: {
      code: string;
      name: string;
      title: string;
      body: string;
      spaces: string[];
      /** Alt text for the level's two photographs. */
      photos: { main: string; detail: string };
    }[];
  };
  amenities: {
    eyebrow: string;
    title: string;
  };
  location: {
    eyebrow: string;
    title: string;
    intro: string;
    places: { minutes: string; label: string }[];
    unit: string;
    note: string;
  };
  suites: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    intro: string;
    levelNames: { ground: string; upper: string };
    areaLabel: string;
    viewSuite: string;
    backToSuites: string;
    featuresTitle: string;
    photosTitle: string;
    otherSuites: string;
    allPhotos: string;
    photosUnit: string;
    ctaTitle: string;
    suiteLabel: string;
  };
  gallery: {
    meta: { title: string; description: string };
    intro: string;
    eyebrow: string;
    title: string;
    categories: {
      all: string;
      exterieur: string;
      rdc: string;
      sousSol: string;
      suites: string;
      rooftop: string;
    };
    filterLabel: string;
    showMore: string;
    shownOf: string;
    viewer: { open: string; close: string; previous: string; next: string };
  };
  reserve: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    intro: string;
    asideTitle: string;
    asideLines: string[];
    form: {
      name: string;
      email: string;
      phone: string;
      phoneHint: string;
      arrival: string;
      departure: string;
      guests: string;
      message: string;
      messageHint: string;
      submit: string;
      submitting: string;
      nights: string;
    };
    success: { title: string; body: string; again: string };
    errors: {
      name: string;
      email: string;
      arrival: string;
      departure: string;
      order: string;
      past: string;
      guests: string;
      generic: string;
    };
  };
  contact: {
    meta: { title: string; description: string };
    addressTitle: string;
    address: string;
    instagramCta: string;
    reachTitle: string;
    eyebrow: string;
    title: string;
    description: string;
    whatsappCta: string;
    emailCta: string;
  };
  theme: {
    toDark: string;
    toLight: string;
  };
  footer: {
    description: string;
    rights: string;
  };
}
