import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/content/site";
import { Hero } from "@/components/villa/Hero";
import { LevelsTour } from "@/components/villa/LevelsTour";
import { Prestations } from "@/components/villa/Prestations";
import { Explore } from "@/components/villa/Explore";
import { Location } from "@/components/villa/Location";
import { getAmenities } from "@/lib/content/amenities";
import { notFound } from "next/navigation";
import { VILLA_GEO, VILLA_LOCATION } from "@/lib/content/location";
import { getContact, getSettings } from "@/lib/content/site";
import { hrefFor } from "@/lib/i18n/routes";

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
    geo: VILLA_GEO,
    hasMap: VILLA_LOCATION.mapsUrl,
    priceRange: `${dict.stay.from} ${dict.stay.price} ${dict.stay.per}`,
    // The owner's own list, in the page's language, so it never drifts from what the page shows.
    amenityFeature: amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.name[locale as Locale] || amenity.name.fr,
      value: true,
    })),
    knowsLanguage: ["ar", "fr", "en"],
    numberOfRooms: 4,
    occupancy: { "@type": "QuantitativeValue", maxValue: 10 },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
      />
      <Hero dict={dict} image={settings["image.hero"]} bookingHref={hrefFor("booking", locale as Locale)} />
      <LevelsTour dict={dict} shots={shots} />
      <Prestations dict={dict} locale={locale as Locale} amenities={amenities} />
      <Location dict={dict} locale={locale as Locale} />
      <Explore dict={dict} locale={locale as Locale} />
    </>
  );
}
