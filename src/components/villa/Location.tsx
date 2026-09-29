import Link from "next/link";
import { hrefFor } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/**
 * Drive times, set as numbers large enough to read at a glance. A map would
 * need a key or a third-party embed; five destinations need neither.
 */
export function Location({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.location;

  return (
    <section id="emplacement" aria-labelledby="location-title" className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-[5vw] lg:py-28">
        <div className="lg:col-span-5">
          <p className="eyebrow text-primary">{copy.eyebrow}</p>
          <h2
            id="location-title"
            className="heading-display mt-3 max-w-md text-3xl text-foreground sm:text-4xl lg:text-5xl"
          >
            {copy.title}
          </h2>
          <p className="body-copy mt-6 max-w-md text-lg">{copy.intro}</p>
        </div>

        <div className="mt-12 lg:col-span-7 lg:mt-0">
          <ul className="border-t border-border">
            {copy.places.map((place) => (
              <li
                key={place.label}
                className="flex items-baseline gap-5 border-b border-border py-5 lg:gap-8 lg:py-6"
              >
                <span className="flex w-24 shrink-0 items-baseline gap-1.5 lg:w-32">
                  <span className="heading-display text-4xl leading-none text-primary tabular-nums lg:text-5xl">
                    {place.minutes}
                  </span>
                  <span className="eyebrow text-muted-foreground">{copy.unit}</span>
                </span>
                <span className="text-lg text-foreground lg:text-xl">{place.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">{copy.note}</p>
          <Link href={hrefFor("activities", locale)} className="btn-quiet mt-8">
            {dict.activities.homeLink}
            <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
