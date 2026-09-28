"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { MAX_GUESTS } from "@/lib/booking/enquiry";
import { isLocale } from "@/lib/i18n/locales";
import { requireUser } from "./guard";

/**
 * The booking requests' own actions: notes, deletion, and stays the owner
 * arranged outside the site. Status changes live with the other list actions
 * in actions.ts.
 */

function refresh() {
  revalidatePath("/admin/demandes");
  revalidatePath("/admin", "layout");
}

export async function saveEnquiryNotes(id: string, notes: string): Promise<{ saved: boolean }> {
  await requireUser();
  await db.enquiry.update({ where: { id }, data: { notes: notes.slice(0, 5000) } });
  refresh();
  return { saved: true };
}

/** For spam and tests. A real request that falls through is "Annulée" instead. */
export async function deleteEnquiry(id: string) {
  await requireUser();
  await db.enquiry.deleteMany({ where: { id } });
  refresh();
}

export type ManualState = { error?: string; field?: string; created?: string };

function day(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))) : null;
}

/**
 * A stay arranged by phone or WhatsApp, so the calendar and the overlap
 * warnings know about it. Unlike the public form, past dates are allowed (the
 * owner may be catching up) and the email is optional.
 */
export async function createManualBooking(_state: ManualState, formData: FormData): Promise<ManualState> {
  await requireUser();
  const text = (field: string) => String(formData.get(field) ?? "").trim();

  const name = text("name");
  if (name.length < 2) return { error: "Indiquez le nom du client.", field: "name" };

  const email = text("email").toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: "Cette adresse email n'est pas valide.", field: "email" };
  }

  const arrival = day(text("arrival"));
  if (!arrival) return { error: "Choisissez la date d'arrivée.", field: "arrival" };
  const departure = day(text("departure"));
  if (!departure) return { error: "Choisissez la date de départ.", field: "departure" };
  if (departure <= arrival) return { error: "Le départ doit suivre l'arrivée.", field: "departure" };

  const guests = Number(text("guests"));
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    return { error: `Entre 1 et ${MAX_GUESTS} invités.`, field: "guests" };
  }

  const rawLocale = text("locale");
  const status = text("status") === "CONTACTED" ? "CONTACTED" : "CONFIRMED";

  const created = await db.enquiry.create({
    data: {
      name: name.slice(0, 120),
      email: email.slice(0, 160),
      phone: text("phone").slice(0, 40) || null,
      locale: isLocale(rawLocale) ? rawLocale : "fr",
      message: null,
      arrival,
      departure,
      guests,
      status,
      statusChangedAt: new Date(),
      source: "manual",
      notes: text("notes").slice(0, 5000),
      // Nothing to email: the owner is the one who wrote it.
      notifiedAt: new Date(),
    },
    select: { id: true },
  });

  refresh();
  return { created: created.id };
}
