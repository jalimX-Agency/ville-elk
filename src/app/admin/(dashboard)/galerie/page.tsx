import Image from "next/image";
import { db } from "@/lib/db/client";
import { deleteGalleryImage, moveGalleryImage, toggleGalleryImage } from "@/app/admin/actions";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { GalleryAltForm } from "@/components/admin/GalleryAltForm";

export default async function GalleryAdminPage() {
  const [photos, suiteRows] = await Promise.all([
    db.galleryImage.findMany({ orderBy: { position: "asc" } }),
    db.suite.findMany({ orderBy: { position: "asc" }, select: { id: true, nameFr: true } }),
  ]);
  const suites = suiteRows.map((suite) => ({ id: suite.id, name: suite.nameFr }));
  const last = photos.length - 1;
  const missingAlt = photos.filter((photo) => !photo.altFr.trim()).length;

  return (
    <>
      <h1 className="text-2xl font-light">Galerie</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        {photos.length} photo{photos.length > 1 ? "s" : ""} — l&apos;ordre
        ci-dessous est celui de la page.
        {missingAlt > 0 &&
          ` ${missingAlt} attend${missingAlt > 1 ? "ent" : ""} encore une description.`}
      </p>

      <div className="mt-8">
        <GalleryUploader />
      </div>

      <ul className="mt-8 space-y-4">
        {photos.map((photo, index) => (
          <li
            key={photo.id}
            className="flex flex-wrap gap-5 border border-border bg-card p-4 sm:flex-nowrap"
          >
            <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-muted">
              <Image
                src={photo.imageUrl}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="field-label">
                {index + 1}
                {!photo.published && " · dépubliée"}
                {!photo.altFr.trim() && " · sans description"}
              </p>
              <GalleryAltForm photo={photo} suites={suites} />
            </div>

            <div className="flex shrink-0 flex-wrap items-start gap-2">
              <form action={moveGalleryImage}>
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  aria-label="Monter la photo"
                  className="admin-button-quiet"
                >
                  ↑
                </button>
              </form>
              <form action={moveGalleryImage}>
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === last}
                  aria-label="Descendre la photo"
                  className="admin-button-quiet"
                >
                  ↓
                </button>
              </form>
              <form action={toggleGalleryImage}>
                <input type="hidden" name="id" value={photo.id} />
                <button type="submit" className="admin-button-quiet">
                  {photo.published ? "Dépublier" : "Publier"}
                </button>
              </form>
              <form action={deleteGalleryImage}>
                <input type="hidden" name="id" value={photo.id} />
                <button
                  type="submit"
                  className="admin-button-quiet text-[var(--terracotta-dark)]"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
