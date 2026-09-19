import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { allPageParams, hrefFor, pageForSlug } from "@/lib/i18n/routes";
import { BookingForm } from "@/components/villa/BookingForm";
import { CONTACT } from "@/lib/contact";

const SITE = "https://www.villaelk.com";

/**
 * One route for every page below the home page, because each language has its
 * own slug: /fr/reserver, /en/booking, /es/reservar, /ar/hajz all land here.
 */
export function generateStaticParams() {
  return allPageParams();
}

function resolve(locale: string, slug: string) {
  if (!isLocale(locale)) return null;
  const page = pageForSlug(slug, locale);
  return page ? { locale, page } : null;
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
  const meta = dict.reserve.meta;

  return {
    metadataBase: new URL(SITE),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: hrefFor("booking", resolved.locale),
      // Each language points at its own slug, so search engines pair the four.
      languages: Object.fromEntries(locales.map((l) => [l, hrefFor("booking", l)])),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE}${hrefFor("booking", resolved.locale)}`,
      siteName: "Villa Elk",
      images: [{ url: "/images/villa-elk/pool-terrace-sunset.jpg", width: 1200, height: 630 }],
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

  const dict = getDictionary(resolved.locale as Locale);
  const copy = dict.reserve;
  const href = hrefFor("booking", resolved.locale as Locale);

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-[5vw] lg:py-28">
        <p className="eyebrow text-primary">{copy.eyebrow}</p>
        <h1 className="heading-display mt-3 max-w-2xl text-4xl text-foreground sm:text-5xl lg:text-6xl">
          {copy.title}
        </h1>
        <p className="body-copy mt-6 max-w-2xl text-lg">{copy.intro}</p>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-7">
            <BookingForm dict={dict} locale={resolved.locale as Locale} pageHref={href} />
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
    </>
  );
}
