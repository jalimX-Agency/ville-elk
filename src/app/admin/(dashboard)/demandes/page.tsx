import { db } from "@/lib/db/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { EnquiriesBoard, type EnquiryRow } from "@/components/admin/EnquiriesBoard";

const iso = (date: Date) => date.toISOString().slice(0, 10);

export default async function EnquiriesPage() {
  const [rows, closureRows] = await Promise.all([
    db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 1000 }),
    db.closure.findMany({ orderBy: { startDate: "asc" } }),
  ]);
  const closures = closureRows.map((c) => ({
    id: c.id,
    start: iso(c.startDate),
    end: iso(c.endDate),
    reason: c.reason,
    note: c.note,
  }));

  const enquiries: EnquiryRow[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    locale: row.locale,
    message: row.message,
    arrival: iso(row.arrival),
    departure: iso(row.departure),
    guests: row.guests,
    status: row.status,
    source: row.source,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    statusChangedAt: row.statusChangedAt?.toISOString() ?? null,
    notified: row.notifiedAt !== null,
    priceDh: row.priceDh,
    depositDh: row.depositDh,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    ficheNote: row.ficheNote,
    ficheLocale: row.ficheLocale,
    ficheSentAt: row.ficheSentAt?.toISOString() ?? null,
    ficheToken: row.ficheToken,
  }));

  return (
    <>
      <PageHeader
        title="Demandes de réservation"
        description="Chaque demande arrive aussi par email. Rien n'est réservé tant que vous ne l'avez pas confirmée. Touchez une demande pour la traiter."
      />
      <EnquiriesBoard enquiries={enquiries} closures={closures} />
    </>
  );
}
