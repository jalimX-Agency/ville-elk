/**
 * The owner's replies to a booking request, drafted in the guest's language so
 * a WhatsApp or an email opens ready to send — the owner can still edit it
 * before it leaves. Pure functions: the dashboard runs them in the browser.
 */

/** The base rate and the tourist tax, as the site states them. */
export const NIGHTLY_RATE_DH = 3700;
export const TOURIST_TAX_DH = 31;

export type ReplyKind = "thanks" | "available" | "unavailable";

export type ReplyInput = {
  name: string;
  locale: string;
  arrival: string; // YYYY-MM-DD
  departure: string;
  guests: number;
};

export function nightsOf(arrival: string, departure: string): number {
  return Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000);
}

export function estimate({ arrival, departure, guests }: Pick<ReplyInput, "arrival" | "departure" | "guests">) {
  const nights = nightsOf(arrival, departure);
  const stay = nights * NIGHTLY_RATE_DH;
  const tax = nights * guests * TOURIST_TAX_DH;
  return { nights, stay, tax, total: stay + tax };
}

const INTL: Record<string, string> = { fr: "fr-FR", en: "en-GB", es: "es-ES", ar: "ar-MA-u-nu-latn" };

function date(value: string, locale: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(INTL[locale] ?? "fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function money(value: number, locale: string) {
  return value.toLocaleString(INTL[locale] ?? "fr-FR");
}

type Parts = { a: string; d: string; n: number; g: number; name: string; stay: string; tax: string };

const TEXT: Record<string, {
  subject: (p: Parts) => string;
  hello: (p: Parts) => string;
  thanks: (p: Parts) => string;
  available: (p: Parts) => string;
  unavailable: string;
  bye: string;
}> = {
  fr: {
    subject: (p) => `Votre séjour à Villa Elk du ${p.a} au ${p.d}`,
    hello: (p) => `Bonjour ${p.name},`,
    thanks: (p) => `Merci pour votre demande de séjour à Villa Elk du ${p.a} au ${p.d} (${p.n} nuits, ${p.g} personnes).`,
    available: (p) => `Bonne nouvelle : la villa est disponible à ces dates. Le tarif de votre séjour est de ${p.stay} DH, auxquels s'ajoute la taxe de séjour (${p.tax} DH). Souhaitez-vous que nous bloquions ces dates pour vous ?`,
    unavailable: "Malheureusement, la villa n'est pas disponible à ces dates. Seriez-vous flexible ? Nous serions ravis de vous proposer une autre période.",
    bye: "Bien cordialement,\nL'équipe Villa Elk",
  },
  en: {
    subject: (p) => `Your stay at Villa Elk, ${p.a} to ${p.d}`,
    hello: (p) => `Dear ${p.name},`,
    thanks: (p) => `Thank you for your request to stay at Villa Elk from ${p.a} to ${p.d} (${p.n} nights, ${p.g} guests).`,
    available: (p) => `Good news: the villa is available on these dates. The rate for your stay is MAD ${p.stay}, plus the tourist tax (MAD ${p.tax}). Would you like us to hold these dates for you?`,
    unavailable: "Unfortunately, the villa is not available on these dates. Are your dates flexible? We would be delighted to suggest another period.",
    bye: "Kind regards,\nThe Villa Elk team",
  },
  es: {
    subject: (p) => `Su estancia en Villa Elk del ${p.a} al ${p.d}`,
    hello: (p) => `Hola ${p.name}:`,
    thanks: (p) => `Gracias por su solicitud de estancia en Villa Elk del ${p.a} al ${p.d} (${p.n} noches, ${p.g} personas).`,
    available: (p) => `Buenas noticias: la villa está disponible en esas fechas. La tarifa de su estancia es de ${p.stay} DH, más la tasa turística (${p.tax} DH). ¿Desea que le reservemos estas fechas?`,
    unavailable: "Lamentablemente, la villa no está disponible en esas fechas. ¿Tiene flexibilidad? Estaremos encantados de proponerle otro periodo.",
    bye: "Un cordial saludo,\nEl equipo de Villa Elk",
  },
  ar: {
    subject: (p) => `إقامتكم في فيلا إلك من ${p.a} إلى ${p.d}`,
    hello: (p) => `مرحبًا ${p.name}،`,
    thanks: (p) => `شكرًا على طلب الإقامة في فيلا إلك من ${p.a} إلى ${p.d} (${p.n} ليالٍ، ${p.g} أشخاص).`,
    available: (p) => `خبر سار: الفيلا متاحة في هذه التواريخ. سعر إقامتكم ${p.stay} درهم، تضاف إليه ضريبة الإقامة (${p.tax} درهم). هل تريدون أن نحجز لكم هذه التواريخ؟`,
    unavailable: "للأسف، الفيلا غير متاحة في هذه التواريخ. هل يمكنكم تغيير التواريخ؟ يسعدنا أن نقترح عليكم فترة أخرى.",
    bye: "مع أطيب التحيات،\nفريق فيلا إلك",
  },
};

export function draftReply(kind: ReplyKind, input: ReplyInput): { subject: string; body: string } {
  const text = TEXT[input.locale] ?? TEXT.fr;
  const { nights, stay, tax } = estimate(input);
  const parts: Parts = {
    a: date(input.arrival, input.locale),
    d: date(input.departure, input.locale),
    n: nights,
    g: input.guests,
    // First name only: "Bonjour Sara" rather than "Bonjour Sara Bennani".
    name: input.name.trim().split(/\s+/)[0] ?? "",
    stay: money(stay, input.locale),
    tax: money(tax, input.locale),
  };
  const middle = kind === "available" ? text.available(parts) : kind === "unavailable" ? text.unavailable : "";
  const body = [text.hello(parts), text.thanks(parts), middle, text.bye].filter(Boolean).join("\n\n");
  return { subject: text.subject(parts), body };
}
