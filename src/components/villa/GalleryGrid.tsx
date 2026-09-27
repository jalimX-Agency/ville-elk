"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY_CATEGORIES, pick, type GalleryCategory, type GalleryPhoto } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/** Photos rendered per step: one screenful on a desktop, two on a phone. */
const PAGE = 12;

type Filter = "all" | GalleryCategory;

const LABEL_KEY: Record<GalleryCategory, keyof Dictionary["gallery"]["categories"]> = {
  exterieur: "exterieur",
  rdc: "rdc",
  "sous-sol": "sousSol",
  suites: "suites",
  rooftop: "rooftop",
};

/**
 * The gallery shows one part of the house at a time and a dozen photographs at
 * a time, so a visitor never downloads 124 pictures to look at three. Each
 * thumbnail opens a viewer that shows the photograph whole — the grid crops,
 * the viewer never does.
 */
export function GalleryGrid({
  photos,
  locale,
  dict,
}: {
  photos: GalleryPhoto[];
  locale: Locale;
  dict: Dictionary;
}) {
  const copy = dict.gallery;
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  const counts = useMemo(() => {
    const byCategory = new Map<GalleryCategory, number>();
    for (const photo of photos) {
      byCategory.set(photo.category, (byCategory.get(photo.category) ?? 0) + 1);
    }
    return byCategory;
  }, [photos]);

  const filtered = useMemo(
    () => (filter === "all" ? photos : photos.filter((photo) => photo.category === filter)),
    [photos, filter],
  );
  const shown = filtered.slice(0, visible);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: copy.categories.all, count: photos.length },
    ...GALLERY_CATEGORIES.filter((category) => counts.get(category)).map((category) => ({
      id: category,
      label: copy.categories[LABEL_KEY[category]],
      count: counts.get(category) ?? 0,
    })),
  ];

  function choose(next: Filter) {
    setFilter(next);
    setVisible(PAGE);
    setOpen(null);
  }

  return (
    <div className="mt-12 lg:mt-16">
      {filters.length > 2 && (
      <div
        role="group"
        aria-label={copy.filterLabel}
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:px-0"
      >
        {filters.map((item) => {
          const active = item.id === filter;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => choose(item.id)}
              className={
                "flex min-h-11 shrink-0 items-center gap-2 border px-4 text-sm transition-colors " +
                (active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary hover:text-primary")
              }
            >
              {item.label}
              <span className={"tabular-nums " + (active ? "opacity-80" : "text-muted-foreground")}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
      )}

      <ul className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
        {shown.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`${copy.viewer.open} — ${pick(photo.image.alt, locale)}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-muted"
            >
              <Image
                src={photo.image.src}
                alt={pick(photo.image.alt, locale)}
                fill
                // Thumbnails only: the full picture is fetched when it is opened.
                sizes="(min-width: 1024px) 30vw, 48vw"
                priority={index < 3}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {filtered.length > visible && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setVisible((count) => count + PAGE)}
            className="btn-quiet"
          >
            {copy.showMore}
          </button>
          <p className="text-sm text-muted-foreground tabular-nums">
            {shown.length} {copy.shownOf} {filtered.length}
          </p>
        </div>
      )}

      <Viewer
        photos={filtered}
        index={open}
        locale={locale}
        labels={copy.viewer}
        onIndex={(next) => {
          setOpen(next);
          // Paging through the viewer past what the grid shows grows the grid
          // with it, so closing lands on the photo the visitor stopped at.
          if (next !== null && next >= visible) setVisible(Math.ceil((next + 1) / PAGE) * PAGE);
        }}
      />
    </div>
  );
}

function Viewer({
  photos,
  index,
  locale,
  labels,
  onIndex,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  locale: Locale;
  labels: Dictionary["gallery"]["viewer"];
  onIndex: (index: number | null) => void;
}) {
  const rtl = locale === "ar";
  const photo = index === null ? null : photos[index];
  const total = photos.length;
  const touch = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + total) % total);
    },
    [index, total, onIndex],
  );

  // Arrow keys follow the reading direction: in Arabic, left is forward.
  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(rtl ? -1 : 1);
      if (event.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step, rtl]);

  const neighbours =
    index === null ? [] : [photos[(index + 1) % total], photos[(index - 1 + total) % total]];

  return (
    <Dialog.Root open={photo !== null} onOpenChange={(isOpen) => !isOpen && onIndex(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#15120f]/95" />
        <Dialog.Content
          dir={rtl ? "rtl" : "ltr"}
          aria-describedby={undefined}
          className="fixed inset-0 z-[61] flex flex-col text-[#efe6da] outline-none"
          onTouchStart={(event) => {
            touch.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touch.current === null) return;
            const dx = event.changedTouches[0].clientX - touch.current;
            touch.current = null;
            // A swipe towards the reading direction goes forward.
            if (Math.abs(dx) > 50) step((dx < 0) !== rtl ? 1 : -1);
          }}
        >
          {photo && (
            <>
              <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <span className="font-mono text-xs tabular-nums tracking-widest opacity-70">
                  {(index ?? 0) + 1} / {total}
                </span>
                <Dialog.Close
                  aria-label={labels.close}
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>

              <div className="relative min-h-0 flex-1">
                <Image
                  key={photo.id}
                  src={photo.image.src}
                  alt={pick(photo.image.alt, locale)}
                  fill
                  // Phones get the full photograph: a visitor pinches to look closer.
                  sizes="(max-width: 1024px) 200vw, 100vw"
                  quality={85}
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={labels.previous}
                  className="absolute inset-y-0 start-0 hidden w-20 items-center justify-center hover:bg-white/5 sm:flex"
                >
                  {rtl ? <ChevronRight className="h-7 w-7" /> : <ChevronLeft className="h-7 w-7" />}
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={labels.next}
                  className="absolute inset-y-0 end-0 hidden w-20 items-center justify-center hover:bg-white/5 sm:flex"
                >
                  {rtl ? <ChevronLeft className="h-7 w-7" /> : <ChevronRight className="h-7 w-7" />}
                </button>
              </div>

              <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
                {/* Phones get the arrows below the picture, where a thumb reaches. */}
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={labels.previous}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 sm:hidden"
                >
                  {rtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
                <Dialog.Title className="min-w-0 flex-1 text-center text-sm leading-snug opacity-90">
                  {pick(photo.image.alt, locale)}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={labels.next}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 sm:hidden"
                >
                  {rtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
              </div>

              {/* The next and previous pictures load in the background, so paging is instant. */}
              <div className="hidden" aria-hidden="true">
                {neighbours.map((neighbour) => (
                  <Image key={neighbour.id} src={neighbour.image.src} alt="" width={1920} height={1280} sizes="(max-width: 1024px) 200vw, 100vw" quality={85} loading="eager" />
                ))}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
