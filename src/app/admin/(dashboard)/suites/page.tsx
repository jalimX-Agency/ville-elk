import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import { moveSuite, toggleSuite } from "@/app/admin/actions";

export default async function SuitesPage() {
  const suites = await db.suite.findMany({ orderBy: { position: "asc" } });
  const last = suites.length - 1;

  return (
    <>
      <h1 className="text-2xl font-light">Suites et chambres</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Les photos actuelles sont celles prises au téléphone. Remplacez-les une
        à une quand le reportage professionnel arrive — rien d&apos;autre ne
        change.
      </p>

      <ul className="mt-8 border-t border-border">
        {suites.map((suite, index) => (
          <li
            key={suite.id}
            className="flex flex-wrap items-center gap-4 border-b border-border py-4"
          >
            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-muted">
              {suite.imageUrl ? (
                <Image src={suite.imageUrl} alt="" fill sizes="56px" className="object-cover" />
              ) : (
                <span className="grid h-full place-items-center text-xs text-muted-foreground">
                  —
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link href={`/admin/suites/${suite.id}`} className="text-lg hover:text-primary">
                {suite.nameFr}
              </Link>
              <p className="field-label mt-1">
                {suite.level === "0" ? "Rez-de-chaussée" : "Étage"}
                {suite.areaSqm ? ` · ${suite.areaSqm} m²` : ""}
                {!suite.published && " · dépubliée"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form action={moveSuite}>
                <input type="hidden" name="id" value={suite.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  aria-label={`Monter ${suite.nameFr}`}
                  className="admin-button-quiet"
                >
                  ↑
                </button>
              </form>
              <form action={moveSuite}>
                <input type="hidden" name="id" value={suite.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === last}
                  aria-label={`Descendre ${suite.nameFr}`}
                  className="admin-button-quiet"
                >
                  ↓
                </button>
              </form>
              <form action={toggleSuite}>
                <input type="hidden" name="id" value={suite.id} />
                <button type="submit" className="admin-button-quiet">
                  {suite.published ? "Dépublier" : "Publier"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
