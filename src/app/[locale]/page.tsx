import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/content/site";
import { Hero } from "@/components/villa/Hero";
import { LevelsTour } from "@/components/villa/LevelsTour";
import { Prestations } from "@/components/villa/Prestations";
import { Explore } from "@/components/villa/Explore";
import { Location } from "@/components/villa/Location";
import { getAmenities } from "@/lib/content/amenities";
import { notFound } from "next/navigation";
import { getContact, getSettings } from "@/lib/content/site";

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
  const dict = await getDictionary(locale as Locale);
  const CONTACT = await getContact();
  const settings = await getSettings();
  const shots = ([0, 1, 2, 3] as const).map((i) => ({
    main: settings[`image.levels.${i}.main`],
    detail: settings[`image.levels.${i}.detail`],
  }));
  const amenities = await getAmenities();

  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Villa Elk",
    description: dict.meta.description,
    url: `https://www.villaelk.com/${locale}`,
    email: CONTACT.email,
    telephone: `+${CONTACT.whatsapp}`,
    image: "https://www.villaelk.com/images/villa-elk/og.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Golf Argan Resort, extension, Villa 2",
      addressLocality: "Agdal, Marrakech",
      addressCountry: "MA",
    },
    priceRange: "MAD",
    amenityFeature: [
      "Piscine privée",
      "Spa & hammam",
      "Salle de cinéma",
      "Salle de sport",
      "Rooftop avec cuisine d'été",
      "Four à pizza",
      "Barbecue",
      "Cheminée",
      "Garage intérieur sécurisé",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    numberOfRooms: 4,
    occupancy: { "@type": "QuantitativeValue", maxValue: 10 },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
      />
      <Hero dict={dict} image={settings["image.hero"]} />
      <LevelsTour dict={dict} shots={shots} />
      <Prestations dict={dict} locale={locale as Locale} amenities={amenities} />
      <Location dict={dict} />
      <Explore dict={dict} locale={locale as Locale} />
    </>
  );
}
