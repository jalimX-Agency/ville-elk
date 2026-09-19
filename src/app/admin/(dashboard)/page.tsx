import Link from "next/link";
import { db } from "@/lib/db/client";
import { getSessionUser } from "@/lib/auth/session";

export default async function DashboardHome() {
  const user = await getSessionUser();
  const [published, total] = await Promise.all([
    db.amenity.count({ where: { published: true } }),
    db.amenity.count(),
  ]);

  return (
    <>
      <h1 className="text-2xl font-light">Bonjour {user?.name}.</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Vous modifiez ici le contenu du site. Chaque changement est publié
        immédiatement, dans les quatre langues.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/prestations"
          className="block border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <p className="admin-label">Prestations</p>
          <p className="mt-3 text-3xl font-light">
            {published}
            <span className="text-base text-muted-foreground"> / {total} publiées</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Noms, photos et ordre d&apos;affichage.
          </p>
        </Link>

        {/* Sections still to come; listed so nothing looks missing. */}
        <div className="border border-dashed border-border p-6 text-muted-foreground">
          <p className="admin-label">Bientôt</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>Suites et niveaux</li>
            <li>Galerie photo</li>
            <li>Demandes de réservation</li>
          </ul>
        </div>
      </div>
    </>
  );
}
