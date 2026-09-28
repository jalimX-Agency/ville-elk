"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/booking";
import { MAX_GUESTS, MIN_NIGHTS } from "@/lib/booking/enquiry";
import type { BookedRange } from "@/lib/booking/availability";
import { GuestsStepper, StayPicker } from "./StayPicker";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { Locale } from "@/lib/i18n/locales";

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
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, {
    status: "idle",
  });
  // Controlled throughout: React resets an uncontrolled form once the action
  // settles, which would empty every field each time a single one is wrong.
  const [values, setValues] = useState<Values>(EMPTY);
  const id = useId();
  const copy = dict.reserve;

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

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="locale" value={locale} />

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

      <div className="grid gap-5 sm:grid-cols-3">
        <StayPicker
          locale={locale}
          labels={{ ...copy.form, minStay: dict.stay.minStay }}
          booked={booked}
          minNights={MIN_NIGHTS}
          arrival={values.arrival}
          departure={values.departure}
          onChange={(arrival, departure) => setValues((current) => ({ ...current, arrival, departure }))}
          errors={{ arrival: errorFor("arrival"), departure: errorFor("departure") }}
        />
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
  min?: string;
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
