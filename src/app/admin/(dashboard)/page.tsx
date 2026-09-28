import Link from "next/link";
import { db } from "@/lib/db/client";
import { auth } from "@/auth";

export default async function DashboardHome() {
  const session = await auth();
  const [published, total, newEnquiries, allEnquiries] = await Promise.all([
    db.amenity.count({ where: { published: true } }),
    db.amenity.count(),
    db.enquiry.count({ where: { status: "NEW" } }),
    db.enquiry.count(),
  ]);
  const texts = await db.siteText.count();
  const [suites, photos, missingAlt] = await Promise.all([
    db.suite.count({ where: { published: true } }),
    db.galleryImage.count({ where: { published: true } }),
    db.galleryImage.count({ where: { altFr: "" } }),
  ]);

  return (
    <>
      <h1 className="text-2xl font-light">Bonjour {session?.user?.name}.</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Vous modifiez ici le contenu du site. Chaque changement est publié
        immédiatement, dans les quatre langues.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/textes"
          className="block border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <p className="field-label">Textes du site</p>
          <p className="mt-3 text-3xl font-light">{texts}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {texts ? "textes modifiés, dans les quatre langues." : "Tous les textes, dans les quatre langues."}
          </p>
        </Link>

        <Link
          href="/admin/reglages"
          className="block border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <p className="field-label">Réglages</p>
          <p className="mt-3 text-lg font-light">Coordonnées et photos des pages</p>
          <p className="mt-3 text-sm text-muted-foreground">WhatsApp, email, Instagram, photo d&apos;ouverture…</p>
        </Link>

        <Link
          href="/admin/prestations"
          className="block border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <p className="field-label">Prestations</p>
          <p className="mt-3 text-3xl font-light">
            {published}
            <span className="text-base text-muted-foreground"> / {total} publiées</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Noms, photos et ordre d&apos;affichage.
          </p>
        </Link>

        <Link
          href="/admin/demandes"
          className="block border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <p className="field-label">Demandes de réservation</p>
          <p className="mt-3 text-3xl font-light">
            {newEnquiries}
            <span className="text-base text-muted-foreground"> / {allEnquiries} nouvelles</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Dates, invités et coordonnées.
          </p>
        </Link>

        <Link
          href="/admin/suites"
          className="block border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <p className="field-label">Suites et chambres</p>
          <p className="mt-3 text-3xl font-light">{suites}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Noms, descriptions et photos.
          </p>
        </Link>

        <Link
          href="/admin/galerie"
          className="block border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <p className="field-label">Galerie</p>
          <p className="mt-3 text-3xl font-light">{photos}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {missingAlt > 0
              ? `${missingAlt} photo${missingAlt > 1 ? "s" : ""} sans description.`
              : "Toutes les photos sont décrites."}
          </p>
        </Link>
      </div>
    </>
  );
}
