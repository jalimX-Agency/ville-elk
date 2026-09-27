import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Mail, AtSign, MapPin } from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { allPageParams, hrefFor, pageForSlug, type PageKey } from "@/lib/i18n/routes";
import { BookingForm } from "@/components/villa/BookingForm";
import { SuitesList } from "@/components/villa/SuitesList";
import { GalleryGrid } from "@/components/villa/GalleryGrid";
import { getGallery, getSuites } from "@/lib/content/rooms";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { CONTACT } from "@/lib/contact";

const SITE = "https://www.villaelk.com";

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
function metaFor(page: PageKey, dict: Dictionary) {
  switch (page) {
    case "suites":
      return dict.suites.meta;
    case "gallery":
      return dict.gallery.meta;
    case "contact":
      return dict.contact.meta;
    case "booking":
      return dict.reserve.meta;
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

  const dict = getDictionary(resolved.locale);
  const meta = metaFor(resolved.page, dict);

  return {
    metadataBase: new URL(SITE),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: hrefFor(resolved.page, resolved.locale),
      // Each language points at its own slug, so search engines pair the four.
      languages: Object.fromEntries(locales.map((l) => [l, hrefFor(resolved.page, l)])),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE}${hrefFor(resolved.page, resolved.locale)}`,
      siteName: "Villa Elk",
      images: [{ url: "/images/villa-elk/og.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolved = resolve(locale, slug);
  if (!resolved) notFound();

  const dict = getDictionary(resolved.locale);

  switch (resolved.page) {
    case "suites":
      return <SuitesPage dict={dict} locale={resolved.locale} />;
    case "gallery":
      return <GalleryPage dict={dict} locale={resolved.locale} />;
    case "contact":
      return <ContactPage dict={dict} locale={resolved.locale} />;
    case "booking":
      return <BookingPage dict={dict} locale={resolved.locale} />;
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

function ContactPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Villa Elk",
    url: `${SITE}/${locale}`,
    email: CONTACT.email,
    telephone: `+${CONTACT.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Golf Argan Resort, extension, Villa 2",
      addressLocality: "Agdal, Marrakech",
      addressCountry: "MA",
    },
  };

  return (
    <section className={SECTION}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageHead
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        intro={dict.contact.description}
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-7">
          <h2 className="eyebrow text-muted-foreground">{dict.contact.reachTitle}</h2>
          <ul className="mt-6 space-y-5">
            <li>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-quiet"
              >
                <MessageCircle className="h-4 w-4" />
                {dict.contact.whatsappCta}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="btn-quiet">
                <Mail className="h-4 w-4" />
                {dict.contact.emailCta}
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${CONTACT.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-quiet"
              >
                <AtSign className="h-4 w-4" />
                {dict.contact.instagramCta}
              </a>
            </li>
          </ul>

          <Link href={hrefFor("booking", locale)} className="btn-primary mt-10">
            {dict.nav.bookNow}
          </Link>
        </div>

        <aside className="lg:col-span-5">
          <div className="border-t border-border pt-6">
            <h2 className="eyebrow text-muted-foreground">{dict.contact.addressTitle}</h2>
            <p className="body-copy mt-5 flex gap-3 whitespace-pre-line">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {dict.contact.address}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function BookingPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.reserve;
  const href = hrefFor("booking", locale);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ReserveAction",
    name: copy.title,
    target: `${SITE}${href}`,
    object: {
      "@type": "LodgingBusiness",
      name: "Villa Elk",
      url: `${SITE}/${locale}`,
      email: CONTACT.email,
      telephone: `+${CONTACT.whatsapp}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Golf Argan Resort, extension, Villa 2",
        addressLocality: "Agdal, Marrakech",
        addressCountry: "MA",
      },
    },
  };

  return (
    <section className={SECTION}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageHead eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-7">
          <BookingForm dict={dict} locale={locale} pageHref={href} />
        </div>

        <aside className="lg:col-span-5">
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
