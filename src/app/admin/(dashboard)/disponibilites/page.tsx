import { db } from "@/lib/db/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { AvailabilityBoard } from "@/components/admin/AvailabilityBoard";

const iso = (date: Date) => date.toISOString().slice(0, 10);

/** Stays from two months back, so the calendar is not empty when looking back. */
function twoMonthsAgo() {
  return new Date(Date.now() - 62 * 86_400_000);
}

export default async function AvailabilityPage() {
  const since = twoMonthsAgo();
  const [closures, enquiries] = await Promise.all([
    db.closure.findMany({ orderBy: { startDate: "asc" } }),
    db.enquiry.findMany({
      where: { status: { not: "CANCELLED" }, departure: { gt: since } },
      orderBy: { arrival: "asc" },
      select: { id: true, name: true, arrival: true, departure: true, guests: true, status: true },
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Disponibilités"
        description="Fermez la villa sur une période — réservation faite ailleurs, travaux, séjour du propriétaire. Ces dates apparaissent réservées sur le site et ne peuvent plus être demandées."
      />
      <AvailabilityBoard
        closures={closures.map((c) => ({ id: c.id, start: iso(c.startDate), end: iso(c.endDate), reason: c.reason, note: c.note }))}
        stays={enquiries.map((e) => ({
          id: e.id,
          name: e.name,
          arrival: iso(e.arrival),
          departure: iso(e.departure),
          guests: e.guests,
          confirmed: e.status === "CONFIRMED",
        }))}
      />
    </>
  );
}
