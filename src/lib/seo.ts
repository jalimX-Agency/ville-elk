import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { Contact } from "@/lib/content/site";
import { VILLA_GEO, VILLA_LOCATION } from "@/lib/content/location";

export const SITE = "https://www.villaelk.com";
export const OG_IMAGE = "/images/villa-elk/og.jpg";

const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_GB", es: "es_ES", ar: "ar_MA" };

/**
 * The metadata every public page shares: its canonical URL, the same page in
 * the three other languages (and French for anyone else), and the card shown
 * when the link is shared.
 */
export function pageMetadata({
  title,
  description,
  locale,
  path,
  image,
}: {
  title: string;
  description: string;
  locale: Locale;
  /** The page's path in a given language. */
  path: (locale: Locale) => string;
  image?: string;
}): Metadata {
  const images = [image ? { url: image } : { url: OG_IMAGE, width: 1200, height: 630 }];
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: path(locale),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, path(l)])),
        "x-default": path("fr"),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE}${path(locale)}`,
      siteName: "Villa Elk",
      locale: OG_LOCALES[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}

/** One name for the villa across every page's structured data, so the entities join up. */
export const VILLA_ID = `${SITE}/#villa`;

export const VILLA_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Golf Argan Resort, extension, Villa 2",
  addressLocality: "Marrakech",
  addressRegion: "Marrakech-Safi",
  postalCode: "40000",
  addressCountry: "MA",
} as const;

/** The villa as a lodging business: what search engines and AI assistants quote. */
export function villaSchema(locale: Locale, dict: Dictionary, contact: Contact, amenities: string[] = []) {
  return {
    "@type": "LodgingBusiness",
    "@id": VILLA_ID,
    name: "Villa Elk",
    description: dict.meta.description,
    url: `${SITE}/${locale}`,
    email: contact.email,
    telephone: `+${contact.whatsapp}`,
    image: [
      `${SITE}${OG_IMAGE}`,
      `${SITE}/images/villa-elk/piscine.jpg`,
      `${SITE}/images/villa-elk/suite-parentale.jpg`,
      `${SITE}/images/villa-elk/sta7.jpg`,
    ],
    logo: `${SITE}/icon.svg`,
    address: VILLA_ADDRESS,
    geo: VILLA_GEO,
    hasMap: VILLA_LOCATION.mapsUrl,
    sameAs: [`https://www.instagram.com/${contact.instagram}`, VILLA_LOCATION.mapsUrl],
    priceRange: `${dict.stay.from} ${dict.stay.price} ${dict.stay.per}`,
    currenciesAccepted: "MAD, EUR",
    checkinTime: "15:00",
    checkoutTime: "11:00",
    numberOfRooms: 4,
    occupancy: { "@type": "QuantitativeValue", maxValue: 10 },
    knowsLanguage: ["ar", "fr", "en"],
    areaServed: { "@type": "City", name: "Marrakech" },
    ...(amenities.length
      ? {
          amenityFeature: amenities.map((name) => ({
            "@type": "LocationFeatureSpecification",
            name,
            value: true,
          })),
        }
      : {}),
  };
}

/** Home › this page, so results show the path rather than the bare URL. */
export function breadcrumbSchema(locale: Locale, trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Villa Elk", path: `/${locale}` }, ...trail].map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: `${SITE}${step.path}`,
    })),
  };
}

/** Questions and answers as schema.org sees them. */
export function faqSchema(questions: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

/** Several schema.org entities in one script tag. */
export function jsonLd(...entities: object[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": entities });
}
