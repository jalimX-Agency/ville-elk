import Link from "next/link";
import { ArrowUpRight, AtSign, Mail, MapPin, MessageCircle, Navigation } from "lucide-react";
import { hrefFor } from "@/lib/i18n/routes";
import { formatPhone } from "@/lib/content/phone";
import { getContact } from "@/lib/content/site";
import { VILLA_DIRECTIONS_URL, VILLA_LOCATION, villaMapEmbed } from "@/lib/content/location";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { SITE, jsonLd, villaSchema } from "@/lib/seo";

/**
 * Contact: three ways to write, then where the villa is — Google's map beside
 * the address, the Plus Code and the drive from the airport — and the booking
 * page to finish.
 */
export async function ContactPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.contact;
  const contact = await getContact();
  const arrow = locale === "ar" ? "←" : "→";

  const channels = [
    {
      label: copy.whatsappLabel,
      value: formatPhone(contact.whatsapp),
      cta: copy.whatsappCta,
      href: `https://wa.me/${contact.whatsapp}`,
      icon: MessageCircle,
      external: true,
    },
    {
      label: copy.emailLabel,
      value: contact.email,
      cta: copy.emailCta,
      href: `mailto:${contact.email}`,
      icon: Mail,
      external: false,
    },
    {
      label: copy.instagramLabel,
      value: `@${contact.instagram}`,
      cta: copy.instagramCta,
      href: `https://www.instagram.com/${contact.instagram}`,
      icon: AtSign,
      external: true,
    },
  ];

  const schema = jsonLd({
    "@type": "ContactPage",
    url: `${SITE}${hrefFor("contact", locale)}`,
    name: copy.meta.title,
    inLanguage: locale,
    about: villaSchema(locale, dict, contact),
  });

  return (
    <article className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      {/* Opening */}
      <header className="mx-auto grid max-w-[1400px] gap-8 px-6 pt-12 lg:grid-cols-12 lg:gap-x-16 lg:px-[5vw] lg:pt-20">
        <div className="lg:col-span-7">
          <p className="eyebrow text-primary">{copy.eyebrow}</p>
          <h1 className="heading-display mt-4 text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.98] text-foreground">
            {copy.title}
          </h1>
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <p className="body-copy text-lg">{copy.description}</p>
          <p className="body-copy mt-6 border-s-2 border-accent ps-4">{dict.stay.languages}</p>
        </div>
      </header>

      {/* Ways to write */}
      <section aria-labelledby="reach-title" className="mx-auto max-w-[1400px] px-6 pt-16 lg:px-[5vw] lg:pt-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="reach-title" className="eyebrow text-muted-foreground">
            {copy.reachTitle}
          </h2>
          <p className="flex items-center gap-3 text-sm text-foreground">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            {copy.responseTime}
          </p>
        </div>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border md:grid-cols-3">
          {channels.map((channel) => (
            <li key={channel.label} className="bg-background">
              <a
                href={channel.href}
                {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col gap-8 p-6 transition-colors duration-300 hover:bg-muted sm:p-8"
              >
                <span className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-border text-accent transition-colors duration-300 group-hover:border-accent">
                    <channel.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="eyebrow block text-muted-foreground">{channel.label}</span>
                  <span dir="ltr" className="mt-2 block break-all text-xl text-foreground sm:text-2xl rtl:text-right">
                    {channel.value}
                  </span>
                  <span className="mt-4 block text-sm font-semibold uppercase tracking-[0.06em] text-primary">
                    {channel.cta}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Where the villa is */}
      <section
        aria-labelledby="address-title"
        className="mx-auto grid max-w-[1400px] gap-10 px-6 pt-16 lg:grid-cols-12 lg:gap-x-12 lg:px-[5vw] lg:pt-24"
      >
        <div className="order-2 lg:order-1 lg:col-span-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] border border-border bg-muted sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <iframe
              title={copy.mapTitle}
              src={villaMapEmbed(locale)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-4">
          <h2 id="address-title" className="eyebrow text-muted-foreground">
            {copy.addressTitle}
          </h2>
          <p className="heading-display mt-5 flex gap-3 whitespace-pre-line text-2xl leading-snug text-foreground">
            <MapPin className="mt-1.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            {copy.address}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {copy.plusCodeLabel}{" "}
            <span dir="ltr" className="font-mono text-foreground">
              {VILLA_LOCATION.plusCode}
            </span>
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6">
            <a href={VILLA_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn-quiet">
              <Navigation className="h-4 w-4" aria-hidden="true" />
              {copy.directionsCta}
            </a>
            <a href={VILLA_LOCATION.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-quiet">
              {copy.mapCta}
            </a>
          </div>

          <h3 className="eyebrow mt-12 text-muted-foreground">{copy.gettingThereTitle}</h3>
          <ul className="mt-4 border-t border-border">
            {copy.gettingThere.map((place) => (
              <li key={place.label} className="flex items-baseline justify-between gap-4 border-b border-border py-4">
                <span className="text-foreground">{place.label}</span>
                <span className="shrink-0 font-mono text-[0.75rem] tracking-[0.08em] text-muted-foreground">
                  {place.distance}
                </span>
              </li>
            ))}
          </ul>
          <p className="body-copy mt-5 text-sm">{copy.transferNote}</p>
          <Link href={hrefFor("concierge", locale)} className="btn-quiet mt-2">
            {copy.conciergeCta}
            <span aria-hidden="true">{arrow}</span>
          </Link>
        </div>
      </section>

      {/* The next step */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-[5vw] lg:py-28">
        <div className="border-t border-border pt-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <h2 className="heading-display text-3xl text-foreground sm:text-4xl">{copy.bookTitle}</h2>
            <p className="body-copy mt-4 max-w-xl text-lg">{dict.reserve.intro}</p>
          </div>
          <Link href={hrefFor("booking", locale)} className="btn-primary mt-8 shrink-0 lg:mt-0">
            {dict.nav.bookNow}
          </Link>
        </div>
      </section>
    </article>
  );
}
