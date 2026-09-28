"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { deleteUnusedImage } from "@/lib/storage/cleanup";
import { isSuiteSpace, sortBySpace } from "@/lib/content/types";
import { requireUser, refreshPublicPages } from "./guard";

/**
 * A suite's photographs, managed from the suite's own page.
 *
 * They are gallery photos linked to the suite, ordered by the gallery's
 * `position`. Reordering them hands the suite's own set of positions out again
 * in the new order, so the photos of other spaces keep their places. Every
 * change also groups them by part of the suite (bedroom, bathroom…), so the
 * order in the database is the order the page shows.
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

async function suitePhotos(suiteId: string) {
  return db.galleryImage.findMany({
    where: { suiteId },
    orderBy: { position: "asc" },
    select: { id: true, suiteSpace: true },
  });
}

/** Writes the order grouped by part, keeping the given order inside each part. */
async function assignGroupedOrder(suiteId: string, rows: { id: string; suiteSpace: string | null }[]) {
  await assignOrder(suiteId, sortBySpace(rows, (row) => row.suiteSpace).map((row) => row.id));
}

const spaceOrNull = (space: string | null | undefined) => (space && isSuiteSpace(space) ? space : null);

/** Saves the order the owner arranged. Unknown or foreign ids are ignored. */
export async function reorderSuitePhotos(suiteId: string, orderedIds: string[]) {
  await requireUser();
  const current = await suitePhotos(suiteId);
  const byId = new Map(current.map((row) => [row.id, row]));
  const next = orderedIds.flatMap((id) => byId.get(id) ?? []);
  // Anything the page did not know about (added in another tab) keeps its turn at the end.
  for (const row of current) if (!orderedIds.includes(row.id)) next.push(row);
  await assignGroupedOrder(suiteId, next);
  refresh(suiteId);
}

/** Links gallery photos to the suite, at the end of the part they go in. */
export async function addPhotosToSuite(suiteId: string, photoIds: string[], space: string | null) {
  await requireUser();
  if (!(await db.suite.findUnique({ where: { id: suiteId }, select: { id: true } }))) return;
  const current = await suitePhotos(suiteId);
  const added = photoIds.filter((id) => !current.some((row) => row.id === id));
  if (added.length === 0) return;
  const suiteSpace = spaceOrNull(space);
  await db.galleryImage.updateMany({ where: { id: { in: added } }, data: { suiteSpace } });
  await assignGroupedOrder(suiteId, [...current, ...added.map((id) => ({ id, suiteSpace }))]);
  refresh(suiteId);
}

/** Moves a photo to another part of the suite, at the end of that part. */
export async function setSuitePhotoSpace(suiteId: string, photoId: string, space: string | null) {
  await requireUser();
  const current = await suitePhotos(suiteId);
  const photo = current.find((row) => row.id === photoId);
  if (!photo) return;
  const suiteSpace = spaceOrNull(space);
  await db.galleryImage.update({ where: { id: photoId }, data: { suiteSpace } });
  await assignGroupedOrder(suiteId, [...current.filter((row) => row.id !== photoId), { id: photoId, suiteSpace }]);
  refresh(suiteId);
}

/** Unlinks a photo from the suite. It stays in the gallery. */
export async function removePhotoFromSuite(suiteId: string, photoId: string) {
  await requireUser();
  await db.galleryImage.updateMany({ where: { id: photoId, suiteId }, data: { suiteId: null, suiteSpace: null } });
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
