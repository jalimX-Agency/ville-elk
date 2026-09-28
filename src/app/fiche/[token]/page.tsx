import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { FicheDocument } from "@/components/fiche/FicheDocument";
import { FicheToolbar } from "@/components/fiche/FicheToolbar";
import { FICHE_LOCALES, ficheCopy, type FicheLocale } from "@/lib/booking/fiche";
import { ficheLocaleOf, loadFiche } from "@/lib/booking/fiche-server";

export const metadata: Metadata = { title: "Villa Elk — Réservation" };

/**
 * The guest's own copy of their booking sheet, behind the unguessable link in
 * the confirmation email. Only a confirmed stay has one to show.
 */
export default async function GuestFichePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [{ token }, { lang }] = await Promise.all([params, searchParams]);
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) notFound();

  const row = await db.enquiry.findUnique({ where: { ficheToken: token } });
  if (!row || row.status !== "CONFIRMED") notFound();

  const locale = ficheLocaleOf(row, lang);
  const fiche = await loadFiche(row, locale);
  const hrefFor = Object.fromEntries(FICHE_LOCALES.map((l) => [l, `/fiche/${token}?lang=${l}`])) as Record<FicheLocale, string>;

  return (
    <main className="admin-app min-h-screen px-3 py-6 sm:px-6 sm:py-10">
      <FicheToolbar current={locale} hrefFor={hrefFor} printLabel={ficheCopy(locale).print} />
      <FicheDocument fiche={fiche} />
    </main>
  );
}
