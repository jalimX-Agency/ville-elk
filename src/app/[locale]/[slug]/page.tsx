import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/content/site";
import { allPageParams, hrefFor, pageForSlug, type PageKey } from "@/lib/i18n/routes";
import { BookingForm } from "@/components/villa/BookingForm";
import { SuitesList } from "@/components/villa/SuitesList";
import { GalleryGrid } from "@/components/villa/GalleryGrid";
import { getGallery, getSuites } from "@/lib/content/rooms";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { getContact } from "@/lib/content/site";
import { LEGAL } from "@/lib/content/legal";
import { SITE, breadcrumbSchema, jsonLd, pageMetadata, villaSchema } from "@/lib/seo";
import { ContactPage } from "@/components/villa/ContactPage";
import { LegalPage } from "@/components/villa/LegalPage";
import { ConciergePage } from "@/components/villa/ConciergePage";
import { ActivitiesPage } from "@/components/villa/ActivitiesPage";
import { StayFacts } from "@/components/villa/StayFacts";

/**
 * One route for every page below the home page, because each language has its
 * own slug: /fr/reserver, /en/booking, /es/reservar, /ar/hajz all land here,
 * as do the suites, gallery and contact pages.
 */
export function generateStaticParams() {
  return allPageParams();
}

function resolve(locale: string, slug: string): { locale: Locale; page: PageKey } | null {
  if (!isLocale(locale)) return null;
  const page = pageForSlug(slug, locale);
  return page ? { locale, page } : null;
}

/** Each page's own title and description, so no two share one. */
function metaFor(page: PageKey, dict: Dictionary, locale: Locale) {
  switch (page) {
    case "suites":
      return dict.suites.meta;
    case "gallery":
      return dict.gallery.meta;
    case "contact":
      return dict.contact.meta;
    case "booking":
      return dict.reserve.meta;
    case "concierge":
      return dict.concierge.meta;
    case "activities":
      return dict.activities.meta;
    case "legal":
    case "privacy":
      return LEGAL[locale][page];
  }
}

/** What the page is called in the breadcrumb search results show. */
function crumbFor(page: PageKey, dict: Dictionary): string {
  switch (page) {
    case "suites":
      return dict.nav.rooms;
    case "gallery":
      return dict.nav.gallery;
    case "contact":
      return dict.nav.contact;
    case "booking":
      return dict.nav.bookNow;
    case "concierge":
      return dict.nav.concierge;
    case "activities":
      return dict.nav.activities;
    case "legal":
      return dict.footer.legal;
    case "privacy":
      return dict.footer.privacy;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = resolve(locale, slug);
  if (!resolved) return {};

  const dict = await getDictionary(resolved.locale);
  const meta = metaFor(resolved.page, dict, resolved.locale);
  const page = resolved.page;

  return pageMetadata({
    title: meta.title,
    description: meta.description,
    locale: resolved.locale,
    path: (l) => hrefFor(page, l),
  });
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolved = resolve(locale, slug);
  if (!resolved) notFound();

  const dict = await getDictionary(resolved.locale);
  const crumbs = jsonLd(
    breadcrumbSchema(resolved.locale, [
      { name: crumbFor(resolved.page, dict), path: hrefFor(resolved.page, resolved.locale) },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: crumbs }} />
      <PageBody page={resolved.page} dict={dict} locale={resolved.locale} />
    </>
  );
}

function PageBody({ page, dict, locale }: { page: PageKey; dict: Dictionary; locale: Locale }) {
  switch (page) {
    case "suites":
      return <SuitesPage dict={dict} locale={locale} />;
    case "gallery":
      return <GalleryPage dict={dict} locale={locale} />;
    case "contact":
      return <ContactPage dict={dict} locale={locale} />;
    case "booking":
      return <BookingPage dict={dict} locale={locale} />;
    case "concierge":
      return <ConciergePage dict={dict} locale={locale} />;
    case "activities":
      return <ActivitiesPage dict={dict} locale={locale} />;
    case "legal":
    case "privacy":
      return <LegalPage dict={dict} locale={locale} doc={page} />;
  }
}

function PageHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <>
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h1 className="heading-display mt-3 max-w-2xl text-4xl text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="body-copy mt-6 max-w-2xl text-lg">{intro}</p>
    </>
  );
}

const SECTION = "mx-auto max-w-[1400px] px-6 py-20 lg:px-[5vw] lg:py-28";

async function SuitesPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const suites = await getSuites();

  return (
    <section className={SECTION}>
      <PageHead
        eyebrow={dict.suites.eyebrow}
        title={dict.suites.title}
        intro={dict.suites.intro}
      />
      <SuitesList dict={dict} locale={locale} suites={suites} />
      <NextStep dict={dict} locale={locale} />
    </section>
  );
}

async function GalleryPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const photos = await getGallery();

  return (
    <section className={SECTION}>
      <PageHead
        eyebrow={dict.gallery.eyebrow}
        title={dict.gallery.title}
        intro={dict.gallery.intro}
      />
      <GalleryGrid photos={photos} locale={locale} dict={dict} />
      <NextStep dict={dict} locale={locale} />
    </section>
  );
}

async function BookingPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const CONTACT = await getContact();
  const copy = dict.reserve;
  const href = hrefFor("booking", locale);

  const schema = jsonLd({
    "@type": "ReserveAction",
    name: copy.title,
    target: `${SITE}${href}`,
    object: villaSchema(locale, dict, CONTACT),
  });

  return (
    <section className={SECTION}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />
      <PageHead eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-7">
          <BookingForm dict={dict} locale={locale} pageHref={href} />
        </div>

        <aside className="lg:col-span-5">
          <StayFacts dict={dict} className="mb-12 border-t border-border pt-6" />
          <div className="border-t border-border pt-6">
            <h2 className="eyebrow text-muted-foreground">{copy.asideTitle}</h2>
            <ul className="mt-6 space-y-4">
              {copy.asideLines.map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                    aria-hidden="true"
                  />
                  <span className="body-copy">{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-border pt-6">
              <p className="body-copy">{dict.contact.description}</p>
              <p className="body-copy mt-3">{dict.stay.languages}</p>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-quiet mt-4"
              >
                {dict.contact.whatsappCta}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/** Every page ends somewhere: the booking page is where they all lead. */
function NextStep({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className="mt-20 border-t border-border pt-10 lg:mt-28">
      <p className="body-copy max-w-xl text-lg">{dict.reserve.intro}</p>
      <Link href={hrefFor("booking", locale)} className="btn-primary mt-6">
        {dict.nav.bookNow}
      </Link>
    </div>
  );
}
