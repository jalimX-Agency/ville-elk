import "server-only";
import { db } from "@/lib/db/client";
import type { BookedRange } from "./availability";

const iso = (date: Date) => date.toISOString().slice(0, 10);

/** Confirmed stays from today on — dates only, nothing about the guests. */
export async function bookedRanges(): Promise<BookedRange[]> {
  const today = new Date(`${iso(new Date())}T00:00:00Z`);
  const rows = await db.enquiry.findMany({
    where: { status: "CONFIRMED", departure: { gt: today } },
    select: { arrival: true, departure: true },
    orderBy: { arrival: "asc" },
  });
  return rows.map((row) => ({ from: iso(row.arrival), to: iso(row.departure) }));
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
