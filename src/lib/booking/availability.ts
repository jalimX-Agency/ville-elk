/**
 * Which nights are taken. A confirmed stay occupies the nights from its
 * arrival up to, not including, its departure: a new guest may arrive on the
 * morning another leaves. Dates are YYYY-MM-DD strings, which sort as dates.
 */
export type BookedRange = { from: string; to: string };

/** True when the night starting on `date` belongs to a confirmed stay. */
export function isBookedNight(date: string, booked: BookedRange[]): boolean {
  return booked.some((range) => range.from <= date && date < range.to);
}

/** Two stays share a night when each starts before the other ends. */
export function overlapsBooked(arrival: string, departure: string, booked: BookedRange[]): boolean {
  return booked.some((range) => arrival < range.to && range.from < departure);
}

/**
 * The latest departure possible after `arrival`: the first booked night that
 * follows it, or null when nothing is booked afterwards.
 */
export function latestDeparture(arrival: string, booked: BookedRange[]): string | null {
  const next = booked.map((range) => range.from).filter((from) => from > arrival).sort()[0];
  return next ?? null;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
