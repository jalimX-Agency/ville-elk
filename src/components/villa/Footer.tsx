import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { Locale } from "@/lib/i18n/locales";
import { hrefFor, type PageKey } from "@/lib/i18n/routes";
import { getContact } from "@/lib/content/site";
import { formatPhone } from "@/lib/content/phone";
import { Logo } from "@/components/brand/Logo";

export async function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const contact = await getContact();
  const pages: { page: PageKey; label: string }[] = [
    { page: "suites", label: dict.nav.rooms },
    { page: "gallery", label: dict.nav.gallery },
    { page: "concierge", label: dict.nav.concierge },
    { page: "activities", label: dict.nav.activities },
    { page: "contact", label: dict.nav.contact },
    { page: "booking", label: dict.nav.bookNow },
  ];

  return (
    <footer className="border-t border-border px-6 pb-10 pt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <Logo variant="framed" className="w-[190px] sm:w-[220px]" />
        <p className="body-copy max-w-md text-sm">{dict.footer.description}</p>

        <nav aria-label="Villa Elk">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {pages.map(({ page, label }) => (
              <li key={page}>
                <Link
                  href={hrefFor(page, locale)}
                  className="text-sm text-foreground transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <a href={`mailto:${contact.email}`} className="text-muted-foreground transition-colors hover:text-primary">
            {contact.email}
          </a>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {formatPhone(contact.whatsapp)}
          </a>
        </p>
        <p className="body-copy max-w-md text-sm">{dict.stay.languages}</p>

        <div className="flex w-full flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="eyebrow text-muted-foreground">
            © {new Date().getFullYear()} Villa Elk — {dict.footer.rights}
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <li>
              <Link href={hrefFor("legal", locale)} className="eyebrow text-muted-foreground transition-colors hover:text-primary">
                {dict.footer.legal}
              </Link>
            </li>
            <li>
              <Link href={hrefFor("privacy", locale)} className="eyebrow text-muted-foreground transition-colors hover:text-primary">
                {dict.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
