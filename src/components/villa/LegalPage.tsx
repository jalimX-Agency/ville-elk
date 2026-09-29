import Link from "next/link";
import { hrefFor } from "@/lib/i18n/routes";
import { getContact } from "@/lib/content/site";
import { formatPhone } from "@/lib/content/phone";
import { LEGAL, LEGAL_UPDATED } from "@/lib/content/legal";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/**
 * The legal notice and the privacy policy share one layout: a table of
 * contents that stays beside the text on a wide screen, and numbered sections
 * short enough to read on a phone.
 */
export async function LegalPage({
  dict,
  locale,
  doc,
}: {
  dict: Dictionary;
  locale: Locale;
  doc: "legal" | "privacy";
}) {
  const copy = LEGAL[locale];
  const page = copy[doc];
  const other = doc === "legal" ? "privacy" : "legal";
  const contact = await getContact();

  // The owner's current details, whatever the text was written with.
  const address = dict.contact.address.replace(/\s*\n\s*/g, ", ");
  const fill = (text: string) =>
    text
      .replaceAll("{email}", contact.email)
      .replaceAll("{phone}", formatPhone(contact.whatsapp))
      .replaceAll("{address}", address);

  const updated = new Intl.DateTimeFormat(locale === "ar" ? "ar-MA-u-nu-latn" : locale, {
    dateStyle: "long",
  }).format(new Date(`${LEGAL_UPDATED}T12:00:00Z`));
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <article className="pt-20">
      <header className="mx-auto max-w-[1400px] px-6 pt-12 lg:px-[5vw] lg:pt-20">
        <p className="eyebrow text-primary">{copy.eyebrow}</p>
        <h1 className="heading-display mt-4 max-w-4xl text-[clamp(2.6rem,8vw,5.5rem)] leading-[1] text-foreground">
          {page.title}
        </h1>
        <p className="body-copy mt-6 max-w-2xl text-lg">{page.intro}</p>
        <p className="mt-6 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-muted-foreground">
          {copy.updated} · <time dateTime={LEGAL_UPDATED}>{updated}</time>
        </p>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-x-16 lg:px-[5vw] lg:py-24">
        <nav aria-label={copy.contents} className="lg:col-span-4">
          <div className="border-t border-border pt-6 lg:sticky lg:top-28">
            <p className="eyebrow text-muted-foreground">{copy.contents}</p>
            <ol className="mt-5 space-y-3">
              {page.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#section-${index + 1}`}
                    className="flex gap-4 text-sm text-foreground transition-colors hover:text-primary"
                  >
                    <span className="font-mono text-[0.75rem] text-muted-foreground tabular-nums">{pad(index + 1)}</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="lg:col-span-8">
          {page.sections.map((section, index) => (
            <section
              key={section.heading}
              id={`section-${index + 1}`}
              className="scroll-mt-28 border-t border-border py-10 first:pt-6"
            >
              <h2 className="flex items-baseline gap-4 text-2xl text-foreground">
                <span className="font-mono text-[0.75rem] tracking-[0.18em] text-accent tabular-nums">
                  {pad(index + 1)}
                </span>
                <span className="heading-display">{section.heading}</span>
              </h2>
              <div className="mt-5 space-y-4 ps-9">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="body-copy max-w-2xl">
                    {fill(paragraph)}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-6 border-t border-border pt-8">
            <p className="eyebrow text-muted-foreground">{copy.seeAlso}</p>
            <div className="mt-4 flex flex-wrap gap-x-8">
              <Link href={hrefFor(other, locale)} className="btn-quiet">
                {copy[other].title}
              </Link>
              <Link href={hrefFor("contact", locale)} className="btn-quiet">
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
