import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { requireUser } from "@/app/admin/guard";
import { FicheDocument } from "@/components/fiche/FicheDocument";
import { FicheToolbar } from "@/components/fiche/FicheToolbar";
import { FICHE_LOCALES, type FicheLocale } from "@/lib/booking/fiche";
import { ficheLocaleOf, loadFiche } from "@/lib/booking/fiche-server";

/**
 * The owner's preview of a booking sheet, in any of the four languages, from
 * which it can be printed or saved as a PDF. Outside the dashboard frame so
 * the page prints as the sheet alone.
 */
export default async function FichePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  await requireUser();
  const [{ id }, { lang }] = await Promise.all([params, searchParams]);
  const row = await db.enquiry.findUnique({ where: { id } });
  if (!row) notFound();

  const locale = ficheLocaleOf(row, lang);
  const fiche = await loadFiche(row, locale);
  const hrefFor = Object.fromEntries(FICHE_LOCALES.map((l) => [l, `/admin/fiche/${id}?lang=${l}`])) as Record<FicheLocale, string>;

  return (
    <main className="min-h-screen px-3 py-6 sm:px-6 sm:py-10">
      <FicheToolbar
        current={locale}
        hrefFor={hrefFor}
        printLabel="Imprimer / PDF"
        back={{ href: "/admin/demandes", label: "Demandes" }}
      />
      <FicheDocument fiche={fiche} />
    </main>
  );
}
