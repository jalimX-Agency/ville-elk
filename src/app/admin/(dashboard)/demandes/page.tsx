import { db } from "@/lib/db/client";
import { setEnquiryStatus } from "@/app/admin/actions";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  CONTACTED: "Répondu",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
};

/** What the owner can move a request to from where it is now. */
const NEXT_STATUSES: Record<string, string[]> = {
  NEW: ["CONTACTED", "CANCELLED"],
  CONTACTED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: ["NEW"],
};

function day(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function nights(arrival: Date, departure: Date): number {
  return Math.round((departure.getTime() - arrival.getTime()) / 86_400_000);
}

export default async function EnquiriesPage() {
  const enquiries = await db.enquiry.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <>
      <h1 className="text-2xl font-light">Demandes de réservation</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Chaque demande arrive aussi par email. Rien n&apos;est réservé tant que
        vous n&apos;avez pas répondu.
      </p>

      {enquiries.length === 0 ? (
        <p className="mt-10 border border-dashed border-border p-8 text-center text-muted-foreground">
          Aucune demande pour le moment.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id} className="border border-border bg-card p-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-lg">{enquiry.name}</h2>
                <span className="field-label">
                  {STATUS_LABELS[enquiry.status] ?? enquiry.status} ·{" "}
                  {enquiry.locale.toUpperCase()}
                </span>
                {!enquiry.notifiedAt && (
                  <span
                    className="field-label text-[var(--terracotta-dark)]"
                    title="La demande est enregistrée mais l'email de notification n'est pas parti."
                  >
                    · email non envoyé
                  </span>
                )}
              </div>

              <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                <Row label="Séjour">
                  {day(enquiry.arrival)} → {day(enquiry.departure)} (
                  {nights(enquiry.arrival, enquiry.departure)} nuits)
                </Row>
                <Row label="Invités">{enquiry.guests}</Row>
                <Row label="Email">
                  <a href={`mailto:${enquiry.email}`} className="underline hover:text-primary">
                    {enquiry.email}
                  </a>
                </Row>
                <Row label="Téléphone">
                  {enquiry.phone ? (
                    <a
                      href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      {enquiry.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </Row>
                <Row label="Reçue le">{enquiry.createdAt.toISOString().slice(0, 16).replace("T", " ")}</Row>
              </dl>

              {enquiry.message && (
                <p className="mt-4 whitespace-pre-wrap border-s-2 border-border ps-4 text-sm text-muted-foreground">
                  {enquiry.message}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {(NEXT_STATUSES[enquiry.status] ?? []).map((status) => (
                  <form key={status} action={setEnquiryStatus}>
                    <input type="hidden" name="id" value={enquiry.id} />
                    <input type="hidden" name="status" value={status} />
                    <button type="submit" className="admin-button-quiet">
                      {STATUS_LABELS[status]}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
