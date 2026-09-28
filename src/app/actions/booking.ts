"use server";

import { db } from "@/lib/db/client";
import { getDictionary } from "@/lib/content/site";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/locales";
import { readEnquiry } from "@/lib/booking/enquiry";
import { notifyOwner } from "@/lib/booking/notify";

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

  try {
    await notifyOwner(parsed.value, locale);
    await db.enquiry.update({ where: { id }, data: { notifiedAt: new Date() } });
  } catch (error) {
    // The visitor did their part and the request is saved; the dashboard shows
    // it as un-notified so nobody has to guess whether the email went out.
    console.error("Could not email the enquiry", error);
  }

  return { status: "sent" };
}
