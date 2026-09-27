import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail } from "lucide-react";
import { hrefFor } from "@/lib/i18n/routes";
import { CONTACT } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/**
 * Where the home page hands over. Two doors rather than a menu: the rooms and
 * the pictures are what a visitor wants next, and the booking page is the one
 * thing the villa is asking of them.
 */
export function Explore({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const doors = [
    {
      href: hrefFor("suites", locale),
      eyebrow: dict.suites.eyebrow,
      title: dict.suites.title,
      image: "/images/villa-elk/suite-parentale.jpg",
    },
    {
      href: hrefFor("gallery", locale),
      eyebrow: dict.gallery.eyebrow,
      title: dict.gallery.title,
      image: "/images/villa-elk/salon-europeen.jpg",
    },
  ];

  return (
    <section
      id="bientot"
      aria-labelledby="explore-title"
      className="border-t border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-[5vw] lg:py-28">
        <h2 id="explore-title" className="sr-only">
          {dict.nav.home}
        </h2>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {doors.map((door) => (
            <Link key={door.href} href={door.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted lg:aspect-[3/2]">
                <Image
                  src={door.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="eyebrow mt-5 text-primary">{door.eyebrow}</p>
              <p className="heading-display mt-2 text-2xl text-foreground sm:text-3xl">
                {door.title}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10 lg:mt-24">
          <p className="eyebrow text-primary">{dict.contact.eyebrow}</p>
          <h3 className="heading-display mt-3 max-w-xl text-3xl text-foreground sm:text-4xl">
            {dict.contact.title}
          </h3>
          <p className="body-copy mt-5 max-w-xl text-lg">{dict.contact.description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href={hrefFor("booking", locale)} className="btn-primary">
              {dict.nav.bookNow}
            </Link>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-quiet"
            >
              <MessageCircle className="h-4 w-4" />
              {dict.contact.whatsappCta}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="btn-quiet">
              <Mail className="h-4 w-4" />
              {dict.contact.emailCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
