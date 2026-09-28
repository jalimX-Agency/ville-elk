import Link from "next/link";
import { db } from "@/lib/db/client";
import { SECTIONS } from "@/lib/content/site-sections";

export default async function TextsPage() {
  const rows = await db.siteText.findMany({ select: { key: true } });
  const modified = (section: string) =>
    new Set(rows.filter((row) => row.key.startsWith(`${section}.`)).map((row) => row.key)).size;

  return (
    <>
      <h1 className="text-2xl font-light">Textes du site</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Tous les textes visibles sur le site, dans les quatre langues. Seuls vos
        changements sont gardés : chaque texte peut revenir à l&apos;original.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => {
          const count = modified(section.key);
          return (
            <li key={section.key}>
              <Link
                href={`/admin/textes/${section.key}`}
                className="block h-full border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <p className="text-lg">{section.title}</p>
                {section.hint && <p className="mt-2 text-sm text-muted-foreground">{section.hint}</p>}
                <p className="field-label mt-4">
                  {count ? `${count} texte${count > 1 ? "s" : ""} modifié${count > 1 ? "s" : ""}` : "Textes d'origine"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
