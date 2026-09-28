"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { deleteUnusedImage } from "@/lib/storage/cleanup";
import { requireUser, refreshPublicPages } from "./guard";

/**
 * A suite's photographs, managed from the suite's own page.
 *
 * They are gallery photos linked to the suite, ordered by the gallery's
 * `position`. Reordering them hands the suite's own set of positions out again
 * in the new order, so the photos of other spaces keep their places.
 */

function refresh(suiteId: string) {
  refreshPublicPages();
  revalidatePath(`/admin/suites/${suiteId}`);
  revalidatePath("/admin/suites");
  revalidatePath("/admin/galerie");
}

async function assignOrder(suiteId: string, orderedIds: string[]) {
  const rows = await db.galleryImage.findMany({
    where: { id: { in: orderedIds } },
    select: { id: true, position: true },
  });
  const positions = rows.map((row) => row.position).sort((a, b) => a - b);
  const known = new Set(rows.map((row) => row.id));
  const ids = orderedIds.filter((id) => known.has(id));

  await db.$transaction(
    ids.map((id, index) =>
      db.galleryImage.update({ where: { id }, data: { position: positions[index], suiteId } }),
    ),
  );
}

async function suitePhotoIds(suiteId: string) {
  const rows = await db.galleryImage.findMany({
    where: { suiteId },
    orderBy: { position: "asc" },
    select: { id: true },
  });
  return rows.map((row) => row.id);
}

/** Saves the order the owner arranged. Unknown or foreign ids are ignored. */
export async function reorderSuitePhotos(suiteId: string, orderedIds: string[]) {
  await requireUser();
  const current = await suitePhotoIds(suiteId);
  const mine = new Set(current);
  const next = orderedIds.filter((id) => mine.has(id));
  // Anything the page did not know about (added in another tab) keeps its turn at the end.
  for (const id of current) if (!next.includes(id)) next.push(id);
  await assignOrder(suiteId, next);
  refresh(suiteId);
}

/** Links gallery photos to the suite, after the ones it already has. */
export async function addPhotosToSuite(suiteId: string, photoIds: string[]) {
  await requireUser();
  if (!(await db.suite.findUnique({ where: { id: suiteId }, select: { id: true } }))) return;
  const current = await suitePhotoIds(suiteId);
  const added = photoIds.filter((id) => !current.includes(id));
  if (added.length === 0) return;
  await assignOrder(suiteId, [...current, ...added]);
  refresh(suiteId);
}

/** Unlinks a photo from the suite. It stays in the gallery. */
export async function removePhotoFromSuite(suiteId: string, photoId: string) {
  await requireUser();
  await db.galleryImage.updateMany({ where: { id: photoId, suiteId }, data: { suiteId: null } });
  refresh(suiteId);
}

/** Uses one of the suite's photos as its main picture on the Suites page. */
export async function setSuiteCover(suiteId: string, photoId: string) {
  await requireUser();
  const [suite, photo] = await Promise.all([
    db.suite.findUnique({ where: { id: suiteId }, select: { imageUrl: true } }),
    db.galleryImage.findUnique({ where: { id: photoId } }),
  ]);
  if (!suite || !photo) return;

  await db.suite.update({
    where: { id: suiteId },
    data: {
      imageUrl: photo.imageUrl,
      altFr: photo.altFr || null,
      altEn: photo.altEn || null,
      altEs: photo.altEs || null,
      altAr: photo.altAr || null,
    },
  });
  if (suite.imageUrl !== photo.imageUrl) await deleteUnusedImage(suite.imageUrl);
  refresh(suiteId);
}
