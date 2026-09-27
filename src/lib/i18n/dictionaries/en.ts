import type { Dictionary } from "./types";

export const en = {
  meta: {
    title: "Villa Elk — Luxury Villa at Golf Argan, Marrakech",
    description:
      "A private villa of four suites at Golf Argan, Marrakech, 12 minutes from the airport: pool, hammam, cinema, gym and a Moroccan rooftop. Up to 10 guests.",
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
      "A contemporary town house on three levels and a rooftop, quiet, twelve minutes from the airport.",
    cta: "Discover the villa",
    bookCta: "Check availability",
  },
  tour: {
    eyebrow: "The villa",
    title: "Level by level",
    levelLabel: "Level",
    levels: [
      {
        code: "0",
        name: "Ground floor",
        title: "Gathering",
        body: "The heart of the house: a double living room, Moroccan and European, around a contemporary fireplace, the dining room and a fully equipped kitchen. Everything opens onto the terrace and its private pool, screened from view by sheer curtains.",
        spaces: ["Moroccan & European living rooms", "Contemporary fireplace", "Dining room", "Equipped kitchen", "Suite with shower room", "Guest cloakroom", "Private pool", "Terrace, barbecue & outdoor dining", "Secure indoor garage"],
        photos: { main: "The private pool under its pergola", detail: "The Moroccan living room" },
      },
      {
        code: "−1",
        name: "Lower level",
        title: "Unwinding",
        body: "Below, a whole floor given to wellbeing: a spa with hammam, a gym opening onto a patio, a private cinema and a hair salon. Reason enough not to go out.",
        spaces: ["Spa & hammam", "Gym onto a patio", "Cinema room", "Hair salon", "Storage"],
        photos: { main: "The hammam", detail: "The gym opening onto the patio" },
      },
      {
        code: "+1",
        name: "Upper floor",
        title: "Sleeping",
        body: "Three suites designed like hotel rooms, each with a private balcony. The master suite, about 60 m², brings together a dressing room, a study and a bathroom with a marble bathtub and a walk-in shower.",
        spaces: ["Master suite · about 60 m²", "Two suites with balconies", "Marble bathtub", "Walk-in showers", "Premium bedding"],
        photos: { main: "The master suite", detail: "The marble bathtub in the master suite" },
      },
      {
        code: "+2",
        name: "Rooftop",
        title: "The Sta7",
        body: "At the top, the Sta7 changes the mood: a Moroccan lounge dressed in zellige, a summer kitchen with a pizza oven and barbecue, and the view out to the Atlas. For long lunches and dinners under the Marrakech sky.",
        spaces: ["Zellige Moroccan lounge", "Summer kitchen", "Pizza oven", "Barbecue", "View of the Atlas"],
        photos: { main: "The Moroccan lounge on the rooftop", detail: "The rooftop pizza oven" },
      },
    ],
  },
  amenities: {
    eyebrow: "Amenities",
    title: "What the villa offers",
  },
  location: {
    eyebrow: "Location",
    title: "Quiet, and minutes from everything",
    intro:
      "Golf Argan Resort, in the Agdal district: a calm street with no noise, and all of Marrakech within a short drive.",
    places: [
      { minutes: "12", label: "Marrakech Menara Airport" },
      { minutes: "3", label: "Nouria & Argan golf courses" },
      { minutes: "3", label: "Avenue Mohammed VI" },
      { minutes: "5", label: "Morocco Mall" },
      { minutes: "5", label: "Al Mazar & Megarama cinema" },
    ],
    unit: "min",
    note: "Driving times.",
  },
  suites: {
    meta: {
      title: "Suites — Villa Elk, Marrakech",
      description:
        "Four suites with their own bathrooms, including a master suite of about 60 m² with a marble bathtub, dressing room and study. Private balconies, premium bedding.",
    },
    eyebrow: "Sleeping",
    title: "Four suites",
    intro:
      "Three suites upstairs, each with a private balcony, and a fourth on the ground floor near the living rooms. All have their own bathroom, a television, generous storage and premium bedding chosen for properly restful nights.",
    levelNames: { ground: "Ground floor", upper: "Upper floor" },
    areaLabel: "About",
  },
  gallery: {
    meta: {
      title: "Gallery — Villa Elk, Golf Argan, Marrakech",
      description:
        "The villa in pictures: pool, rooftop, suites, hammam, cinema and gym, at Golf Argan, Agdal, Marrakech.",
    },
    intro: "The villa as it is, level by level — from the lower floor to the rooftop.",
    eyebrow: "Walkthrough",
    title: "Inside Villa Elk",
    categories: {
      all: "All",
      exterieur: "Outside",
      rdc: "Ground floor",
      sousSol: "Lower level",
      suites: "Suites",
      rooftop: "Rooftop",
    },
    filterLabel: "Filter by space",
    showMore: "Show more photos",
    shownOf: "photos shown of",
    viewer: { open: "Enlarge photo", close: "Close", previous: "Previous photo", next: "Next photo" },
  },
  reserve: {
    meta: {
      title: "Book Villa Elk — Whole-villa rental in Marrakech",
      description:
        "Request your dates at Villa Elk, a private villa of four suites at Golf Argan, Marrakech. The whole villa, up to 10 guests. We reply within 24 hours.",
    },
    eyebrow: "Booking",
    title: "Ask for your dates",
    intro:
      "Villa Elk is let whole, to one party at a time. Tell us when you would like to come and how many of you there are: our team replies within 24 hours with the rate and availability.",
    asideTitle: "Worth knowing",
    asideLines: [
      "The whole villa, never shared",
      "Up to 10 guests",
      "This request holds no dates and commits you to nothing",
      "Deposit on confirmation, balance on arrival",
      "Free cancellation up to 48 hours before arrival",
    ],
    form: {
      name: "Full name",
      email: "Email",
      phone: "Phone or WhatsApp",
      phoneHint: "Optional — the fastest way for us to reach you",
      arrival: "Arrival",
      departure: "Departure",
      guests: "Number of guests",
      message: "About your stay",
      messageHint: "Optional — the occasion, arrival times, anything particular",
      submit: "Send the request",
      submitting: "Sending…",
      nights: "nights",
    },
    success: {
      title: "Request sent",
      body: "Thank you. Our team will come back to you within 24 hours with the rate and availability for your dates.",
      again: "Send another request",
    },
    errors: {
      name: "Please give your name.",
      email: "Please give a valid email address.",
      arrival: "Choose an arrival date.",
      departure: "Choose a departure date.",
      order: "Departure must come after arrival.",
      past: "Choose an arrival date in the future.",
      guests: "The villa sleeps up to 10 guests.",
      generic: "The request could not be sent. Try again, or write to us on WhatsApp.",
    },
  },
  contact: {
    meta: {
      title: "Contact — Villa Elk, Marrakech",
      description:
        "Write to Villa Elk on WhatsApp or by email. Golf Argan Resort, Agdal, Marrakech. We reply within 24 hours.",
    },
    addressTitle: "Address",
    address: "Golf Argan Resort, extension — villa 2\nAgdal, Marrakech, Morocco",
    instagramCta: "Follow on Instagram",
    reachTitle: "Reach us",
    eyebrow: "Contact",
    title: "Let's plan your stay",
    description:
      "The Villa Elk team replies within 24h to help plan your stay in Marrakech.",
    whatsappCta: "Message on WhatsApp",
    emailCta: "Send an email",
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
