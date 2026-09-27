import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { hrefFor, pageForSlug, slugFor, suiteHref } from "@/lib/i18n/routes";
import { getSuite, getSuiteSlugs, getSuites } from "@/lib/content/rooms";
import { pick } from "@/lib/content/types";
import { GalleryGrid } from "@/components/villa/GalleryGrid";
import { Logo } from "@/components/brand/Logo";

const SITE = "https://www.villaelk.com";

/**
 * A suite's own page. Only the suites page has children, so any other slug in
 * front of an item is not ours: /fr/galerie/x is a 404, not a suite.
 */
export async function generateStaticParams() {
  const slugs = await getSuiteSlugs();
  return locales.flatMap((locale) =>
    slugs.map((item) => ({ locale, slug: slugFor("suites", locale), item })),
  );
}

async function resolve(locale: string, slug: string, item: string) {
  if (!isLocale(locale) || pageForSlug(slug, locale) !== "suites") return null;
  const found = await getSuite(item);
  return found ? { locale, ...found } : null;
}

/** Photographs from /public are relative; social cards need an absolute URL. */
function absolute(src: string): string {
  return src.startsWith("http") ? src : `${SITE}${src}`;
}

function summary(text: string): string {
  if (text.length <= 158) return text;
  return `${text.slice(0, text.lastIndexOf(" ", 155))}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; item: string }>;
}): Promise<Metadata> {
  const { locale, slug, item } = await params;
  const found = await resolve(locale, slug, item);
  if (!found) return {};

  const { suite } = found;
  const name = pick(suite.name, found.locale);
  const title = `${name} — Villa Elk, Marrakech`;
  const description = summary(pick(suite.description, found.locale));

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: suiteHref(suite.slug, found.locale),
      languages: Object.fromEntries(locales.map((l) => [l, suiteHref(suite.slug, l)])),
    },
    openGraph: {
      title,
      description,
      url: `${SITE}${suiteHref(suite.slug, found.locale)}`,
      siteName: "Villa Elk",
      images: suite.image ? [{ url: absolute(suite.image.src) }] : [{ url: "/images/villa-elk/og.jpg" }],
    },
  };
}

export default async function SuitePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; item: string }>;
}) {
  const { locale, slug, item } = await params;
  const found = await resolve(locale, slug, item);
  if (!found) notFound();

  const { suite, photos } = found;
  const lang: Locale = found.locale;
  const dict = getDictionary(lang);
  const copy = dict.suites;
  const name = pick(suite.name, lang);
  const features = suite.features[lang].length ? suite.features[lang] : suite.features.fr;
  const others = (await getSuites()).filter((other) => other.id !== suite.id);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Suite",
    name,
    description: pick(suite.description, lang),
    url: `${SITE}${suiteHref(suite.slug, lang)}`,
    ...(suite.areaSqm
      ? { floorSize: { "@type": "QuantitativeValue", value: suite.areaSqm, unitCode: "MTK" } }
      : {}),
    image: [suite.image, ...photos.map((p) => p.image)]
      .filter((image): image is NonNullable<typeof image> => Boolean(image))
      .slice(0, 6)
      .map((image) => absolute(image.src)),
    amenityFeature: features.map((feature) => ({
      "@type": "LocationFeatureSpecification",
      name: feature,
      value: true,
    })),
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: "Villa Elk",
      url: `${SITE}/${lang}`,
    },
  };

  return (
    <article className="mx-auto max-w-[1400px] px-6 py-20 lg:px-[5vw] lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Link
        href={hrefFor("suites", lang)}
        className="eyebrow inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-primary"
      >
        <span aria-hidden="true">{lang === "ar" ? "→" : "←"}</span> {copy.backToSuites}
      </Link>

      <div className="mt-10 grid items-end gap-10 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <p className="eyebrow text-primary">
            {suite.level === "0" ? copy.levelNames.ground : copy.levelNames.upper}
          </p>
          <h1 className="heading-display mt-3 text-4xl text-foreground sm:text-5xl lg:text-6xl">
            {name}
          </h1>
          {suite.areaSqm && (
            <p className="eyebrow mt-4 text-muted-foreground">
              {copy.areaLabel} {suite.areaSqm} m²
            </p>
          )}
          <p className="body-copy mt-6 text-lg">{pick(suite.description, lang)}</p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-muted lg:col-span-7 lg:aspect-[3/2]">
          {suite.image ? (
            <Image
              src={suite.image.src}
              alt={pick(suite.image.alt, lang)}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              quality={85}
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center" aria-hidden="true">
              <Logo variant="mark" className="w-20 opacity-25" />
            </div>
          )}
        </div>
      </div>

      {features.length > 0 && (
        <section aria-labelledby="features-title" className="mt-16 border-t border-border pt-10 lg:mt-24">
          <h2 id="features-title" className="eyebrow text-muted-foreground">
            {copy.featuresTitle}
          </h2>
          <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-baseline gap-3 text-lg text-foreground">
                <span className="h-1.5 w-1.5 shrink-0 translate-y-[-0.2em] rotate-45 bg-accent" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {photos.length > 0 && (
        <section aria-labelledby="photos-title" className="mt-16 border-t border-border pt-10 lg:mt-24">
          <h2 id="photos-title" className="eyebrow text-muted-foreground">
            {copy.photosTitle} <span className="tabular-nums">· {photos.length}</span>
          </h2>
          <GalleryGrid photos={photos} locale={lang} dict={dict} />
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="others-title" className="mt-16 border-t border-border pt-10 lg:mt-24">
          <h2 id="others-title" className="eyebrow text-muted-foreground">
            {copy.otherSuites}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((other) => (
              <li key={other.id}>
                <Link href={suiteHref(other.slug, lang)} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {other.image && (
                      <Image
                        src={other.image.src}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 30vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <p className="heading-display mt-4 text-2xl text-foreground group-hover:text-primary">
                    {pick(other.name, lang)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-20 border-t border-border pt-10 lg:mt-28">
        <p className="body-copy max-w-xl text-lg">{dict.reserve.intro}</p>
        <Link href={hrefFor("booking", lang)} className="btn-primary mt-6">
          {dict.nav.bookNow}
        </Link>
      </div>
    </article>
  );
}
