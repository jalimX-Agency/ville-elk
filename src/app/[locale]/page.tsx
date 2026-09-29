import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/content/site";
import { Hero } from "@/components/villa/Hero";
import { LevelsTour } from "@/components/villa/LevelsTour";
import { Prestations } from "@/components/villa/Prestations";
import { Explore } from "@/components/villa/Explore";
import { Location } from "@/components/villa/Location";
import { getAmenities } from "@/lib/content/amenities";
import { notFound } from "next/navigation";
import { Faq } from "@/components/villa/Faq";
import { SITE, VILLA_ID, faqSchema, jsonLd, villaSchema } from "@/lib/seo";
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

  const schema = jsonLd(
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "Villa Elk",
      url: SITE,
      inLanguage: locale,
      publisher: { "@id": VILLA_ID },
    },
    // The owner's own list, in the page's language, so it never drifts from what the page shows.
    villaSchema(
      locale as Locale,
      dict,
      CONTACT,
      amenities.map((amenity) => amenity.name[locale as Locale] || amenity.name.fr),
    ),
    faqSchema(dict.faq.questions),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />
      <Hero dict={dict} image={settings["image.hero"]} bookingHref={hrefFor("booking", locale as Locale)} />
      <LevelsTour dict={dict} shots={shots} />
      <Prestations dict={dict} locale={locale as Locale} amenities={amenities} />
      <Location dict={dict} locale={locale as Locale} />
      <Faq dict={dict} locale={locale as Locale} />
      <Explore dict={dict} locale={locale as Locale} />
    </>
  );
}
