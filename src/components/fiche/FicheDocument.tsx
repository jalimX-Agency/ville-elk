import { Antic_Didone, Albert_Sans, IBM_Plex_Sans_Arabic, Amiri } from "next/font/google";
import { Logo } from "@/components/brand/Logo";
import type { Fiche } from "@/lib/booking/fiche";

const antic = Antic_Didone({ variable: "--font-antic", subsets: ["latin"], weight: "400", display: "swap" });
const albert = Albert_Sans({ variable: "--font-albert", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ variable: "--font-plex-arabic", subsets: ["arabic"], weight: ["400", "500", "600"], display: "swap" });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic"], weight: ["400", "700"], display: "swap" });

/**
 * The booking sheet as an A4 page: the same on screen, on paper and as a PDF
 * saved from the print dialog. Shared by the dashboard preview and the
 * guest's own link.
 */
export function FicheDocument({ fiche }: { fiche: Fiche }) {
  const { copy, dir } = fiche;
  const rtl = dir === "rtl";
  const display = rtl ? "var(--font-amiri), serif" : "var(--font-antic), Georgia, serif";
  const body = rtl ? "var(--font-plex-arabic), Tahoma, sans-serif" : "var(--font-albert), Helvetica, sans-serif";

  return (
    <article
      dir={dir}
      lang={fiche.locale}
      className={`fiche-page ${antic.variable} ${albert.variable} ${plexArabic.variable} ${amiri.variable}`}
      style={{ fontFamily: body }}
    >
      <header className="flex items-start justify-between gap-6 border-b-2 border-[#1f1c19] pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#b4684a]">{copy.confirmed}</p>
          <h1 className="mt-2 text-[2.1rem] leading-tight text-[#1f1c19]" style={{ fontFamily: display }}>
            {copy.title}
          </h1>
          <p className="mt-2 text-sm text-[#6b5f55]">
            {copy.reference} <strong className="font-semibold tracking-wide text-[#1f1c19]" dir="ltr">{fiche.reference}</strong>
            <span className="mx-2">·</span>
            {copy.issued} {fiche.issued}
          </p>
        </div>
        <Logo variant="framed" className="w-[120px] shrink-0" />
      </header>

      {fiche.sections.map((section) => (
        <section key={section.title} className="mt-7 break-inside-avoid">
          <h2 className="text-xs uppercase tracking-[0.18em] text-[#b4684a]">{section.title}</h2>
          <dl className="mt-2">
            {section.rows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-6 border-t border-[#e8e0d5] py-2.5">
                <dt className="text-[#6b5f55]">{row.label}</dt>
                <dd className={"text-end " + (row.strong ? "font-semibold text-[#1f1c19]" : "text-[#2a2420]")}>
                  {row.ltr ? <bdi dir="ltr">{row.value}</bdi> : row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      {fiche.note && (
        <section className="mt-7 break-inside-avoid border-s-[3px] border-[#c2a05e] bg-[#f7f1e8] px-4 py-3">
          <h2 className="text-xs text-[#6b5f55]">{copy.noteTitle}</h2>
          <p className="mt-1 whitespace-pre-wrap">{fiche.note}</p>
        </section>
      )}

      <section className="mt-7 break-inside-avoid">
        <h2 className="text-xs uppercase tracking-[0.18em] text-[#b4684a]">{copy.conditionsTitle}</h2>
        <ul className="mt-2 space-y-1 text-sm text-[#2a2420]">
          {copy.conditions.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-[#c2a05e]" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 grid gap-6 border-t border-[#e8e0d5] pt-6 text-sm text-[#6b5f55] sm:grid-cols-2">
        <div>
          <p className="font-semibold text-[#1f1c19]">{copy.address}</p>
          <p className="mt-1 whitespace-pre-line">{fiche.contact.address}</p>
        </div>
        <div>
          <p className="font-semibold text-[#1f1c19]">{copy.contact}</p>
          <p className="mt-1" dir="ltr" style={{ textAlign: rtl ? "right" : "left" }}>
            WhatsApp +{fiche.contact.whatsapp}
            <br />
            {fiche.contact.email}
          </p>
          <p className="mt-1">{fiche.contact.languages}</p>
        </div>
        <p className="text-base text-[#1f1c19] sm:col-span-2" style={{ fontFamily: display }}>
          {copy.thanks}
        </p>
      </footer>
    </article>
  );
}
