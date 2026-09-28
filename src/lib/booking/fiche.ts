/**
 * The booking sheet ("fiche de réservation"): one set of facts, laid out as
 * labelled rows in the guest's language, so the page, the print and the email
 * say exactly the same thing.
 */
import { TOURIST_TAX_DH, nightsOf } from "./replies";

export const FICHE_LOCALES = ["fr", "en", "es", "ar"] as const;
export type FicheLocale = (typeof FICHE_LOCALES)[number];
export const isFicheLocale = (value: string | null | undefined): value is FicheLocale =>
  !!value && (FICHE_LOCALES as readonly string[]).includes(value);

export type FicheInput = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  arrival: string; // YYYY-MM-DD
  departure: string;
  guests: number;
  priceDh: number | null;
  depositDh: number | null;
  checkInTime: string;
  checkOutTime: string;
  ficheNote: string;
  createdAt: string; // ISO
};

export type FicheContact = { whatsapp: string; email: string; address: string; languages: string };

type Copy = {
  title: string;
  confirmed: string;
  reference: string;
  issued: string;
  guest: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  stay: string;
  arrival: string;
  departure: string;
  from: (time: string) => string;
  before: (time: string) => string;
  length: string;
  nights: (n: number) => string;
  rate: string;
  rental: (n: number) => string;
  tax: (g: number, n: number) => string;
  total: string;
  deposit: string;
  balance: string;
  toConfirm: string;
  conditionsTitle: string;
  conditions: string[];
  noteTitle: string;
  address: string;
  contact: string;
  thanks: string;
  print: string;
  mail: {
    subject: (ref: string) => string;
    hello: (name: string) => string;
    intro: string;
    button: string;
    sign: string;
  };
  money: (value: number) => string;
  intl: string;
};

const group = (value: number, intl: string) => value.toLocaleString(intl);

const COPY: Record<FicheLocale, Copy> = {
  fr: {
    title: "Fiche de réservation",
    confirmed: "Réservation confirmée",
    reference: "Référence",
    issued: "Émise le",
    guest: "Client",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    guests: "Invités",
    stay: "Séjour",
    arrival: "Arrivée",
    departure: "Départ",
    from: (t) => `à partir de ${t}`,
    before: (t) => `avant ${t}`,
    length: "Durée",
    nights: (n) => `${n} nuit${n > 1 ? "s" : ""}`,
    rate: "Tarif",
    rental: (n) => `Location de la villa (${n} nuit${n > 1 ? "s" : ""})`,
    tax: (g, n) => `Taxe de séjour (${TOURIST_TAX_DH} DH × ${g} pers. × ${n} nuits)`,
    total: "Total",
    deposit: "Acompte versé",
    balance: "Reste à régler à l'arrivée",
    toConfirm: "à confirmer",
    conditionsTitle: "Conditions",
    conditions: [
      "La villa entière, pour votre groupe uniquement.",
      "Jusqu'à 10 invités.",
      "Le solde est à régler à l'arrivée.",
      "Annulation possible jusqu'à 48 heures avant l'arrivée.",
    ],
    noteTitle: "Message de l'équipe",
    address: "Adresse",
    contact: "Contact",
    thanks: "Merci de votre confiance. À très bientôt à Villa Elk.",
    print: "Imprimer ou enregistrer en PDF",
    mail: {
      subject: (ref) => `Votre réservation à Villa Elk est confirmée — ${ref}`,
      hello: (name) => `Bonjour ${name},`,
      intro: "Nous avons le plaisir de vous confirmer votre séjour à Villa Elk. Vous trouverez ci-dessous votre fiche de réservation.",
      button: "Voir et imprimer la fiche",
      sign: "L'équipe Villa Elk",
    },
    money: (v) => `${group(v, "fr-FR")} DH`,
    intl: "fr-FR",
  },
  en: {
    title: "Booking confirmation",
    confirmed: "Confirmed booking",
    reference: "Reference",
    issued: "Issued on",
    guest: "Guest",
    name: "Name",
    email: "Email",
    phone: "Phone",
    guests: "Guests",
    stay: "Stay",
    arrival: "Arrival",
    departure: "Departure",
    from: (t) => `from ${t}`,
    before: (t) => `before ${t}`,
    length: "Length",
    nights: (n) => `${n} night${n > 1 ? "s" : ""}`,
    rate: "Rate",
    rental: (n) => `Villa rental (${n} night${n > 1 ? "s" : ""})`,
    tax: (g, n) => `Tourist tax (MAD ${TOURIST_TAX_DH} × ${g} guests × ${n} nights)`,
    total: "Total",
    deposit: "Deposit paid",
    balance: "Balance due on arrival",
    toConfirm: "to be confirmed",
    conditionsTitle: "Conditions",
    conditions: [
      "The whole villa, for your group only.",
      "Up to 10 guests.",
      "The balance is payable on arrival.",
      "Cancellation possible up to 48 hours before arrival.",
    ],
    noteTitle: "A note from our team",
    address: "Address",
    contact: "Contact",
    thanks: "Thank you for your trust. We look forward to welcoming you to Villa Elk.",
    print: "Print or save as PDF",
    mail: {
      subject: (ref) => `Your stay at Villa Elk is confirmed — ${ref}`,
      hello: (name) => `Dear ${name},`,
      intro: "We are delighted to confirm your stay at Villa Elk. Please find your booking confirmation below.",
      button: "View and print",
      sign: "The Villa Elk team",
    },
    money: (v) => `MAD ${group(v, "en-GB")}`,
    intl: "en-GB",
  },
  es: {
    title: "Ficha de reserva",
    confirmed: "Reserva confirmada",
    reference: "Referencia",
    issued: "Emitida el",
    guest: "Cliente",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    guests: "Huéspedes",
    stay: "Estancia",
    arrival: "Llegada",
    departure: "Salida",
    from: (t) => `a partir de las ${t}`,
    before: (t) => `antes de las ${t}`,
    length: "Duración",
    nights: (n) => `${n} noche${n > 1 ? "s" : ""}`,
    rate: "Tarifa",
    rental: (n) => `Alquiler de la villa (${n} noche${n > 1 ? "s" : ""})`,
    tax: (g, n) => `Tasa turística (${TOURIST_TAX_DH} DH × ${g} pers. × ${n} noches)`,
    total: "Total",
    deposit: "Anticipo pagado",
    balance: "Saldo a pagar a la llegada",
    toConfirm: "por confirmar",
    conditionsTitle: "Condiciones",
    conditions: [
      "La villa entera, solo para su grupo.",
      "Hasta 10 huéspedes.",
      "El saldo se paga a la llegada.",
      "Cancelación posible hasta 48 horas antes de la llegada.",
    ],
    noteTitle: "Mensaje del equipo",
    address: "Dirección",
    contact: "Contacto",
    thanks: "Gracias por su confianza. Le esperamos en Villa Elk.",
    print: "Imprimir o guardar en PDF",
    mail: {
      subject: (ref) => `Su reserva en Villa Elk está confirmada — ${ref}`,
      hello: (name) => `Hola ${name}:`,
      intro: "Tenemos el placer de confirmar su estancia en Villa Elk. A continuación encontrará su ficha de reserva.",
      button: "Ver e imprimir la ficha",
      sign: "El equipo de Villa Elk",
    },
    money: (v) => `${group(v, "es-ES")} DH`,
    intl: "es-ES",
  },
  ar: {
    title: "بطاقة الحجز",
    confirmed: "حجز مؤكد",
    reference: "المرجع",
    issued: "تاريخ الإصدار",
    guest: "الضيف",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    guests: "عدد الضيوف",
    stay: "الإقامة",
    arrival: "الوصول",
    departure: "المغادرة",
    from: (t) => `ابتداءً من الساعة ${t}`,
    before: (t) => `قبل الساعة ${t}`,
    length: "المدة",
    nights: (n) => (n === 1 ? "ليلة واحدة" : n === 2 ? "ليلتان" : n <= 10 ? `${n} ليالٍ` : `${n} ليلة`),
    rate: "السعر",
    rental: (n) => `كراء الفيلا (${n === 1 ? "ليلة واحدة" : n === 2 ? "ليلتان" : n <= 10 ? `${n} ليالٍ` : `${n} ليلة`})`,
    tax: (g, n) => `ضريبة الإقامة (${TOURIST_TAX_DH} درهمًا × ${g} أشخاص × ${n} ليالٍ)`,
    total: "المجموع",
    deposit: "العربون المدفوع",
    balance: "المبلغ المتبقي عند الوصول",
    toConfirm: "سيُحدَّد لاحقًا",
    conditionsTitle: "الشروط",
    conditions: [
      "الفيلا كاملة لمجموعتكم وحدها.",
      "حتى 10 ضيوف.",
      "يُدفع المبلغ المتبقي عند الوصول.",
      "يمكن الإلغاء حتى 48 ساعة قبل الوصول.",
    ],
    noteTitle: "رسالة من فريقنا",
    address: "العنوان",
    contact: "التواصل",
    thanks: "شكرًا على ثقتكم. نتطلع إلى استقبالكم في فيلا إلك.",
    print: "طباعة أو حفظ بصيغة PDF",
    mail: {
      subject: (ref) => `تم تأكيد حجزكم في فيلا إلك — ${ref}`,
      hello: (name) => `مرحبًا ${name}،`,
      intro: "يسعدنا تأكيد إقامتكم في فيلا إلك. تجدون أدناه بطاقة الحجز الخاصة بكم.",
      button: "عرض البطاقة وطباعتها",
      sign: "فريق فيلا إلك",
    },
    money: (v) => `${group(v, "ar-u-nu-latn")} درهم`,
    intl: "ar-u-nu-latn",
  },
};

export function ficheCopy(locale: FicheLocale): Copy {
  return COPY[locale];
}

/** A short, readable reference: VE + arrival date + four characters of the id. */
export function ficheReference(input: Pick<FicheInput, "id" | "arrival">): string {
  return `VE-${input.arrival.replace(/-/g, "").slice(2)}-${input.id.slice(-4).toUpperCase()}`;
}

/** `ltr` marks values that must read left to right even on the Arabic sheet (phone, email). */
export type FicheSection = { title: string; rows: { label: string; value: string; strong?: boolean; ltr?: boolean }[] };

export type Fiche = {
  locale: FicheLocale;
  dir: "ltr" | "rtl";
  copy: Copy;
  reference: string;
  issued: string;
  sections: FicheSection[];
  note: string;
  contact: FicheContact;
};

/** The sheet's facts, worded and formatted for one language. */
export function buildFiche(input: FicheInput, locale: FicheLocale, contact: FicheContact): Fiche {
  const copy = COPY[locale];
  const date = (value: string) =>
    new Date(`${value}T00:00:00Z`).toLocaleDateString(copy.intl, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  const nights = nightsOf(input.arrival, input.departure);
  const tax = nights * input.guests * TOURIST_TAX_DH;

  const rate: FicheSection["rows"] = [];
  if (input.priceDh !== null) {
    const total = input.priceDh + tax;
    rate.push(
      { label: copy.rental(nights), value: copy.money(input.priceDh) },
      { label: copy.tax(input.guests, nights), value: copy.money(tax) },
      { label: copy.total, value: copy.money(total), strong: true },
    );
    if (input.depositDh) {
      rate.push(
        { label: copy.deposit, value: copy.money(input.depositDh) },
        { label: copy.balance, value: copy.money(Math.max(0, total - input.depositDh)), strong: true },
      );
    }
  } else {
    rate.push({ label: copy.rental(nights), value: copy.toConfirm });
  }

  return {
    locale,
    dir: locale === "ar" ? "rtl" : "ltr",
    copy,
    reference: ficheReference(input),
    issued: new Date().toLocaleDateString(copy.intl, { day: "numeric", month: "long", year: "numeric" }),
    sections: [
      {
        title: copy.stay,
        rows: [
          { label: copy.arrival, value: `${date(input.arrival)} · ${copy.from(input.checkInTime)}`, strong: true },
          { label: copy.departure, value: `${date(input.departure)} · ${copy.before(input.checkOutTime)}`, strong: true },
          { label: copy.length, value: copy.nights(nights) },
          { label: copy.guests, value: String(input.guests) },
        ],
      },
      {
        title: copy.guest,
        rows: [
          { label: copy.name, value: input.name },
          ...(input.email ? [{ label: copy.email, value: input.email, ltr: true }] : []),
          ...(input.phone ? [{ label: copy.phone, value: input.phone, ltr: true }] : []),
        ],
      },
      { title: copy.rate, rows: rate },
    ],
    note: input.ficheNote.trim(),
    contact,
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/**
 * The confirmation email: the same sheet as tables with inline styles, since
 * that is all mail programs reliably render, and a link to the printable page.
 */
export function ficheEmail(fiche: Fiche, guestName: string, link: string): { subject: string; html: string; text: string } {
  const { copy, dir } = fiche;
  const align = dir === "rtl" ? "right" : "left";
  const end = dir === "rtl" ? "left" : "right";
  const first = guestName.trim().split(/\s+/)[0] ?? guestName;

  const sections = fiche.sections
    .map(
      (section) =>
        `<tr><td colspan="2" style="padding:22px 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#b4684a;text-align:${align}">${escapeHtml(section.title)}</td></tr>` +
        section.rows
          .map(
            (row) =>
              `<tr><td style="padding:7px 0;border-top:1px solid #e8e0d5;color:#6b5f55;text-align:${align}">${escapeHtml(row.label)}</td>` +
              `<td style="padding:7px 0;border-top:1px solid #e8e0d5;text-align:${end};${row.strong ? "font-weight:600;color:#1f1c19" : ""}">${row.ltr ? `<span dir="ltr" style="unicode-bidi:isolate">${escapeHtml(row.value)}</span>` : escapeHtml(row.value)}</td></tr>`,
          )
          .join(""),
    )
    .join("");

  const note = fiche.note
    ? `<div style="margin:24px 0 0;padding:14px 16px;background:#f7f1e8;border-${dir === "rtl" ? "right" : "left"}:3px solid #c2a05e;text-align:${align}"><div style="font-size:12px;color:#6b5f55;margin-bottom:4px">${escapeHtml(copy.noteTitle)}</div><div style="white-space:pre-wrap">${escapeHtml(fiche.note)}</div></div>`
    : "";

  const conditions = copy.conditions.map((line) => `<li style="margin:4px 0">${escapeHtml(line)}</li>`).join("");

  const html =
    `<div dir="${dir}" style="background:#f3efe8;padding:24px 12px;font-family:${dir === "rtl" ? "Tahoma," : ""}Helvetica,Arial,sans-serif;color:#2a2420;font-size:15px;line-height:1.55">` +
    `<div style="max-width:560px;margin:0 auto;background:#fffdf9;border:1px solid #e8e0d5;padding:32px 28px;text-align:${align}">` +
    `<div style="font-family:Georgia,serif;font-size:26px;letter-spacing:.06em;color:#b4684a">VILLA ELK</div>` +
    `<p style="margin:24px 0 8px">${escapeHtml(copy.mail.hello(first))}</p>` +
    `<p style="margin:0 0 8px">${escapeHtml(copy.mail.intro)}</p>` +
    `<div style="margin:24px 0 0;padding:16px 0 0;border-top:2px solid #1f1c19">` +
    `<div style="font-family:Georgia,serif;font-size:22px">${escapeHtml(copy.title)}</div>` +
    `<div style="color:#6b5f55;font-size:13px;margin-top:4px">${escapeHtml(copy.reference)} <strong style="color:#1f1c19">${escapeHtml(fiche.reference)}</strong> · ${escapeHtml(copy.confirmed)}</div>` +
    `</div>` +
    `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">${sections}</table>` +
    note +
    `<div style="margin:24px 0 0;font-size:13px;color:#6b5f55"><strong style="color:#1f1c19">${escapeHtml(copy.conditionsTitle)}</strong><ul style="margin:6px 0 0;padding-${dir === "rtl" ? "right" : "left"}:18px">${conditions}</ul></div>` +
    `<p style="margin:28px 0 0"><a href="${escapeHtml(link)}" style="display:inline-block;background:#b4684a;color:#fff;text-decoration:none;padding:12px 20px;font-weight:600">${escapeHtml(copy.mail.button)}</a></p>` +
    `<p style="margin:28px 0 0">${escapeHtml(copy.thanks)}<br>${escapeHtml(copy.mail.sign)}</p>` +
    `<div style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e8e0d5;font-size:12px;color:#6b5f55">` +
    `${escapeHtml(fiche.contact.address).replace(/\n/g, "<br>")}<br><span dir="ltr" style="unicode-bidi:isolate">WhatsApp +${escapeHtml(fiche.contact.whatsapp)} · ${escapeHtml(fiche.contact.email)}</span><br>${escapeHtml(fiche.contact.languages)}` +
    `</div></div></div>`;

  const text = [
    copy.mail.hello(first),
    copy.mail.intro,
    `${copy.title} — ${copy.reference} ${fiche.reference}`,
    ...fiche.sections.flatMap((s) => [`\n${s.title}`, ...s.rows.map((r) => `${r.label}: ${r.value}`)]),
    fiche.note ? `\n${copy.noteTitle}: ${fiche.note}` : "",
    `\n${copy.conditionsTitle}`,
    ...copy.conditions.map((c) => `- ${c}`),
    `\n${copy.mail.button}: ${link}`,
    `\n${copy.thanks}\n${copy.mail.sign}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: copy.mail.subject(fiche.reference), html, text };
}
