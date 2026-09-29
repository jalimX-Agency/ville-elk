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
    concierge: string;
    activities: string;
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
    conciergeLink: string;
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
    /** Names of the parts of a suite its photographs are sorted into. */
    spaces: Record<"bedroom" | "desk" | "bathroom" | "balcony" | "details" | "other", string>;
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
      booked: string;
      pickArrival: string;
      pickDeparture: string;
      clear: string;
      done: string;
      previousMonth: string;
      nextMonth: string;
      fewer: string;
      more: string;
      datePlaceholder: string;
    };
    /** The two steps of the booking form: dates first, then contact details. */
    wizard: {
      step: string;
      datesTitle: string;
      detailsTitle: string;
      continue: string;
      edit: string;
      available: string;
      summary: string;
      estimate: string;
      estimateNote: string;
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
      minStay: string;
      unavailable: string;
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
    mapCta: string;
  };
  /** Rates and house rules, shown on the concierge page, the booking page and the home page. */
  stay: {
    eyebrow: string;
    from: string;
    price: string;
    per: string;
    approx: string;
    taxLabel: string;
    tax: string;
    taxApprox: string;
    minStay: string;
    languages: string;
  };
  concierge: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    intro: string[];
    groups: { title: string; items: { name: string; body: string }[] }[];
    onDemandTitle: string;
    onDemand: string;
    stepsTitle: string;
    stepsIntro: string;
    steps: string[];
    exclusive: string;
    terms: string;
    cta: string;
    imageAlt: string;
  };
  /** The page of things to do near the villa; the places themselves live in the database. */
  activities: {
    meta: { title: string; description: string };
    eyebrow: string;
    title: string;
    intro: string;
    timelineTitle: string;
    minutes: string;
    website: string;
    directions: string;
    categories: Record<"golf" | "loisirs" | "aquatique" | "restauration", string>;
    credit: string;
    conciergeTitle: string;
    conciergeBody: string;
    conciergeCta: string;
    homeLink: string;
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
