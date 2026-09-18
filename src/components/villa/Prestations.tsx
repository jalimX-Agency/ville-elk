"use client";

import { useState } from "react";
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import type { Amenity } from "@/lib/content/types";
import { pick } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export function Prestations({
  dict,
  locale,
  amenities,
}: {
  dict: Dictionary;
  locale: Locale;
  amenities: Amenity[];
}) {
  const firstWithImage = amenities.find((a) => a.image) ?? amenities[0];
  const [activeId, setActiveId] = useState(firstWithImage?.id);
  const active = amenities.find((a) => a.id === activeId) ?? firstWithImage;

  return (
    <section id="prestations" aria-labelledby="prestations-title" className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-[5vw] lg:py-28">
        <div className="lg:col-span-7">
          <p className="eyebrow text-primary">{dict.amenities.eyebrow}</p>
          <h2 id="prestations-title" className="heading-display mt-3 max-w-xl text-3xl text-foreground sm:text-4xl lg:text-5xl">
            {dict.amenities.title}
          </h2>

          <ul className="mt-10 border-t border-border lg:mt-14">
            {amenities.map((amenity) => {
              const isActive = amenity.id === active?.id;
              return (
                <li
                  key={amenity.id}
                  onMouseEnter={() => setActiveId(amenity.id)}
                  className="group flex items-center gap-4 border-b border-border py-4 lg:py-5"
                >
                  {/* Thumbnail on phones; the desktop frame handles the preview */}
                  {amenity.image && (
                    <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-muted lg:hidden">
                      <Image
                        src={amenity.image.src}
                        alt={pick(amenity.image.alt, locale)}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span
                    className={
                      "h-1.5 w-1.5 shrink-0 rotate-45 transition-colors max-lg:hidden " +
                      (isActive ? "bg-accent" : "bg-transparent")
                    }
                    aria-hidden="true"
                  />
                  <span
                    className={
                      "heading-display text-xl text-foreground transition-colors sm:text-2xl lg:text-[1.75rem] " +
                      // hover highlight only where there is a pointer
                      (isActive ? "lg:text-primary" : "")
                    }
                  >
                    {pick(amenity.name, locale)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Decorative: the list above already carries every name */}
        <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
          <div className="sticky top-[18vh] mt-[6.5rem]">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
              {/* The emblem shows through whenever the hovered amenity has no photo yet */}
              <div className="absolute inset-0 grid place-items-center">
                <Logo variant="mark" className="w-24 opacity-30" />
              </div>
              {/* Every photo is mounted once and cross-faded, so hovering cannot stack layers */}
              {amenities.map(
                (amenity) =>
                  amenity.image && (
                    <div
                      key={amenity.id}
                      className={
                        "absolute inset-0 transition-opacity duration-500 " +
                        (amenity.id === active?.id ? "opacity-100" : "opacity-0")
                      }
                    >
                      <Image src={amenity.image.src} alt="" fill sizes="40vw" className="object-cover" />
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
