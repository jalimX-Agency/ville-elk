import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export const MAX_GUESTS = 10;
/** The owner's rule: three nights at least, "afin de garantir une expérience privilégiée". */
export const MIN_NIGHTS = 3;

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  arrival: Date;
  departure: Date;
  guests: number;
};

/** The field that failed, so the form can point at it. */
export type EnquiryError = { field: keyof EnquiryInput | "form"; message: string };

/** Dates arrive as YYYY-MM-DD from a date input; read them as calendar days, not instants. */
function parseDay(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

function today(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function nightsBetween(arrival: Date, departure: Date): number {
  return Math.round((departure.getTime() - arrival.getTime()) / 86_400_000);
}

/**
 * Validated on the server whatever the browser did, and with the visitor's own
 * dictionary so the message comes back in the language they are reading.
 */
export function readEnquiry(
  form: FormData,
  dict: Dictionary,
): { ok: true; value: EnquiryInput } | { ok: false; error: EnquiryError } {
  const errors = dict.reserve.errors;
  const text = (field: string) => String(form.get(field) ?? "").trim();

  const name = text("name");
  if (name.length < 2) return { ok: false, error: { field: "name", message: errors.name } };

  const email = text("email");
  // Deliberately loose: the address is checked by mail reaching it, not by a regex.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: { field: "email", message: errors.email } };
  }

  const arrival = parseDay(text("arrival"));
  if (!arrival) return { ok: false, error: { field: "arrival", message: errors.arrival } };

  const departure = parseDay(text("departure"));
  if (!departure) return { ok: false, error: { field: "departure", message: errors.departure } };

  if (arrival < today()) {
    return { ok: false, error: { field: "arrival", message: errors.past } };
  }
  if (departure <= arrival) {
    return { ok: false, error: { field: "departure", message: errors.order } };
  }
  if (nightsBetween(arrival, departure) < MIN_NIGHTS) {
    return { ok: false, error: { field: "departure", message: errors.minStay } };
  }

  const guests = Number(text("guests"));
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    return { ok: false, error: { field: "guests", message: errors.guests } };
  }

  return {
    ok: true,
    value: {
      name: name.slice(0, 120),
      email: email.slice(0, 160).toLowerCase(),
      phone: text("phone").slice(0, 40) || null,
      message: text("message").slice(0, 2000) || null,
      arrival,
      departure,
      guests,
    },
  };
}
