"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Check, Users } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/booking";
import { MAX_GUESTS, MIN_NIGHTS } from "@/lib/booking/enquiry";
import type { BookedRange } from "@/lib/booking/availability";
import { NIGHTLY_RATE_DH } from "@/lib/booking/replies";
import { ficheCopy, isFicheLocale } from "@/lib/booking/fiche";
import { GuestsStepper, StayCalendar } from "./StayPicker";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { Locale } from "@/lib/i18n/locales";
import { hrefFor } from "@/lib/i18n/routes";
import Link from "next/link";

type Values = {
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  guests: string;
  message: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  arrival: "",
  departure: "",
  guests: "2",
  message: "",
};

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-GB", es: "es-ES", ar: "ar-u-nu-latn" };
const DATE_FIELDS = ["arrival", "departure", "guests"];

/**
 * The booking request in two steps. Dates come first, on an open calendar, so
 * availability is answered before anything is asked of the guest; their
 * details follow, with the stay recalled at the top.
 */
export function BookingForm({
  dict,
  locale,
  pageHref,
}: {
  dict: Dictionary;
  locale: Locale;
  /** Where "send another request" goes — this page, with a blank form. */
  pageHref: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const top = useRef<HTMLDivElement>(null);
  const goTo = (next: 1 | 2) => {
    setStep(next);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [state, action, pending] = useActionState<EnquiryState, FormData>(
    async (previous, form) => {
      const result = await submitEnquiry(previous, form);
      // A problem with the dates (taken in the meantime, say) is fixed on step 1.
      if (result.status === "error" && DATE_FIELDS.includes(result.field ?? "")) goTo(1);
      return result;
    },
    { status: "idle" },
  );
  // Controlled throughout: React resets an uncontrolled form once the action
  // settles, which would empty every field each time a single one is wrong.
  const [values, setValues] = useState<Values>(EMPTY);
  const id = useId();
  const copy = dict.reserve;
  const wizard = copy.wizard;

  const set = <K extends keyof Values>(field: K) =>
    (value: string) =>
      setValues((current) => ({ ...current, [field]: value }));

  // Confirmed nights, so the calendar can strike them out. The server checks
  // every request anyway; this only saves the guest a refused form.
  const [booked, setBooked] = useState<BookedRange[]>([]);
  useEffect(() => {
    let live = true;
    fetch("/api/availability")
      .then((response) => response.json() as Promise<{ booked?: BookedRange[] }>)
      .then((data) => live && setBooked(data.booked ?? []))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [state]);

  const errorFor = (field: string) =>
    state.status === "error" && state.field === field ? state.message : undefined;

  if (state.status === "sent") {
    return (
      <div className="border border-border bg-card p-8">
        <p className="eyebrow text-primary">{copy.eyebrow}</p>
        <h2 className="heading-display mt-3 text-2xl text-foreground sm:text-3xl">
          {copy.success.title}
        </h2>
        <p className="body-copy mt-4 max-w-prose">{copy.success.body}</p>
        <a href={pageHref} className="btn-quiet mt-6">
          {copy.success.again}
        </a>
      </div>
    );
  }

  const day = (value: string) =>
    new Date(`${value}T00:00:00Z`).toLocaleDateString(INTL[locale], {
      weekday: "short",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  const nights =
    values.arrival && values.departure
      ? Math.round((Date.parse(values.departure) - Date.parse(values.arrival)) / 86_400_000)
      : 0;
  const money = ficheCopy(isFicheLocale(locale) ? locale : "fr").money;
  const datesError = errorFor("arrival") ?? errorFor("departure");
  const steps = [wizard.datesTitle, wizard.detailsTitle];

  return (
    <form action={action} noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="arrival" value={values.arrival} />
      <input type="hidden" name="departure" value={values.departure} />

      {/* Where the guest is: two numbered steps and a hairline that fills */}
      <div ref={top} className="scroll-mt-28">
        <ol className="grid grid-cols-2 gap-4">
          {steps.map((title, index) => {
            const n = (index + 1) as 1 | 2;
            const done = n < step;
            const current = n === step;
            return (
              <li key={title} aria-current={current ? "step" : undefined}>
                <button
                  type="button"
                  disabled={n === 2 && !nights}
                  onClick={() => goTo(n)}
                  className="block min-h-11 w-full text-start disabled:cursor-default"
                >
                  <span className={"block h-px " + (current || done ? "bg-primary" : "bg-border")} />
                  <span className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {done ? <Check className="h-3.5 w-3.5 text-primary" /> : `0${n}`}
                    <span>
                      {wizard.step} {n}
                    </span>
                  </span>
                  <span className={"mt-1 block text-lg " + (current ? "text-foreground" : "text-muted-foreground")}>
                    {title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Step 1 — kept mounted when hidden, so the calendar keeps its month */}
      <div hidden={step !== 1} className="mt-8 space-y-6">
        <StayCalendar
          locale={locale}
          labels={{ ...copy.form, minStay: dict.stay.minStay }}
          booked={booked}
          minNights={MIN_NIGHTS}
          arrival={values.arrival}
          departure={values.departure}
          onChange={(arrival, departure) => setValues((current) => ({ ...current, arrival, departure }))}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          {(["arrival", "departure"] as const).map((which) => (
            <div key={which}>
              <p className="field-label">{copy.form[which]}</p>
              <p
                className={
                  "mt-2 flex min-h-[2.85rem] items-center border-b border-border " +
                  (values[which] ? "text-foreground" : "text-muted-foreground")
                }
              >
                {values[which] ? day(values[which]) : "—"}
              </p>
            </div>
          ))}
          <GuestsStepper
            label={copy.form.guests}
            value={Number(values.guests)}
            onChange={(count) => set("guests")(String(count))}
            max={MAX_GUESTS}
            fewer={copy.form.fewer}
            more={copy.form.more}
            error={errorFor("guests")}
          />
        </div>

        {datesError && (
          <p role="alert" className="text-sm text-primary">
            {datesError}
          </p>
        )}

        {nights > 0 && !datesError && (
          <div
            aria-live="polite"
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-s-2 border-accent bg-card px-4 py-3"
          >
            <p className="flex items-center gap-2 text-foreground">
              <Check className="h-4 w-4 text-primary" /> {wizard.available}
            </p>
            <p className="text-sm text-muted-foreground">
              {wizard.estimate} <span className="font-medium text-foreground">{money(nights * NIGHTLY_RATE_DH)}</span>
              {" · "}
              {nights} {copy.form.nights}
              <span className="block text-xs sm:text-sm">{wizard.estimateNote}</span>
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground">{dict.stay.minStay}</p>

        <button type="button" disabled={!nights} onClick={() => goTo(2)} className="btn-primary">
          {wizard.continue}
        </button>
      </div>

      {/* Step 2 — the stay recalled at the top, then the guest's details */}
      <div hidden={step !== 2} className="mt-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border border-border bg-card p-5">
          <div>
            <p className="eyebrow text-muted-foreground">{wizard.summary}</p>
            {nights > 0 && (
              <>
                <p className="mt-2 text-lg text-foreground">
                  {day(values.arrival)} → {day(values.departure)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nights} {copy.form.nights} ·{" "}
                  <Users className="inline h-3.5 w-3.5 align-[-2px]" aria-label={copy.form.guests} /> {values.guests} ·{" "}
                  {wizard.estimate} {money(nights * NIGHTLY_RATE_DH)}
                </p>
              </>
            )}
          </div>
          <button type="button" onClick={() => goTo(1)} className="btn-quiet">
            {wizard.edit}
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id={`${id}-name`}
            name="name"
            label={copy.form.name}
            autoComplete="name"
            required
            value={values.name}
            onChange={set("name")}
            error={errorFor("name")}
          />
          <Field
            id={`${id}-email`}
            name="email"
            type="email"
            label={copy.form.email}
            autoComplete="email"
            required
            value={values.email}
            onChange={set("email")}
            error={errorFor("email")}
          />
        </div>

        <Field
          id={`${id}-phone`}
          name="phone"
          type="tel"
          label={copy.form.phone}
          hint={copy.form.phoneHint}
          autoComplete="tel"
          value={values.phone}
          onChange={set("phone")}
          error={errorFor("phone")}
        />

        <label htmlFor={`${id}-message`} className="block">
          <span className="field-label">{copy.form.message}</span>
          <span className="mt-1 block text-sm text-muted-foreground">{copy.form.messageHint}</span>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            maxLength={2000}
            value={values.message}
            onChange={(event) => set("message")(event.target.value)}
            className="field-input mt-2 resize-y"
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? copy.form.submitting : copy.form.submit}
          </button>
          {state.status === "error" && state.field === "form" && (
            <p role="alert" className="text-sm text-primary">
              {state.message}
            </p>
          )}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {copy.form.consent}{" "}
          <Link href={hrefFor("privacy", locale)} className="underline decoration-accent underline-offset-4 hover:text-primary">
            {copy.form.consentLink}
          </Link>
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  hint,
  type = "text",
  required,
  error,
  value,
  onChange,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  type?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="field-label">{label}</span>
      {hint && <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        className="field-input mt-2"
        {...rest}
      />
      {error && (
        <span role="alert" className="mt-1.5 block text-sm text-primary">
          {error}
        </span>
      )}
    </label>
  );
}
