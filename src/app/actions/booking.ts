"use server";

import { db } from "@/lib/db/client";
import { getDictionary } from "@/lib/content/site";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/locales";
import { readEnquiry } from "@/lib/booking/enquiry";
import { acknowledgeGuest, notifyOwner } from "@/lib/booking/notify";
import { confirmedOverlap } from "@/lib/booking/availability-server";

export type EnquiryState = {
  status: "idle" | "sent" | "error";
  field?: string;
  message?: string;
};

/**
 * Public and unauthenticated by design. The enquiry is stored first and the
 * email sent after: if Resend is down the request is still in the dashboard,
 * which is the copy that matters.
 */
export async function submitEnquiry(
  _state: EnquiryState,
  form: FormData,
): Promise<EnquiryState> {
  const raw = String(form.get("locale") ?? "");
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  const parsed = readEnquiry(form, dict);
  if (!parsed.ok) {
    return { status: "error", field: parsed.error.field, message: parsed.error.message };
  }

  // Nights already confirmed for someone else cannot be asked for again.
  try {
    if (await confirmedOverlap(parsed.value.arrival, parsed.value.departure)) {
      return { status: "error", field: "arrival", message: dict.reserve.errors.unavailable };
    }
  } catch (error) {
    // If the check itself fails the request still goes through: the owner sees
    // the clash in the dashboard, which beats losing a guest.
    console.error("Could not check availability", error);
  }

  let id: string;
  try {
    const created = await db.enquiry.create({
      data: { ...parsed.value, locale },
      select: { id: true },
    });
    id = created.id;
  } catch (error) {
    console.error("Could not store the enquiry", error);
    return { status: "error", field: "form", message: dict.reserve.errors.generic };
  }

  // The two emails are independent: one failing must not stop the other.
  const [owner, guest] = await Promise.allSettled([
    notifyOwner(parsed.value, locale).then(() =>
      db.enquiry.update({ where: { id }, data: { notifiedAt: new Date() } }),
    ),
    acknowledgeGuest(parsed.value, locale),
  ]);
  // The visitor did their part and the request is saved; the dashboard shows
  // it as un-notified so nobody has to guess whether the owner's email went out.
  if (owner.status === "rejected") console.error("Could not email the enquiry", owner.reason);
  if (guest.status === "rejected") console.error("Could not acknowledge the enquiry to the guest", guest.reason);

  return { status: "sent" };
}
