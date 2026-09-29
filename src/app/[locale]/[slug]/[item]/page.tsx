import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/content/site";
import { hrefFor, pageForSlug, slugFor, suiteHref } from "@/lib/i18n/routes";
import { getSuite, getSuiteSlugs, getSuites } from "@/lib/content/rooms";
import { pick, type GalleryPhoto } from "@/lib/content/types";
import { SuiteCarousel } from "@/components/villa/SuiteCarousel";
import { getContact } from "@/lib/content/site";
import { SITE, VILLA_ID, breadcrumbSchema, jsonLd, pageMetadata } from "@/lib/seo";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/**
 * A suite's own page — "L'Alcôve". It opens on the photographs, full width,
 * then reads like the page of a hotel's room book: one large number, the
 * description set in the display face, and the inventory as a numbered list.
 * Only the suites page has children: /fr/galerie/x is a 404, not a suite.
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

  return pageMetadata({
    title,
    description,
    locale: found.locale,
    path: (l) => suiteHref(suite.slug, l),
    image: suite.image ? absolute(suite.image.src) : undefined,
  });
}

export default async function SuitePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; item: string }>;
}) {
  const { locale, slug, item } = await params;
  const found = await resolve(locale, slug, item);
  if (!found) notFound();

  const { suite } = found;
  const lang: Locale = found.locale;
  const dict = await getDictionary(lang);
  const CONTACT = await getContact();
  const copy = dict.suites;
  const name = pick(suite.name, lang);
  const features = suite.features[lang].length ? suite.features[lang] : suite.features.fr;
  const all = await getSuites();
  const index = all.findIndex((other) => other.id === suite.id);
  const others = all.filter((other) => other.id !== suite.id);
  const level = suite.level === "0" ? copy.levelNames.ground : copy.levelNames.upper;

  // The carousel shows the suite's photographs; a suite without any still
  // opens on its main picture rather than on nothing.
  const photos: GalleryPhoto[] = found.photos.length
    ? found.photos
    : suite.image
      ? [{ id: suite.id, category: "suites", image: suite.image }]
      : [];

  const schema = jsonLd({
    "@type": "Suite",
    name,
    description: pick(suite.description, lang),
    url: `${SITE}${suiteHref(suite.slug, lang)}`,
    ...(suite.areaSqm
      ? { floorSize: { "@type": "QuantitativeValue", value: suite.areaSqm, unitCode: "MTK" } }
      : {}),
    image: photos.slice(0, 6).map((photo) => absolute(photo.image.src)),
    amenityFeature: features.map((feature) => ({
      "@type": "LocationFeatureSpecification",
      name: feature,
      value: true,
    })),
    containedInPlace: { "@type": "LodgingBusiness", "@id": VILLA_ID, name: "Villa Elk", url: `${SITE}/${lang}` },
  }, breadcrumbSchema(lang, [
    { name: dict.nav.rooms, path: hrefFor("suites", lang) },
    { name, path: suiteHref(suite.slug, lang) },
  ]));

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    // The header is fixed and 5rem tall; the photographs start below it so the
    // navigation never sits on a dark picture.
    <article className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      {photos.length > 0 ? (
        <SuiteCarousel photos={photos} locale={lang} dict={dict}>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.22em] text-white/80">
            {copy.suiteLabel} {ROMAN[index] ?? index + 1} · {level}
          </p>
          <h1 className="heading-display mt-3 text-[clamp(2.6rem,11vw,6.5rem)] leading-[0.95] text-[#f5efe6]">
            {name}
          </h1>
        </SuiteCarousel>
      ) : (
        <h1 className="heading-display mx-auto max-w-[1400px] px-6 pt-10 text-5xl lg:px-[5vw]">{name}</h1>
      )}

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-[5vw]">
        <Link
          href={hrefFor("suites", lang)}
          className="eyebrow mt-6 inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <span aria-hidden="true">{lang === "ar" ? "→" : "←"}</span> {copy.backToSuites}
        </Link>

        {/* The room at a glance: one number carries it */}
        <section className="rise mt-8 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-16">
          <dl className="grid grid-cols-2 border-y border-border lg:col-span-4 lg:grid-cols-1 lg:border-y-0 lg:border-e lg:pe-10">
            {suite.areaSqm ? (
              <div className="py-6 lg:py-0 lg:pb-8">
                <dt className="eyebrow text-muted-foreground">{copy.areaLabel}</dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <span className="heading-display text-[clamp(4rem,18vw,8rem)] leading-none text-primary tabular-nums">
                    {suite.areaSqm}
                  </span>
                  <span className="heading-display text-2xl text-foreground">m²</span>
                </dd>
              </div>
            ) : (
              <div className="py-6 lg:py-0 lg:pb-8">
                <dt className="eyebrow text-muted-foreground">{copy.suiteLabel}</dt>
                <dd className="heading-display mt-2 text-[clamp(4rem,18vw,8rem)] leading-none text-primary">
                  {ROMAN[index] ?? index + 1}
                </dd>
              </div>
            )}
            <div className="border-s border-border py-6 ps-6 lg:border-s-0 lg:border-t lg:ps-0 lg:pt-8">
              <dt className="eyebrow text-muted-foreground">{dict.tour.levelLabel}</dt>
              <dd className="heading-display mt-2 text-2xl text-foreground sm:text-3xl">{level}</dd>
              <dt className="eyebrow mt-6 text-muted-foreground">{copy.photosTitle}</dt>
              <dd className="heading-display mt-2 text-2xl text-foreground sm:text-3xl tabular-nums">
                {photos.length} <span className="text-lg text-muted-foreground">{copy.photosUnit}</span>
              </dd>
            </div>
          </dl>

          <p className="heading-display text-[clamp(1.6rem,5.4vw,2.6rem)] leading-[1.25] text-foreground lg:col-span-8 lg:self-center">
            {pick(suite.description, lang)}
          </p>
        </section>

        {features.length > 0 && (
          <section aria-labelledby="features-title" className="rise mt-16 lg:mt-28">
            <div className="flex items-baseline justify-between gap-6 border-b border-border pb-4">
              <h2 id="features-title" className="heading-display text-3xl text-foreground sm:text-4xl">
                {copy.featuresTitle}
              </h2>
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground tabular-nums">
                {pad(features.length)}
              </span>
            </div>
            <ol className="grid sm:grid-cols-2 sm:gap-x-12">
              {features.map((feature, i) => (
                <li key={feature} className="flex items-baseline gap-5 border-b border-border py-5">
                  <span className="w-7 shrink-0 font-mono text-xs tracking-[0.15em] text-accent tabular-nums">
                    {pad(i + 1)}
                  </span>
                  <span className="text-lg text-foreground sm:text-xl">{feature}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {others.length > 0 && (
        <section aria-labelledby="others-title" className="rise mt-20 lg:mt-32">
          <h2
            id="others-title"
            className="heading-display mx-auto max-w-[1400px] px-5 text-3xl text-foreground sm:px-8 sm:text-4xl lg:px-[5vw]"
          >
            {copy.otherSuites}
          </h2>
          {/* A swipeable strip on phones, a row on wide screens */}
          <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8 lg:mx-auto lg:grid lg:max-w-[1400px] lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-[5vw] [&::-webkit-scrollbar]:hidden">
            {others.map((other) => {
              const position = all.findIndex((s) => s.id === other.id);
              return (
                <li key={other.id} className="w-[78vw] max-w-[420px] shrink-0 snap-start lg:w-auto lg:max-w-none">
                  <Link href={suiteHref(other.slug, lang)} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted lg:aspect-[4/3]">
                      {other.image && (
                        <Image
                          src={other.image.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 30vw, 80vw"
                          quality={85}
                          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                        />
                      )}
                      <span className="absolute start-4 top-4 font-mono text-xs tracking-[0.2em] text-white/90">
                        {copy.suiteLabel} {ROMAN[position] ?? position + 1}
                      </span>
                    </div>
                    <p className="heading-display mt-4 text-2xl text-foreground transition-colors group-hover:text-primary">
                      {pick(other.name, lang)}
                    </p>
                    <p className="eyebrow mt-1 text-muted-foreground">
                      {other.level === "0" ? copy.levelNames.ground : copy.levelNames.upper}
                      {other.areaSqm ? ` · ${other.areaSqm} m²` : ""}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* The one dark band on the page: the ask */}
      <section className="mt-20 bg-onyx text-[#efe6da] lg:mt-32">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--brass-light)]">
            {dict.reserve.eyebrow}
          </p>
          <h2 className="heading-display mt-4 max-w-3xl text-[clamp(2.2rem,8vw,4.5rem)] leading-[1.02]">
            {copy.ctaTitle}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#efe6da]/75">{dict.reserve.intro}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href={hrefFor("booking", lang)} className="btn-primary">
              {dict.nav.bookNow}
            </Link>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border-b border-[var(--brass-light)] text-sm font-semibold uppercase tracking-[0.06em] text-[#efe6da] hover:text-[var(--brass-light)]"
            >
              <MessageCircle className="h-4 w-4" />
              {dict.contact.whatsappCta}
            </a>
          </div>
        </div>
      </section>

      {/* On a phone the ask stays within reach; the theme button owns the other corner */}
      <Link
        href={hrefFor("booking", lang)}
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-[0.06em] text-primary-foreground shadow-[0_10px_30px_-10px_rgba(31,28,25,0.6)] lg:hidden"
      >
        {dict.nav.bookNow}
      </Link>
    </article>
  );
}
