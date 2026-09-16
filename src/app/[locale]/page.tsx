import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Hero } from "@/components/villa/Hero";
import { Concept } from "@/components/villa/Concept";
import { Amenities } from "@/components/villa/Amenities";
import { Gallery } from "@/components/villa/Gallery";
import { Rooms } from "@/components/villa/Rooms";
import { Contact } from "@/components/villa/Contact";
import { notFound } from "next/navigation";

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
    email: "villaelkkech@gmail.com",
    telephone: "+212632809000",
    image: "https://www.villaelk.com/images/villa-elk/pool-rooftop-sunset.jpg",
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
      <Concept dict={dict} />
      <Rooms dict={dict} />
      <Amenities dict={dict} />
      <Gallery dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
