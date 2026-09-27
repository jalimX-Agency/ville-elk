"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid2x2 } from "lucide-react";
import { pick, type GalleryPhoto } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { Viewer } from "./GalleryGrid";

/**
 * The suite page opens on its photographs. The track is a native scroll-snap
 * strip, so a thumb swipes it the way it swipes anything else on a phone — the
 * client has already said what a hijacked scroll feels like. Which slide is
 * showing comes from an IntersectionObserver rather than scroll arithmetic, so
 * it reads the same in Arabic, where the strip runs right to left.
 */
export function SuiteCarousel({
  photos,
  locale,
  dict,
  children,
}: {
  photos: GalleryPhoto[];
  locale: Locale;
  dict: Dictionary;
  /** The suite's name and facts, laid over the bottom of the photographs. */
  children: React.ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const rtl = locale === "ar";
  const total = photos.length;

  useEffect(() => {
    const root = track.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-index]").forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [total]);

  function go(index: number) {
    const next = (index + total) % total;
    track.current
      ?.querySelector<HTMLElement>(`[data-index="${next}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      aria-roledescription="carousel"
      aria-label={dict.suites.photosTitle}
      className="relative h-[74svh] min-h-[460px] overflow-hidden bg-onyx lg:h-[86vh]"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(active + (rtl ? -1 : 1));
        if (event.key === "ArrowLeft") go(active + (rtl ? 1 : -1));
      }}
    >
      <div
        ref={track}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            data-index={index}
            onClick={() => setOpen(index)}
            aria-label={`${dict.gallery.viewer.open} — ${pick(photo.image.alt, locale)}`}
            aria-current={index === active ? "true" : undefined}
            className="relative h-full w-full shrink-0 snap-center snap-always"
          >
            <Image
              src={photo.image.src}
              alt={pick(photo.image.alt, locale)}
              fill
              // A landscape photograph filling a portrait screen is shown about
              // 1.25 x the screen height wide; asking for 100vw would blur it.
              sizes="(orientation: portrait) 125vh, 100vw"
              quality={85}
              priority={index === 0}
              loading={index < 2 ? "eager" : "lazy"}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Legibility for the name, without a box around it */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#15120f]/85 via-[#15120f]/15 to-[#15120f]/30"
        aria-hidden="true"
      />

      {/* Where you are in the set: a hairline that fills, and the count */}
      <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-4 sm:px-8 lg:px-[5vw]">
        <div className="h-px w-full bg-white/25">
          <div
            className="h-px bg-[var(--brass-light)] transition-[width] duration-500 ease-out"
            style={{ width: `${((active + 1) / total) * 100}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-xs tracking-[0.2em] text-white/85 tabular-nums" aria-live="polite">
          {pad(active + 1)} <span className="text-white/45">/ {pad(total)}</span>
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-7 text-[#f5efe6] sm:px-8 lg:px-[5vw] lg:pb-12">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">{children}</div>

          <div className="pointer-events-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label={dict.gallery.viewer.previous}
              className="hidden h-12 w-12 place-items-center rounded-full border border-white/30 backdrop-blur-sm transition-colors hover:bg-white/10 sm:grid"
            >
              {rtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label={dict.gallery.viewer.next}
              className="hidden h-12 w-12 place-items-center rounded-full border border-white/30 backdrop-blur-sm transition-colors hover:bg-white/10 sm:grid"
            >
              {rtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setOpen(active)}
              aria-label={dict.suites.allPhotos}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/30 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <Grid2x2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <Viewer
        photos={photos}
        index={open}
        locale={locale}
        labels={dict.gallery.viewer}
        onIndex={(next) => {
          setOpen(next);
          // Closing the viewer leaves the carousel on the photo it ended on.
          if (next !== null) go(next);
        }}
      />
    </section>
  );
}
