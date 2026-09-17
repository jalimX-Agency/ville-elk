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
  concept: {
    eyebrow: string;
    title: string;
    body: string;
    stats: { value: string; label: string }[];
  };
  tour: {
    eyebrow: string;
    title: string;
    levelLabel: string;
    levels: { code: string; name: string; title: string; body: string; spaces: string[] }[];
  };
  amenities: {
    eyebrow: string;
    title: string;
    items: {
      piscine: string;
      hammam: string;
      jardin: string;
      gym: string;
      cinema: string;
      parking: string;
      climatisation: string;
      barbecue: string;
    };
  };
  gallery: {
    eyebrow: string;
    title: string;
    note: string;
  };
  booking: {
    eyebrow: string;
    title: string;
    currency: string;
    policyTitle: string;
    policyLines: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    name: string;
    whatsappCta: string;
    emailCta: string;
  };
  building: {
    eyebrow: string;
    title: string;
    body: string;
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
