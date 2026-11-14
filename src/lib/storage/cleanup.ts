import { db } from "@/lib/db/client";
import { deleteImage } from "./r2";

/**
 * Deletes a stored photograph once nothing points at it any more.
 *
 * One file can serve several places — a gallery photo chosen as a suite's
 * main picture, say — so replacing it in one place must not break the other.
 */
export async function deleteUnusedImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const [gallery, suites, amenities, settings, posts] = await Promise.all([
    db.galleryImage.count({ where: { imageUrl: url } }),
    db.suite.count({ where: { imageUrl: url } }),
    db.amenity.count({ where: { imageUrl: url } }),
    db.siteSetting.count({ where: { value: url } }),
    db.blogPost.count({ where: { imageUrl: url } }),
  ]);
  if (gallery + suites + amenities + settings + posts === 0) await deleteImage(url);
}
