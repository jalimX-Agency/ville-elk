import Image from "next/image";
import Link from "next/link";
import { Baby, Dumbbell, MessageCircle, Mountain, Plane, Sparkles, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { hrefFor } from "@/lib/i18n/routes";
import { getContact, getSettings } from "@/lib/content/site";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { StayFacts } from "./StayFacts";

// One mark per chapter, in the order the owner wrote them; a chapter added
// from the dictionary without a mark of its own simply goes without.
const MARKS: LucideIcon[] = [Plane, UtensilsCrossed, Mountain, Sparkles, Dumbbell, Baby];

/**
 * The concierge "menu": the owner's own text, set as a sequence of numbered
 * chapters rather than a grid of cards, so it reads like a house's service
 * book and not like a feature list.
 */
export async function ConciergePage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.concierge;
  const [CONTACT, settings] = await Promise.all([getContact(), getSettings()]);
  const pad = (n: number) => String(n).padStart(2, "0");
  const whatsapp = `https://wa.me/${CONTACT.whatsapp}`;

  return (
    <article className="pt-20">
      {/* Opening: the promise beside a photograph of the house */}
      <header className="mx-auto grid max-w-[1400px] gap-10 px-6 pt-12 lg:grid-cols-12 lg:gap-x-16 lg:px-[5vw] lg:pt-20">
        <div className="lg:col-span-6 lg:self-end lg:pb-6">
          <p className="eyebrow text-primary">{copy.eyebrow}</p>
          <h1 className="heading-display mt-4 text-[clamp(2.4rem,8vw,4.5rem)] leading-[1.02] text-foreground">
            {copy.title}
          </h1>
          <div className="mt-8 space-y-5">
            {copy.intro.map((paragraph) => (
              <p key={paragraph} className="body-copy text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-muted lg:col-span-6">
          <Image
            src={settings["image.concierge"]}
            alt={copy.imageAlt}
            fill
            priority
            quality={85}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </header>

      {/* The owner's menu starts with the price of the house itself */}
      <section className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-[5vw] lg:pt-28">
        <div className="grid gap-8 border-y border-border py-10 lg:grid-cols-12 lg:gap-x-16">
          <StayFacts dict={dict} className="lg:col-span-6" />
          <p className="body-copy self-end lg:col-span-6">{dict.stay.languages}</p>
        </div>
      </section>

      {/* The service book */}
      <section aria-label={copy.eyebrow} className="mx-auto max-w-[1400px] px-6 pt-20 lg:px-[5vw] lg:pt-32">
        <ol className="border-t border-border">
          {copy.groups.map((group, index) => {
            const Mark = MARKS[index];
            return (
              <li key={group.title} className="rise grid gap-6 border-b border-border py-10 lg:grid-cols-12 lg:gap-x-16 lg:py-14">
                <div className="flex items-start gap-4 lg:col-span-5">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground tabular-nums">{pad(index + 1)}</span>
                  <div>
                    {Mark && <Mark className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden="true" />}
                    <h2 className="heading-display mt-3 text-2xl text-foreground sm:text-3xl">{group.title}</h2>
                  </div>
                </div>
                <dl className="space-y-8 lg:col-span-7">
                  {group.items.map((item) => (
                    <div key={item.name}>
                      <dt className="text-lg font-medium text-foreground">{item.name}</dt>
                      <dd className="body-copy mt-2">{item.body}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ol>

        <div className="rise mt-14 max-w-2xl lg:ms-[calc(5/12*100%+4rem)]">
          <h2 className="heading-display text-2xl text-foreground sm:text-3xl">{copy.onDemandTitle}</h2>
          <p className="body-copy mt-4 text-lg">{copy.onDemand}</p>
        </div>
      </section>

      {/* How it works, and the ask */}
      <section className="mt-20 bg-onyx text-[#f5efe6] lg:mt-32">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-[5vw] lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-5">
              <h2 className="heading-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.05]">{copy.stepsTitle}</h2>
              <p className="mt-6 text-lg text-white/75">{copy.stepsIntro}</p>
            </div>
            <ol className="lg:col-span-7">
              {copy.steps.map((step, index) => (
                <li key={step} className="flex items-baseline gap-6 border-t border-white/15 py-6">
                  <span className="heading-display text-4xl text-[var(--brass-light)] tabular-nums">{index + 1}</span>
                  <span className="text-xl">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <MessageCircle className="h-4 w-4" />
              {copy.cta}
            </a>
            <Link href={hrefFor("booking", locale)} className="btn-quiet text-[#f5efe6]">
              {dict.nav.bookNow}
            </Link>
          </div>

          <div className="mt-14 max-w-3xl space-y-3 border-t border-white/15 pt-6 text-sm text-white/65">
            <p className="text-white/85">{copy.exclusive}</p>
            <p>{copy.terms}</p>
          </div>
        </div>
      </section>
    </article>
  );
}
