import type { Dictionary } from "./types";

export const en = {
  meta: {
    title: "Villa Elk — Luxury Villa at Golf Argan, Marrakech",
    description:
      "Villa Elk, a contemporary villa with three suites and a bedroom across 3 levels at Golf Argan Resort, Agdal, Marrakech. Private pool, hammam, home cinema — sleeps up to 10 guests.",
  },
  nav: {
    home: "Home",
    rooms: "Suites",
    gallery: "Gallery",
    amenities: "Amenities",
    contact: "Contact",
    bookNow: "Book now",
  },
  hero: {
    eyebrow: "Golf Argan · Agdal · Marrakech",
    title: "Villa Elk",
    threshold: "Step across the threshold.",
    scroll: "Enter",
    subtitle:
      "A modern, clean-lined city villa spread across three levels, in the heart of Marrakech's Agdal district.",
    cta: "Discover the villa",
    bookCta: "Check availability",
  },
  concept: {
    eyebrow: "The spirit of the place",
    title: "Three levels, one idea: calm",
    body: "Golf Argan Resort, extension — villa 2. Minutes from the golf course and the heart of Agdal, Villa Elk unfolds across three levels: clean lines, light stone and low, raking light — built for stays among family and close friends.",
    stats: [
      { value: "04", label: "Bedrooms / suites" },
      { value: "10", label: "Guests maximum" },
      { value: "03", label: "Levels" },
    ],
  },
  tour: {
    eyebrow: "The villa",
    title: "Level by level",
    levelLabel: "Level",
    levels: [
      {
        code: "0",
        name: "Ground floor",
        title: "Live",
        body: "Past the threshold: a double living room, European and Moroccan, the dining room and kitchen, a bedroom with its own bathroom — and the terrace opening onto the pool.",
        spaces: ["European & Moroccan living rooms", "Dining room", "Kitchen", "Bedroom with bathroom", "Pool & terrace", "Barbecue corner", "Secure indoor garage", "Small garden"],
      },
      {
        code: "−1",
        name: "Lower level",
        title: "Restore",
        body: "Below, sheltered from the heat: the hammam, a gym opening onto a bamboo patio, and the cinema room.",
        spaces: ["Hammam", "Gym", "Cinema room"],
      },
      {
        code: "+1",
        name: "Upper floor",
        title: "Sleep",
        body: "Upstairs, three suites including a master suite of over 50 m², with bathrooms in large-format Italian tile.",
        spaces: ["Master suite · over 50 m²", "Two suites", "Large-format Italian tile", "Up to 10 guests"],
      },
    ],
  },
  amenities: {
    eyebrow: "Amenities",
    title: "What the villa offers",
    items: {
      piscine: "Private pool & terrace",
      hammam: "Hammam & spa",
      jardin: "Landscaped garden",
      gym: "Gym",
      cinema: "Private home cinema",
      parking: "Secure parking",
      climatisation: "Full air conditioning",
      barbecue: "Terrace barbecue corner",
    },
  },
  gallery: {
    eyebrow: "Walkthrough",
    title: "Inside Villa Elk",
    note: "Photos taken by the owner — a professional shoot is coming soon.",
  },
  booking: {
    eyebrow: "Booking",
    title: "Stay conditions",
    currency: "Rates shown in MAD (Moroccan Dirham)",
    policyTitle: "Booking policy",
    policyLines: [
      "Deposit required to confirm booking",
      "Free cancellation up to 48h before arrival",
      "Payment by bank transfer, cash or card",
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's plan your stay",
    description:
      "Fatima-Zahra and the Villa Elk team reply within 24h to help plan your stay in Marrakech.",
    name: "Fatima-Zahra",
    whatsappCta: "Message on WhatsApp",
    emailCta: "Send an email",
  },
  building: {
    eyebrow: "Site under construction",
    title: "More is on its way",
    body: "Online booking, the gallery, amenities and practical information are being prepared. In the meantime, write to us directly: we reply within 24 hours.",
  },
  theme: {
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
  },
  footer: {
    description: "Villa Elk — Golf Argan Resort, Agdal, Marrakech.",
    rights: "All rights reserved.",
  },
} satisfies Dictionary;
