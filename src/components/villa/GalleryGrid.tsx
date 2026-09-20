import Image from "next/image";
import { pick } from "@/lib/content/types";
import type { GalleryPhoto } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * A column layout rather than a uniform grid: photographs keep their own
 * proportions, which is what stops a set of interiors looking like stock.
 */
export function GalleryGrid({
  photos,
  locale,
}: {
  photos: GalleryPhoto[];
  locale: Locale;
}) {
  return (
    <ul className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-6 [&>li]:mb-4 lg:[&>li]:mb-6">
      {photos.map((photo, index) => (
        <li key={photo.id} className="break-inside-avoid">
          <div className="relative overflow-hidden bg-muted">
            <Image
              src={photo.image.src}
              alt={pick(photo.image.alt, locale)}
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
              // The first screenful should not wait for JavaScript to notice it.
              loading={index < 3 ? "eager" : "lazy"}
              priority={index === 0}
              className="h-auto w-full object-cover"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
