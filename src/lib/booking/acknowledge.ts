/**
 * The email a guest receives the moment they send a request: it arrived, the
 * team answers soon, and nothing is booked yet. In the language they were
 * reading, and laid out like the booking sheet so the two feel like one house.
 */
import type { EnquiryInput } from "./enquiry";
import { nightsBetween } from "./enquiry";

type Copy = {
  subject: string;
  hello: (name: string) => string;
  thanks: string;
  answer: string;
  recapTitle: string;
  arrival: string;
  departure: string;
  nights: (n: number) => string;
  guests: string;
  notBooked: string;
  urgent: string;
  sign: string;
  intl: string;
};

const COPY: Record<string, Copy> = {
  fr: {
    subject: "Nous avons bien reçu votre demande — Villa Elk",
    hello: (n) => `Bonjour ${n},`,
    thanks: "Merci pour votre demande de séjour à Villa Elk. Nous l'avons bien reçue.",
    answer: "Notre équipe revient vers vous dans les plus brefs délais, avec la disponibilité et le tarif de vos dates.",
    recapTitle: "Votre demande",
    arrival: "Arrivée",
    departure: "Départ",
    nights: (n) => `${n} nuit${n > 1 ? "s" : ""}`,
    guests: "Invités",
    notBooked: "Cette demande ne bloque encore aucune date : la réservation est confirmée par notre équipe.",
    urgent: "Une question urgente ? Écrivez-nous sur WhatsApp :",
    sign: "L'équipe Villa Elk",
    intl: "fr-FR",
  },
  en: {
    subject: "We have received your request — Villa Elk",
    hello: (n) => `Dear ${n},`,
    thanks: "Thank you for your request to stay at Villa Elk. It has reached us.",
    answer: "Our team will get back to you as soon as possible with the availability and the rate for your dates.",
    recapTitle: "Your request",
    arrival: "Arrival",
    departure: "Departure",
    nights: (n) => `${n} night${n > 1 ? "s" : ""}`,
    guests: "Guests",
    notBooked: "This request does not hold any dates yet: your booking is confirmed by our team.",
    urgent: "An urgent question? Message us on WhatsApp:",
    sign: "The Villa Elk team",
    intl: "en-GB",
  },
  es: {
    subject: "Hemos recibido su solicitud — Villa Elk",
    hello: (n) => `Hola ${n}:`,
    thanks: "Gracias por su solicitud de estancia en Villa Elk. La hemos recibido correctamente.",
    answer: "Nuestro equipo le responderá lo antes posible con la disponibilidad y la tarifa de sus fechas.",
    recapTitle: "Su solicitud",
    arrival: "Llegada",
    departure: "Salida",
    nights: (n) => `${n} noche${n > 1 ? "s" : ""}`,
    guests: "Huéspedes",
    notBooked: "Esta solicitud aún no bloquea ninguna fecha: nuestro equipo confirma la reserva.",
    urgent: "¿Una pregunta urgente? Escríbanos por WhatsApp:",
    sign: "El equipo de Villa Elk",
    intl: "es-ES",
  },
  ar: {
    subject: "توصلنا بطلبكم — فيلا إلك",
    hello: (n) => `مرحبًا ${n}،`,
    thanks: "شكرًا على طلب الإقامة في فيلا إلك. لقد توصلنا به.",
    answer: "سيتواصل معكم فريقنا في أقرب وقت ممكن بخصوص توفر التواريخ وسعر إقامتكم.",
    recapTitle: "طلبكم",
    arrival: "الوصول",
    departure: "المغادرة",
    nights: (n) => (n === 1 ? "ليلة واحدة" : n === 2 ? "ليلتان" : n <= 10 ? `${n} ليالٍ` : `${n} ليلة`),
    guests: "عدد الضيوف",
    notBooked: "هذا الطلب لا يحجز أي تاريخ بعد: يتم تأكيد الحجز من طرف فريقنا.",
    urgent: "سؤال مستعجل؟ راسلونا على واتساب:",
    sign: "فريق فيلا إلك",
    intl: "ar-u-nu-latn",
  },
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function acknowledgementEmail(
  enquiry: EnquiryInput,
  locale: string,
  contact: { whatsapp: string; email: string },
): { subject: string; html: string; text: string } {
  const copy = COPY[locale] ?? COPY.fr;
  const rtl = locale === "ar";
  const align = rtl ? "right" : "left";
  const end = rtl ? "left" : "right";
  const first = enquiry.name.trim().split(/\s+/)[0] ?? enquiry.name;
  const date = (d: Date) =>
    d.toLocaleDateString(copy.intl, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const nights = nightsBetween(enquiry.arrival, enquiry.departure);

  const rows: [string, string][] = [
    [copy.arrival, date(enquiry.arrival)],
    [copy.departure, `${date(enquiry.departure)} · ${copy.nights(nights)}`],
    [copy.guests, String(enquiry.guests)],
  ];
  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;border-top:1px solid #e8e0d5;color:#6b5f55;text-align:${align}">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 0;border-top:1px solid #e8e0d5;text-align:${end};font-weight:600;color:#1f1c19">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const wa = `https://wa.me/${contact.whatsapp}`;

  const html =
    `<div dir="${rtl ? "rtl" : "ltr"}" style="background:#f3efe8;padding:24px 12px;font-family:${rtl ? "Tahoma," : ""}Helvetica,Arial,sans-serif;color:#2a2420;font-size:15px;line-height:1.6">` +
    `<div style="max-width:560px;margin:0 auto;background:#fffdf9;border:1px solid #e8e0d5;padding:32px 28px;text-align:${align}">` +
    `<div style="font-family:Georgia,serif;font-size:26px;letter-spacing:.06em;color:#b4684a">VILLA ELK</div>` +
    `<p style="margin:24px 0 8px">${escapeHtml(copy.hello(first))}</p>` +
    `<p style="margin:0 0 8px">${escapeHtml(copy.thanks)}</p>` +
    `<p style="margin:0">${escapeHtml(copy.answer)}</p>` +
    `<div style="margin:24px 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#b4684a">${escapeHtml(copy.recapTitle)}</div>` +
    `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">${table}</table>` +
    `<p style="margin:20px 0 0;padding:12px 14px;background:#f7f1e8;font-size:14px">${escapeHtml(copy.notBooked)}</p>` +
    `<p style="margin:20px 0 0;font-size:14px">${escapeHtml(copy.urgent)} <a href="${wa}" style="color:#b4684a;font-weight:600"><span dir="ltr">+${escapeHtml(contact.whatsapp)}</span></a></p>` +
    `<p style="margin:28px 0 0">${escapeHtml(copy.sign)}</p>` +
    `<div style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e8e0d5;font-size:12px;color:#6b5f55"><span dir="ltr">www.villaelk.com · ${escapeHtml(contact.email)}</span></div>` +
    `</div></div>`;

  const text = [
    copy.hello(first),
    copy.thanks,
    copy.answer,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    copy.notBooked,
    `${copy.urgent} ${wa}`,
    "",
    copy.sign,
  ].join("\n");

  return { subject: copy.subject, html, text };
}
