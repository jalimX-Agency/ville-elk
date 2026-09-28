"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { FICHE_LOCALES, type FicheLocale } from "@/lib/booking/fiche";

const SHORT: Record<FicheLocale, string> = { fr: "FR", en: "EN", es: "ES", ar: "AR" };

/** Above the sheet, never on it: language, print, and a way back. */
export function FicheToolbar({
  current,
  hrefFor,
  printLabel,
  back,
}: {
  current: FicheLocale;
  /** The same page in another language. */
  hrefFor: Record<FicheLocale, string>;
  printLabel: string;
  back?: { href: string; label: string };
}) {
  return (
    <div className="no-print mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center gap-3">
      {back && (
        <Link href={back.href} className="admin-button-quiet">
          <ArrowLeft className="h-4 w-4" /> {back.label}
        </Link>
      )}
      <nav aria-label="Langue" className="flex gap-1 rounded-full border border-[#ddd2c3] bg-white p-1">
        {FICHE_LOCALES.map((locale) => (
          <Link
            key={locale}
            href={hrefFor[locale]}
            aria-current={locale === current ? "true" : undefined}
            className={
              "grid min-h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-semibold " +
              (locale === current ? "bg-[#1f1c19] text-white" : "text-[#6b5f55] hover:text-[#1f1c19]")
            }
          >
            {SHORT[locale]}
          </Link>
        ))}
      </nav>
      <button type="button" onClick={() => window.print()} className="admin-button ms-auto">
        <Printer className="h-4 w-4" /> {printLabel}
      </button>
    </div>
  );
}
