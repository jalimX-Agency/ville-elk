import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Hero } from "@/components/villa/Hero";
import { LevelsTour } from "@/components/villa/LevelsTour";
import { UnderConstruction } from "@/components/villa/UnderConstruction";
import { notFound } from "next/navigation";
import { CONTACT } from "@/lib/contact";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Villa Elk",
    description: dict.meta.description,
    url: `https://www.villaelk.com/${locale}`,
    email: CONTACT.email,
    telephone: `+${CONTACT.whatsapp}`,
    image: "https://www.villaelk.com/images/villa-elk/pool-terrace-sunset.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Golf Argan Resort, extension, Villa 2",
      addressLocality: "Agdal, Marrakech",
      addressCountry: "MA",
    },
    priceRange: "MAD",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Piscine privée", value: true },
      { "@type": "LocationFeatureSpecification", name: "Hammam", value: true },
      { "@type": "LocationFeatureSpecification", name: "Salle de cinéma", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking sécurisé", value: true },
    ],
    numberOfRooms: 4,
    occupancy: { "@type": "QuantitativeValue", maxValue: 10 },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
      />
      <Hero dict={dict} />
      <LevelsTour dict={dict} />
      <UnderConstruction dict={dict} />
    </>
  );
}
