import Image from "next/image";
import Link from "next/link";
import { suiteHref } from "@/lib/i18n/routes";
import { pick } from "@/lib/content/types";
import type { Suite } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { Logo } from "@/components/brand/Logo";

/**
 * Rooms alternate sides down the page rather than sitting in a grid: four
 * rooms in a row of cards reads as a listing, and this is a house.
 */
export function SuitesList({
  dict,
  locale,
  suites,
}: {
  dict: Dictionary;
  locale: Locale;
  suites: Suite[];
}) {
  const copy = dict.suites;

  return (
    <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-32">
      {suites.map((suite, index) => (
        <article
          key={suite.id}
          className="grid items-center gap-8 lg:grid-cols-12 lg:gap-x-16"
        >
          <div
            className={
              "relative aspect-[4/3] overflow-hidden bg-muted lg:col-span-7 lg:aspect-[3/2] " +
              // Every other room takes the other side on wide screens.
              (index % 2 === 1 ? "lg:order-2" : "")
            }
          >
            {suite.image ? (
              <Image
                src={suite.image.src}
                alt={pick(suite.image.alt, locale)}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                quality={85}
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center" aria-hidden="true">
                <Logo variant="mark" className="w-20 opacity-25" />
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <p className="eyebrow text-primary">
              {suite.level === "0" ? copy.levelNames.ground : copy.levelNames.upper}
            </p>
            <h2 className="heading-display mt-3 text-3xl text-foreground sm:text-4xl">
              {pick(suite.name, locale)}
            </h2>
            {suite.areaSqm && (
              <p className="eyebrow mt-3 text-muted-foreground">
                {copy.areaLabel} {suite.areaSqm} m²
              </p>
            )}
            <p className="body-copy mt-5 text-lg">{pick(suite.description, locale)}</p>
            <Link href={suiteHref(suite.slug, locale)} className="btn-quiet mt-6">
              {copy.viewSuite}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
