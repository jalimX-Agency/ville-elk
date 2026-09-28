"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { CalendarOff, Trash2 } from "lucide-react";
import { createClosure, deleteClosure, type ClosureState } from "@/app/admin/closure-actions";
import { CLOSURE_REASONS, type ClosureReason } from "@/lib/booking/closures";
import { OccupancyCalendar, type CalendarEntry } from "./OccupancyCalendar";
import type { ClosureRow } from "./EnquiriesBoard";

export type StayRow = { id: string; name: string; arrival: string; departure: string; guests: number; confirmed: boolean };

const todayISO = () => new Date().toISOString().slice(0, 10);
const lastNight = (end: string) => new Date(Date.parse(end) - 86_400_000).toISOString().slice(0, 10);
const nightsOf = (start: string, end: string) => Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000);
const day = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The villa's calendar as the owner runs it: stays, requests and closures on
 * one month, and closing a period takes two dates and a reason.
 */
export function AvailabilityBoard({ closures, stays }: { closures: ClosureRow[]; stays: StayRow[] }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState<ClosureReason>("reservation");
  const [note, setNote] = useState("");
  const [state, action, pending] = useActionState<ClosureState, FormData>(async (previous, data) => {
    const result = await createClosure(previous, data);
    // A closure made: the form empties for the next one.
    if (result.created) {
      setStart("");
      setEnd("");
      setNote("");
    }
    return result;
  }, {});
  const [, startSubmit] = useTransition();
  const form = useRef<HTMLFormElement>(null);
  const today = todayISO();

  const entries: CalendarEntry[] = [
    ...stays.map(
      (s): CalendarEntry => ({
        id: s.id,
        from: s.arrival,
        to: s.departure,
        kind: s.confirmed ? "confirmed" : "pending",
        title: s.name,
        subtitle: `${day(s.arrival)} → ${day(s.departure)} · ${s.guests} invités`,
        pill: s.confirmed ? { label: "Confirmée", className: "admin-pill-live" } : { label: "Demande", className: "admin-pill-new" },
        href: "/admin/demandes",
      }),
    ),
    ...closures.map(
      (c): CalendarEntry => ({
        id: c.id,
        from: c.start,
        to: c.end,
        kind: "closed",
        title: CLOSURE_REASONS[c.reason as ClosureReason] ?? "Fermeture",
        subtitle: `${day(c.start)} → ${day(lastNight(c.end))} inclus${c.note ? ` · ${c.note}` : ""}`,
        pill: { label: "Fermé", className: "admin-pill-off" },
      }),
    ),
  ];

  const upcoming = closures.filter((c) => c.end > today);
  const past = closures.filter((c) => c.end <= today).reverse();
  const err = (field: string) =>
    state.field === field ? (
      <span role="alert" className="mt-1.5 block text-sm text-[#8f3d22]">
        {state.error}
      </span>
    ) : null;
  const nights = start && end && end >= start ? nightsOf(start, end) + 1 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="min-w-0">
        <OccupancyCalendar
          entries={entries}
          onOpen={() => document.getElementById("fermetures")?.scrollIntoView({ behavior: "smooth" })}
          onPickDay={{
            label: "Fermer à partir de ce jour",
            action: (date) => {
              setStart(date);
              if (end && end < date) setEnd("");
              form.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              form.current?.querySelector<HTMLInputElement>('input[name="end"]')?.focus();
            },
          }}
        />
      </div>

      <div className="space-y-6">
        <form
          ref={form}
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            startSubmit(() => action(data));
          }}
          className="admin-card scroll-mt-20 space-y-4 p-4 sm:p-5"
        >
          <h2 className="flex items-center gap-2 font-semibold">
            <CalendarOff className="h-4 w-4 text-[var(--terracotta)]" /> Fermer la villa
          </h2>
          <p className="text-sm text-muted-foreground">
            Sur le site, ces dates apparaissent réservées et personne ne peut les demander. La raison n&apos;est visible que par vous.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="field-label">Du</span>
              <input
                name="start"
                type="date"
                min={today}
                value={start}
                onChange={(event) => setStart(event.target.value)}
                required
                className="field-input mt-1.5"
              />
            </label>
            <label className="block">
              <span className="field-label">Au (inclus)</span>
              <input
                name="end"
                type="date"
                min={start || today}
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                required
                className="field-input mt-1.5"
              />
            </label>
          </div>
          {err("start")}
          {err("end")}
          {nights > 0 && (
            <p className="text-sm text-muted-foreground">
              {nights} nuit{nights > 1 ? "s" : ""} fermée{nights > 1 ? "s" : ""} — réouverture le {day(new Date(Date.parse(end) + 86_400_000).toISOString().slice(0, 10))}.
            </p>
          )}
          <label className="block">
            <span className="field-label">Raison</span>
            <select
              name="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value as ClosureReason)}
              className="field-input mt-1.5 h-11"
            >
              {Object.entries(CLOSURE_REASONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Note (facultatif)</span>
            <input
              name="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ex. : réservé via Airbnb, peinture de la piscine…"
              className="field-input mt-1.5"
            />
          </label>
          {state.error && !state.field && (
            <p role="alert" className="text-sm text-[#8f3d22]">
              {state.error}
            </p>
          )}
          <button type="submit" disabled={pending} className="admin-button w-full">
            {pending ? "Enregistrement…" : "Fermer ces dates"}
          </button>
          {state.created && !pending && <p className="text-sm text-[#2d5a3a]">Dates fermées. Elles apparaissent réservées sur le site.</p>}
        </form>

        <section id="fermetures" className="admin-card scroll-mt-20">
          <h2 className="border-b border-border px-4 py-3 font-semibold sm:px-5">
            Fermetures à venir <span className="font-normal text-muted-foreground">· {upcoming.length}</span>
          </h2>
          {upcoming.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground sm:px-5">Aucune fermeture prévue : la villa est ouverte aux demandes.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((c) => (
                <ClosureItem key={c.id} closure={c} />
              ))}
            </ul>
          )}
          {past.length > 0 && (
            <details className="border-t border-border">
              <summary className="flex min-h-11 cursor-pointer items-center px-4 text-sm text-muted-foreground sm:px-5">
                Fermetures passées ({past.length})
              </summary>
              <ul className="divide-y divide-border opacity-70">
                {past.map((c) => (
                  <ClosureItem key={c.id} closure={c} />
                ))}
              </ul>
            </details>
          )}
        </section>
      </div>
    </div>
  );
}

function ClosureItem({ closure: c }: { closure: ClosureRow }) {
  const [confirming, setConfirming] = useState(false);
  const [working, start] = useTransition();
  const n = nightsOf(c.start, c.end);
  return (
    <li className="px-4 py-3 sm:px-5">
      <p className="font-medium">{CLOSURE_REASONS[c.reason as ClosureReason] ?? "Fermeture"}</p>
      <p className="text-sm text-muted-foreground">
        {day(c.start)} → {day(lastNight(c.end))} inclus · {n} nuit{n > 1 ? "s" : ""}
      </p>
      {c.note && <p className="mt-1 text-sm">{c.note}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {confirming ? (
          <>
            <span className="text-sm">Rouvrir ces dates ?</span>
            <button
              type="button"
              disabled={working}
              onClick={() => start(() => deleteClosure(c.id))}
              className="admin-button bg-[#8f3d22]"
            >
              Oui, rouvrir
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="admin-button-quiet">
              Non
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="admin-button-quiet text-[#8f3d22]">
            <Trash2 className="h-4 w-4" /> Rouvrir
          </button>
        )}
      </div>
    </li>
  );
}
