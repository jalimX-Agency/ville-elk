import "server-only";
import { db } from "@/lib/db/client";
import type { BookedRange } from "./availability";

const iso = (date: Date) => date.toISOString().slice(0, 10);
const startOfToday = () => new Date(`${iso(new Date())}T00:00:00Z`);

/**
 * Nights nobody can ask for, from today on: confirmed stays and the periods
 * the owner closed. Dates only — neither the guests nor the reasons leave
 * the server.
 */
export async function bookedRanges(): Promise<BookedRange[]> {
  const today = startOfToday();
  const [stays, closures] = await Promise.all([
    db.enquiry.findMany({
      where: { status: "CONFIRMED", departure: { gt: today } },
      select: { arrival: true, departure: true },
    }),
    db.closure.findMany({ where: { endDate: { gt: today } }, select: { startDate: true, endDate: true } }),
  ]);
  return [
    ...stays.map((row) => ({ from: iso(row.arrival), to: iso(row.departure) })),
    ...closures.map((row) => ({ from: iso(row.startDate), to: iso(row.endDate) })),
  ].sort((a, b) => a.from.localeCompare(b.from));
}

/** A confirmed stay sharing a night with these dates, other than `exceptId`. */
export async function confirmedOverlap(arrival: Date, departure: Date, exceptId?: string) {
  return db.enquiry.findFirst({
    where: {
      status: "CONFIRMED",
      arrival: { lt: departure },
      departure: { gt: arrival },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    select: { id: true, name: true, arrival: true, departure: true },
  });
}

/** A closed period sharing a night with these dates. */
export async function closureOverlap(arrival: Date, departure: Date, exceptId?: string) {
  return db.closure.findFirst({
    where: {
      startDate: { lt: departure },
      endDate: { gt: arrival },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
  });
}

/** True when any night of these dates is taken, by a stay or a closure. */
export async function isUnavailable(arrival: Date, departure: Date, exceptEnquiryId?: string): Promise<boolean> {
  const [stay, closure] = await Promise.all([
    confirmedOverlap(arrival, departure, exceptEnquiryId),
    closureOverlap(arrival, departure),
  ]);
  return Boolean(stay || closure);
}
