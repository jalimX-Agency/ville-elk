import { db } from "@/lib/db/client";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function GalleryAdminPage() {
  const [photos, suites] = await Promise.all([
    db.galleryImage.findMany({ orderBy: { position: "asc" } }),
    db.suite.findMany({ orderBy: { position: "asc" }, select: { id: true, nameFr: true } }),
  ]);

  return (
    <>
      <PageHeader
        title="Galerie"
        description="Touchez une photo pour la décrire, la classer, la masquer ou changer sa place. Une photo liée à une suite apparaît aussi sur la page de cette suite."
      />
      <GalleryUploader />
      <div className="mt-6">
        <GalleryManager
          photos={photos.map((p) => ({
            id: p.id,
            imageUrl: p.imageUrl,
            category: p.category,
            suiteId: p.suiteId,
            published: p.published,
            altFr: p.altFr,
            altEn: p.altEn,
            altEs: p.altEs,
            altAr: p.altAr,
          }))}
          suites={suites.map((s) => ({ id: s.id, name: s.nameFr }))}
        />
      </div>
    </>
  );
}
