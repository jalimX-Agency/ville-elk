import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { db } from "@/lib/db/client";
import { SuiteForm } from "@/components/admin/SuiteForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSuite } from "@/app/admin/site-actions";
import { SuitePhotos } from "@/components/admin/SuitePhotos";
import { sortBySpace } from "@/lib/content/types";

export default async function EditSuitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [suite, gallery] = await Promise.all([
    db.suite.findUnique({ where: { id } }),
    db.galleryImage.findMany({
      orderBy: { position: "asc" },
      include: { suite: { select: { nameFr: true } } },
    }),
  ]);
  if (!suite) notFound();

  // Grouped by part of the suite, the way the public page shows them.
  const photos = sortBySpace(
    gallery.filter((p) => p.suiteId === suite.id),
    (p) => p.suiteSpace,
  ).map((p) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      category: p.category,
      suiteId: p.suiteId,
      suiteSpace: p.suiteSpace,
      published: p.published,
      altFr: p.altFr,
      altEn: p.altEn,
      altEs: p.altEs,
      altAr: p.altAr,
    }));
  const library = gallery
    .filter((p) => p.suiteId !== suite.id)
    .map((p) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      category: p.category,
      altFr: p.altFr,
      suiteName: p.suite?.nameFr ?? null,
    }));

  return (
    <>
      <PageHeader
        title={suite.nameFr}
        back={{ href: "/admin/suites", label: "Suites" }}
        description={suite.published ? undefined : "Cette suite est masquée : publiez-la depuis la liste des suites quand elle est prête."}
        action={
          suite.published ? (
            <Link href={`/fr/suites/${suite.slug}`} target="_blank" className="admin-button-quiet">
              Voir la page ↗
            </Link>
          ) : undefined
        }
      />
      <div className="space-y-4">
        <SuitePhotos
          suiteId={suite.id}
          suiteName={suite.nameFr}
          coverUrl={suite.imageUrl}
          photos={photos}
          library={library}
        />
        {/* Remounts when a photo is made the main one, so the field shows it. */}
        <SuiteForm key={suite.imageUrl ?? ""} suite={suite} />
      </div>
      <DeleteButton action={deleteSuite} id={suite.id} what="cette suite" />
    </>
  );
}
