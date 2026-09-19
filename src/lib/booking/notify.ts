import "server-only";
import { Resend } from "resend";
import { CONTACT } from "@/lib/contact";
import { nightsBetween, type EnquiryInput } from "./enquiry";

/**
 * The owner reads these on a phone, so the email is plain and the important
 * facts sit in the subject line. Sent from the verified villaelk.com domain
 * with the guest as reply-to, so answering is one tap.
 */
const FROM = "Villa Elk <reservations@villaelk.com>";

/** Where requests land. Overridable so staging never writes to the real inbox. */
function destination(): string {
  return process.env.BOOKING_NOTIFY_EMAIL || CONTACT.email;
}

function day(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export async function notifyOwner(enquiry: EnquiryInput, locale: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const nights = nightsBetween(enquiry.arrival, enquiry.departure);
  const lines: [string, string][] = [
    ["Nom", enquiry.name],
    ["Email", enquiry.email],
    ["Téléphone", enquiry.phone ?? "—"],
    ["Arrivée", day(enquiry.arrival)],
    ["Départ", day(enquiry.departure)],
    ["Nuits", String(nights)],
    ["Invités", String(enquiry.guests)],
    ["Langue du site", locale.toUpperCase()],
  ];

  const table = lines
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b5f55">${label}</td>` +
        `<td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("");

  const message = enquiry.message
    ? `<p style="margin:24px 0 0;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>`
    : "";

  await new Resend(key).emails.send({
    from: FROM,
    to: destination(),
    replyTo: enquiry.email,
    subject: `Demande — ${enquiry.name}, ${day(enquiry.arrival)} → ${day(enquiry.departure)} (${enquiry.guests} invités)`,
    html:
      `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#2a2420">` +
      `<p style="margin:0 0 20px">Nouvelle demande de réservation depuis le site.</p>` +
      `<table style="border-collapse:collapse">${table}</table>` +
      message +
      `<p style="margin:28px 0 0;color:#6b5f55;font-size:13px">` +
      `Répondez directement à cet email pour écrire à ${escapeHtml(enquiry.name)}.</p></div>`,
  });
}
