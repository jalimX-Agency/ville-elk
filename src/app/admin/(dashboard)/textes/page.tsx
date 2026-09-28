import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db/client";
import { SECTIONS } from "@/lib/content/site-sections";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function TextsPage() {
  const rows = await db.siteText.findMany({ select: { key: true } });
  const modified = (section: string) =>
    new Set(rows.filter((row) => row.key.startsWith(`${section}.`)).map((row) => row.key)).size;

  return (
    <>
      <PageHeader
        title="Textes du site"
        description="Tous les textes visibles sur le site, en quatre langues. Seuls vos changements sont gardés : chaque texte peut revenir à l'original."
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => {
          const count = modified(section.key);
          return (
            <li key={section.key}>
              <Link href={`/admin/textes/${section.key}`} className="admin-card flex h-full items-center gap-4 p-4 sm:p-5">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{section.title}</span>
                  {section.hint && <span className="mt-1 block text-sm text-muted-foreground">{section.hint}</span>}
                  <span className={"mt-3 " + (count ? "admin-pill admin-pill-new" : "admin-pill admin-pill-off")}>
                    {count ? `${count} modifié${count > 1 ? "s" : ""}` : "Texte d'origine"}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground rtl:rotate-180" />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
