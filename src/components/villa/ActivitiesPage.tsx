import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Navigation } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { hrefFor } from "@/lib/i18n/routes";
import { ACTIVITY_CATEGORIES, getActivities, type Activity } from "@/lib/content/activities";
import { pick } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/**
 * Everything within ten minutes' drive, told by distance. The page opens on a
 * ruler of minutes from the villa — its one signature — then walks through
 * the places by kind, each with a way to get there.
 */
export async function ActivitiesPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.activities;
  const activities = await getActivities();
  const longest = Math.max(10, ...activities.map((a) => a.minutes));

  // Places sharing a driving time share a stop on the ruler.
  const stops = [...new Set(activities.map((a) => a.minutes))]
    .sort((a, b) => a - b)
    .map((minutes) => ({ minutes, places: activities.filter((a) => a.minutes === minutes) }));

  const sections = ACTIVITY_CATEGORIES.map((category) => ({
    category,
    items: activities.filter((a) => a.category === category),
  })).filter((section) => section.items.length > 0);

  const credits = activities.map((a) => a.image?.credit).filter(Boolean);

  return (
    <article className="pt-20">
      {/* Opening */}
      <header className="mx-auto grid max-w-[1400px] gap-8 px-6 pt-12 lg:grid-cols-12 lg:gap-x-16 lg:px-[5vw] lg:pt-20">
        <div className="lg:col-span-7">
          <p className="eyebrow text-primary">{copy.eyebrow}</p>
          <h1 className="heading-display mt-4 text-[clamp(2.8rem,10vw,6.5rem)] leading-[0.98] text-foreground">
            {copy.title}
          </h1>
        </div>
        <p className="body-copy text-lg lg:col-span-5 lg:self-end">{copy.intro}</p>
      </header>

      {/* The ruler: minutes from the villa */}
      <section aria-labelledby="ruler-title" className="mx-auto max-w-[1400px] px-6 pt-16 lg:px-[5vw] lg:pt-24">
        <h2 id="ruler-title" className="eyebrow text-muted-foreground">
          {copy.timelineTitle}
        </h2>

        {/* Phones: the road runs down the page */}
        <ol className="relative mt-8 space-y-7 border-s border-border ps-8 md:hidden">
          <li className="relative">
            <span className="absolute -start-[2.6rem] top-0 grid h-9 w-9 place-items-center rounded-full border border-border bg-background">
              <Logo variant="mark" className="w-4" />
            </span>
            <p className="heading-display text-xl text-foreground">Villa Elk</p>
          </li>
          {stops.map((stop) => (
            <li key={stop.minutes} className="relative">
              <span className="absolute -start-[2.3rem] top-1.5 h-3 w-3 rotate-45 bg-accent" aria-hidden="true" />
              <p className="font-mono text-xs tracking-[0.2em] text-primary tabular-nums">
                {stop.minutes} {copy.minutes}
              </p>
              <ul className="mt-1 space-y-0.5">
                {stop.places.map((place) => (
                  <li key={place.id}>
                    <a href={`#${place.slug}`} className="inline-flex min-h-9 items-center text-foreground hover:text-primary">
                      {pick(place.name, locale)}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* Wider screens: a ruler across the page */}
        <div className="relative mt-12 hidden md:block" style={{ paddingInline: "2rem" }}>
          <div className="relative h-px bg-border">
            {Array.from({ length: longest + 1 }, (_, minute) => (
              <span
                key={minute}
                className="absolute top-0 -translate-x-1/2 rtl:translate-x-1/2"
                style={{ insetInlineStart: `${(minute / longest) * 100}%` }}
                aria-hidden="true"
              >
                <span className={"block w-px bg-border " + (minute % 5 === 0 ? "h-3" : "h-1.5")} />
                <span className="mt-2 block text-center font-mono text-[0.7rem] text-muted-foreground tabular-nums">{minute}</span>
              </span>
            ))}
            <span
              className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-background rtl:translate-x-1/2"
              style={{ insetInlineStart: 0 }}
            >
              <Logo variant="mark" className="w-6" />
            </span>
          </div>
          <ol className="relative h-44">
            {stops.map((stop, index) => (
              <li
                key={stop.minutes}
                className={"absolute -translate-x-1/2 text-center rtl:translate-x-1/2 " + (index % 2 ? "top-24" : "top-10")}
                style={{ insetInlineStart: `${(stop.minutes / longest) * 100}%` }}
              >
                <span className="mx-auto block h-2.5 w-2.5 rotate-45 bg-accent" aria-hidden="true" />
                <p className="mt-2 font-mono text-xs tracking-[0.2em] text-primary tabular-nums">
                  {stop.minutes} {copy.minutes}
                </p>
                <ul className="mt-1">
                  {stop.places.map((place) => (
                    <li key={place.id} className="whitespace-nowrap">
                      <a href={`#${place.slug}`} className="text-sm text-foreground hover:text-primary">
                        {pick(place.name, locale)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The places, by kind */}
      {sections.map((section, index) => (
        <section
          key={section.category}
          aria-labelledby={`cat-${section.category}`}
          className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-[5vw] lg:pt-28"
        >
          <div className="flex items-baseline gap-4 border-b border-border pb-4">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground tabular-nums">0{index + 1}</span>
            <h2 id={`cat-${section.category}`} className="heading-display text-3xl text-foreground sm:text-4xl">
              {copy.categories[section.category]}
            </h2>
          </div>
          <ul
            className={
              "mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 " + (section.items.length > 2 && section.items.length !== 4 ? "lg:grid-cols-3" : "")
            }
          >
            {section.items.map((activity, i) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                locale={locale}
                copy={copy}
                large={section.items.length <= 2}
                priority={index === 0 && i < 2}
              />
            ))}
          </ul>
        </section>
      ))}

      {/* Handing over to the concierge */}
      <section className="mt-24 bg-onyx text-[#f5efe6] lg:mt-32">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-[5vw] lg:py-20">
          <div className="max-w-2xl">
            <h2 className="heading-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.05]">{copy.conciergeTitle}</h2>
            <p className="mt-4 text-lg text-white/75">{copy.conciergeBody}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href={hrefFor("concierge", locale)} className="btn-primary">
              {copy.conciergeCta}
            </Link>
            <Link href={hrefFor("booking", locale)} className="btn-quiet text-[#f5efe6]">
              {dict.nav.bookNow}
            </Link>
          </div>
        </div>
      </section>

      {credits.length > 0 && (
        <p className="mx-auto max-w-[1400px] px-6 py-6 text-xs text-muted-foreground lg:px-[5vw]">
          {copy.credit} {credits.join(" · ")}
        </p>
      )}
    </article>
  );
}

function ActivityCard({
  activity,
  locale,
  copy,
  large,
  priority,
}: {
  activity: Activity;
  locale: Locale;
  copy: Dictionary["activities"];
  large: boolean;
  priority: boolean;
}) {
  const name = pick(activity.name, locale);
  const description = pick(activity.description, locale);
  return (
    <li id={activity.slug} className="rise group scroll-mt-28">
      <div className={"relative overflow-hidden bg-muted " + (large ? "aspect-[4/3] lg:aspect-[3/2]" : "aspect-[4/3]")}>
        {activity.image && (
          <Image
            src={activity.image.src}
            alt={pick(activity.image.alt, locale)}
            fill
            priority={priority}
            quality={85}
            sizes={large ? "(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        {/* The distance, as the card's headline number */}
        <span className="absolute bottom-0 start-0 flex items-baseline gap-1 bg-background/92 px-4 py-2 backdrop-blur-sm">
          <span className="heading-display text-3xl leading-none text-primary tabular-nums">{activity.minutes}</span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">{copy.minutes}</span>
        </span>
      </div>
      <h3 className={"heading-display mt-5 text-foreground " + (large ? "text-3xl" : "text-2xl")}>{name}</h3>
      {description && <p className="body-copy mt-3 max-w-prose">{description}</p>}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {activity.directionsUrl && (
          <a href={activity.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-quiet">
            <Navigation className="h-4 w-4" />
            {copy.directions}
          </a>
        )}
        {activity.websiteUrl && (
          <a href={activity.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-quiet">
            {copy.website}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </a>
        )}
      </div>
    </li>
  );
}
