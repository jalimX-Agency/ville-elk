import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/**
 * The rate, the tourist tax and the minimum stay, said the same way wherever
 * they appear. The minimum stay is the owner's "phrase importante", so it is
 * never the smallest line.
 */
export function StayFacts({
  dict,
  compact = false,
  className = "",
}: {
  dict: Dictionary;
  /** One tight block, for the phone menu and the foot of the home page. */
  compact?: boolean;
  className?: string;
}) {
  const stay = dict.stay;

  if (compact) {
    return (
      <div className={"text-center " + className}>
        <p className="eyebrow text-muted-foreground">{stay.from}</p>
        <p className="mt-1 heading-display text-3xl text-foreground">
          {stay.price} <span className="text-lg text-muted-foreground">{stay.per}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{stay.approx}</p>
        <p className="mt-3 text-sm text-foreground/80">{stay.minStay}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="text-foreground/80">{stay.taxLabel}</span>
          <br />
          {stay.tax} · {stay.taxApprox}
        </p>
      </div>
    );
  }

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
