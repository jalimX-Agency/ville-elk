import "server-only";
import { Resend } from "resend";
import type { EnquiryModel } from "@/generated/prisma/models";
import { getContact, getDictionary } from "@/lib/content/site";
import { buildFiche, ficheEmail, isFicheLocale, type Fiche, type FicheInput, type FicheLocale } from "./fiche";

const FROM = "Villa Elk <reservations@villaelk.com>";
const SITE = (process.env.SITE_URL?.trim() || "https://www.villaelk.com").replace(/\/$/, "");

const iso = (date: Date) => date.toISOString().slice(0, 10);

export function ficheInput(row: EnquiryModel): FicheInput {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    arrival: iso(row.arrival),
    departure: iso(row.departure),
    guests: row.guests,
    priceDh: row.priceDh,
    depositDh: row.depositDh,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    ficheNote: row.ficheNote,
    createdAt: row.createdAt.toISOString(),
  };
}

/** The sheet's language: the one chosen for it, else the guest's, else French. */
export function ficheLocaleOf(row: EnquiryModel, requested?: string | null): FicheLocale {
  if (isFicheLocale(requested)) return requested;
  if (isFicheLocale(row.ficheLocale)) return row.ficheLocale;
  return isFicheLocale(row.locale) ? row.locale : "fr";
}

export async function loadFiche(row: EnquiryModel, locale: FicheLocale): Promise<Fiche> {
  const [contact, dict] = await Promise.all([getContact(), getDictionary(locale)]);
  return buildFiche(ficheInput(row), locale, {
    whatsapp: contact.whatsapp,
    email: contact.email,
    address: dict.contact.address,
    languages: dict.stay.languages,
  });
}

export function ficheLink(token: string, locale: FicheLocale): string {
  return `${SITE}/fiche/${token}?lang=${locale}`;
}

/**
 * Emails the sheet to the guest, in its language, with the owner in copy so
 * the inbox keeps a record. Replies go to the villa's address.
 */
export async function sendFiche(row: EnquiryModel & { ficheToken: string }, locale: FicheLocale): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const fiche = await loadFiche(row, locale);
  const contact = await getContact();
  const { subject, html, text } = ficheEmail(fiche, row.name, ficheLink(row.ficheToken, locale));
  const owner = process.env.BOOKING_NOTIFY_EMAIL || contact.email;

  const { error } = await new Resend(key).emails.send({
    from: FROM,
    to: row.email,
    bcc: owner,
    replyTo: contact.email,
    subject,
    html,
    text,
  });
  if (error) throw new Error(error.message);
}
