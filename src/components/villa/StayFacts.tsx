import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/**
 * The rate, the tourist tax and the minimum stay, said the same way on the
 * booking page and in the concierge menu. The minimum stay is the owner's
 * "phrase importante", so it is never the smallest line.
 */
export function StayFacts({
  dict,
  className = "",
}: {
  dict: Dictionary;
  className?: string;
}) {
  const stay = dict.stay;

  return (
    <div className={className}>
      <h2 className="eyebrow text-muted-foreground">{stay.eyebrow}</h2>
      <p className="mt-5 text-sm text-muted-foreground">{stay.from}</p>
      <p className="heading-display mt-1 text-[clamp(2.4rem,7vw,3.25rem)] leading-none text-primary">
        {stay.price}
        <span className="ms-2 text-xl text-foreground">{stay.per}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{stay.approx}</p>

      <p className="mt-6 border-s-2 border-accent ps-4 body-copy text-foreground">{stay.minStay}</p>

      <dl className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border pt-4 text-sm">
        <dt className="text-muted-foreground">{stay.taxLabel}</dt>
        <dd className="text-foreground">
          {stay.tax} <span className="text-muted-foreground">· {stay.taxApprox}</span>
        </dd>
      </dl>
    </div>
  );
}
