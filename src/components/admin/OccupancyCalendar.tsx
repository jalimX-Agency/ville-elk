"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarEntry = {
  id: string;
  /** First night, YYYY-MM-DD. */
  from: string;
  /** The morning it ends: nights run up to, not including, this day. */
  to: string;
  kind: "confirmed" | "pending" | "closed";
  title: string;
  subtitle: string;
  pill: { label: string; className: string };
  /** Where tapping it leads; without one, `onOpen` is called. */
  href?: string;
};

const WEEKDAYS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];
const todayISO = () => new Date().toISOString().slice(0, 10);

// Closed nights read as struck off: dark, with a fine diagonal hatch.
const CLOSED_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.14) 0 2px, transparent 2px 7px)",
};

/**
 * One month of nights. A night belongs to a stay or a closure from its first
 * day up to, not including, its last morning — the way a hotel counts.
 */
export function OccupancyCalendar({
  entries,
  onOpen,
  onPickDay,
}: {
  entries: CalendarEntry[];
  onOpen?: (entry: CalendarEntry) => void;
  /** Offered on a free night, e.g. to start closing the villa from there. */
  onPickDay?: { label: string; action: (date: string) => void };
}) {
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)));
  const [selected, setSelected] = useState<string | null>(null);

  const year = month.getUTCFullYear();
  const m = month.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
  const lead = (month.getUTCDay() + 6) % 7; // Monday first
  const iso = (d: number) => new Date(Date.UTC(year, m, d)).toISOString().slice(0, 10);
  const on = (date: string) => entries.filter((e) => e.from <= date && date < e.to);
  const today = todayISO();
  const long = (value: string) =>
    new Date(`${value}T00:00:00Z`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const shift = (by: number) => {
    setMonth(new Date(Date.UTC(year, m + by, 1)));
    setSelected(null);
  };
  const selectedEntries = selected ? on(selected) : [];

  return (
    <section className="admin-card max-w-3xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => shift(-1)} aria-label="Mois précédent" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold capitalize">
          {month.toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" })}
        </h2>
        <button type="button" onClick={() => shift(1)} aria-label="Mois suivant" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, index) => {
          if (d === null) return <span key={`lead-${index}`} />;
          const date = iso(d);
          const here = on(date);
          const closed = here.some((e) => e.kind === "closed");
          const confirmed = here.some((e) => e.kind === "confirmed");
          const pending = here.some((e) => e.kind === "pending");
          const clash = here.length > 1;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelected(date === selected ? null : date)}
              aria-pressed={date === selected}
              aria-label={`${d} — ${here.length ? here.map((e) => e.title).join(", ") : "libre"}`}
              style={closed ? CLOSED_STYLE : undefined}
              className={
                "relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-lg text-sm tabular-nums transition-colors " +
                (closed
                  ? "bg-[var(--onyx)] font-semibold text-white"
                  : confirmed
                    ? "bg-[var(--terracotta)] font-semibold text-white"
                    : pending
                      ? "bg-[#f6e8cf] font-medium text-[#74500f]"
                      : date < today
                        ? "text-muted-foreground/50 hover:bg-muted"
                        : "hover:bg-muted") +
                (date === selected ? " ring-2 ring-[var(--onyx)] ring-offset-1" : "") +
                (date === today ? " underline decoration-2 underline-offset-4" : "")
              }
            >
              {d}
              {clash && <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-[#c0532f] ring-1 ring-white" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[var(--terracotta)]" /> Confirmé</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#f6e8cf]" /> En attente</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[var(--onyx)]" style={CLOSED_STYLE} /> Fermé</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#c0532f]" /> Plusieurs sur la même nuit</span>
      </div>

      {selected && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="font-medium first-letter:uppercase">{long(selected)}</p>
          {selectedEntries.length === 0 ? (
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">Nuit libre.</p>
              {onPickDay && selected >= today && (
                <button type="button" onClick={() => onPickDay.action(selected)} className="admin-button-quiet">
                  {onPickDay.label}
                </button>
              )}
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedEntries.map((entry) => {
                const body = (
                  <>
                    <span>
                      <span className="block font-medium">{entry.title}</span>
                      <span className="block text-sm text-muted-foreground">{entry.subtitle}</span>
                    </span>
                    <span className={`admin-pill ${entry.pill.className}`}>{entry.pill.label}</span>
                  </>
                );
                const className = "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-start hover:bg-muted";
                return (
                  <li key={entry.id}>
                    {entry.href ? (
                      <Link href={entry.href} className={className}>
                        {body}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => onOpen?.(entry)} className={className}>
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
