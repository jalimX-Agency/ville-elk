import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export function Concept({ dict }: { dict: Dictionary }) {
  return (
    <section id="concept" className="mx-auto max-w-6xl px-6 py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <span className="eyebrow text-primary">{dict.concept.eyebrow}</span>
          <h2 className="heading-display mt-4 text-4xl sm:text-5xl">{dict.concept.title}</h2>
        </div>
        <div>
          <p className="body-copy text-lg">{dict.concept.body}</p>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {dict.concept.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-3xl text-primary sm:text-4xl">{stat.value}</dt>
                <dd className="eyebrow mt-2 text-foreground/60">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
