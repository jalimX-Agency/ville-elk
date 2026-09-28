"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, isBookedNight, latestDeparture, type BookedRange } from "@/lib/booking/availability";
import type { Locale } from "@/lib/i18n/locales";

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-GB", es: "es-ES", ar: "ar-u-nu-latn" };

export type StayLabels = {
  arrival: string;
  departure: string;
  nights: string;
  booked: string;
  pickArrival: string;
  pickDeparture: string;
  clear: string;
  done: string;
  previousMonth: string;
  nextMonth: string;
  datePlaceholder: string;
  minStay: string;
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthStart = (date: string) => `${date.slice(0, 7)}-01`;
const shiftMonth = (month: string, by: number) => {
  const d = new Date(`${month}T00:00:00Z`);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + by, 1)).toISOString().slice(0, 10);
};

/**
 * Arrival and departure in one calendar, in the villa's own style rather than
 * the browser's date box: nights already confirmed are struck through and
 * cannot be chosen, and the minimum stay is built into what can be picked.
 */
export function StayPicker({
  locale,
  labels,
  booked,
  minNights,
  arrival,
  departure,
  onChange,
  errors,
}: {
  locale: Locale;
  labels: StayLabels;
  booked: BookedRange[];
  minNights: number;
  arrival: string;
  departure: string;
  onChange: (arrival: string, departure: string) => void;
  errors: { arrival?: string; departure?: string };
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => monthStart(arrival || todayISO()));
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const rtl = locale === "ar";
  const intl = INTL[locale];
  const today = todayISO();

  // Close on a tap outside or on Escape, like any other menu.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choosingDeparture = Boolean(arrival) && !departure;
  const limit = arrival ? latestDeparture(arrival, booked) : null;
  const nights = arrival && departure ? Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000) : 0;

  /** A night one can arrive on: free, not past, with the minimum stay free after it. */
  const canArrive = (date: string) => {
    if (date < today || isBookedNight(date, booked)) return false;
    const next = latestDeparture(date, booked);
    return !next || next >= addDays(date, minNights);
  };
  const canDepart = (date: string) =>
    Boolean(arrival) && date >= addDays(arrival, minNights) && (!limit || date <= limit);

  function pick(date: string) {
    if (choosingDeparture && date > arrival) {
      if (canDepart(date)) {
        onChange(arrival, date);
        setOpen(false);
      }
      return;
    }
    if (canArrive(date)) onChange(date, "");
  }

  const display = (date: string) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString(intl, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    // 5 January 2026 was a Monday: the week starts there.
    // Arabic has no short weekday names, so its one-letter forms are used.
    new Date(Date.UTC(2026, 0, 5 + i)).toLocaleDateString(intl, { weekday: rtl ? "narrow" : "short", timeZone: "UTC" }),
  );

  // A plain function rather than a component: it closes over this render's state.
  function renderMonth(start: string) {
    const d = new Date(`${start}T00:00:00Z`);
    const year = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const days = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    const lead = (d.getUTCDay() + 6) % 7;
    return (
      <div>
        <p className="mb-3 text-center font-medium capitalize text-foreground">
          {d.toLocaleDateString(intl, { month: "long", year: "numeric", timeZone: "UTC" })}
        </p>
        <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
          {weekdays.map((w) => (
            <span key={w} className="pb-2">
              {w}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: lead }, (_, i) => (
            <span key={`lead-${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const date = new Date(Date.UTC(year, m, i + 1)).toISOString().slice(0, 10);
            const taken = isBookedNight(date, booked);
            const past = date < today;
            const isStart = date === arrival;
            const isEnd = date === departure;
            const inside = arrival && departure && date > arrival && date < departure;
            const selectable = choosingDeparture && date > arrival ? canDepart(date) : canArrive(date);
            const state = taken ? ` — ${labels.booked}` : "";
            return (
              <button
                key={date}
                type="button"
                disabled={!selectable && !isStart}
                onClick={() => pick(date)}
                aria-pressed={isStart || isEnd || undefined}
                aria-label={`${new Date(`${date}T00:00:00Z`).toLocaleDateString(intl, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })}${state}`}
                className={
                  "relative flex h-11 flex-col items-center justify-center text-sm tabular-nums transition-colors " +
                  (isStart || isEnd
                    ? "z-10 bg-primary font-semibold text-primary-foreground"
                    : inside
                      ? "bg-primary/12 text-foreground"
                      : taken
                        ? "cursor-not-allowed text-muted-foreground/70 line-through decoration-primary/70"
                        : past || !selectable
                          ? "cursor-not-allowed text-muted-foreground/40"
                          : "text-foreground hover:bg-muted")
                }
              >
                {i + 1}
                {taken && !isStart && !isEnd && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary/70" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;
  const canGoBack = month > monthStart(today);

  return (
    <div ref={root} className="relative sm:col-span-2">
      <div className="grid grid-cols-2 gap-3">
        {(["arrival", "departure"] as const).map((which) => {
          const value = which === "arrival" ? arrival : departure;
          const error = errors[which];
          return (
            <div key={which}>
              <span id={`${id}-${which}`} className="field-label">
                {labels[which]}
              </span>
              <button
                type="button"
                aria-labelledby={`${id}-${which}`}
                aria-expanded={open}
                aria-describedby={error ? `${id}-${which}-error` : undefined}
                onClick={() => {
                  if (which === "arrival" && departure) onChange(arrival, "");
                  setMonth(monthStart(value || arrival || today));
                  setOpen(true);
                }}
                className={
                  "field-input mt-2 flex min-h-[2.85rem] items-center gap-2 text-start " +
                  (open && ((which === "arrival" && !choosingDeparture) || (which === "departure" && choosingDeparture))
                    ? "border-[var(--ring)] outline outline-2 outline-offset-1 outline-[var(--ring)]"
                    : "")
                }
              >
                <CalendarDays className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span className={value ? "truncate" : "truncate text-muted-foreground"}>
                  {value ? display(value) : labels.datePlaceholder}
                </span>
              </button>
              {error && (
                <span id={`${id}-${which}-error`} role="alert" className="mt-1.5 block text-sm text-primary">
                  {error}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <input type="hidden" name="arrival" value={arrival} />
      <input type="hidden" name="departure" value={departure} />

      {open && (
        <div
          role="dialog"
          aria-label={choosingDeparture ? labels.pickDeparture : labels.pickArrival}
          // Full width of the fields on phones; on a desk wide enough for two months side by side.
          className="absolute inset-x-0 top-full z-30 mt-2 border border-border bg-card p-4 shadow-xl sm:p-5 lg:end-auto lg:w-[40rem]"
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMonth(shiftMonth(month, -1))}
              disabled={!canGoBack}
              aria-label={labels.previousMonth}
              className="grid h-11 w-11 place-items-center hover:bg-muted disabled:opacity-30"
            >
              <Prev className="h-5 w-5" />
            </button>
            <p aria-live="polite" className="text-center text-sm font-medium text-primary">
              {choosingDeparture ? labels.pickDeparture : arrival && departure ? `${nights} ${labels.nights}` : labels.pickArrival}
            </p>
            <button
              type="button"
              onClick={() => setMonth(shiftMonth(month, 1))}
              aria-label={labels.nextMonth}
              className="grid h-11 w-11 place-items-center hover:bg-muted"
            >
              <Next className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 grid gap-8 lg:grid-cols-2">
            {renderMonth(month)}
            <div className="hidden lg:block">
              {renderMonth(shiftMonth(month, 1))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="text-foreground/60 line-through decoration-primary">12</span> {labels.booked}
            </span>
            <span>{labels.minStay}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onChange("", "")}
              className="min-h-11 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {labels.clear}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-primary">
              {labels.done}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** The number of guests with − and + rather than a drop-down list. */
export function GuestsStepper({
  label,
  value,
  onChange,
  max,
  fewer,
  more,
  error,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  fewer: string;
  more: string;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <span id={id} className="field-label">
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="field-input mt-2 flex items-center justify-between p-0">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          aria-label={fewer}
          className="grid h-11 w-12 place-items-center text-xl leading-none text-foreground hover:bg-muted disabled:opacity-30"
        >
          −
        </button>
        <output aria-live="polite" className="text-lg font-medium tabular-nums text-foreground">
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={more}
          className="grid h-11 w-12 place-items-center text-xl leading-none text-foreground hover:bg-muted disabled:opacity-30"
        >
          +
        </button>
      </div>
      <input type="hidden" name="guests" value={value} />
      {error && (
        <span role="alert" className="mt-1.5 block text-sm text-primary">
          {error}
        </span>
      )}
    </div>
  );
}
