import { CalendarDays, Mail, MessageCircle, Users } from "lucide-react";
import { db } from "@/lib/db/client";
import { setEnquiryStatus } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/PageHeader";

const STATUS: Record<string, { label: string; pill: string }> = {
  NEW: { label: "Nouvelle", pill: "admin-pill-new" },
  CONTACTED: { label: "Répondu", pill: "admin-pill-off" },
  CONFIRMED: { label: "Confirmée", pill: "admin-pill-live" },
  CANCELLED: { label: "Annulée", pill: "admin-pill-warn" },
};

/** What the owner can move a request to from where it is now, in words. */
const NEXT: Record<string, { to: string; label: string; primary?: boolean }[]> = {
  NEW: [
    { to: "CONTACTED", label: "Marquer comme répondue", primary: true },
    { to: "CANCELLED", label: "Annuler" },
  ],
  CONTACTED: [
    { to: "CONFIRMED", label: "Confirmer le séjour", primary: true },
    { to: "CANCELLED", label: "Annuler" },
  ],
  CONFIRMED: [{ to: "CANCELLED", label: "Annuler" }],
  CANCELLED: [{ to: "NEW", label: "Remettre en nouvelle" }],
};

function day(date: Date) {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function nights(arrival: Date, departure: Date) {
  return Math.round((departure.getTime() - arrival.getTime()) / 86_400_000);
}

export default async function EnquiriesPage() {
  const enquiries = await db.enquiry.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <>
      <PageHeader
        title="Demandes de réservation"
        description="Chaque demande arrive aussi par email. Rien n'est réservé tant que vous n'avez pas répondu : suivez chaque demande avec les boutons en bas de sa fiche."
      />

      {enquiries.length === 0 ? (
        <p className="admin-card p-10 text-center text-muted-foreground">Aucune demande pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {enquiries.map((enquiry) => {
            const status = STATUS[enquiry.status] ?? { label: enquiry.status, pill: "admin-pill-off" };
            const phone = enquiry.phone?.replace(/\D/g, "");
            return (
              <li key={enquiry.id} className="admin-card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold">{enquiry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Reçue le {enquiry.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" })} · site en {enquiry.locale.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`admin-pill ${status.pill}`}>{status.label}</span>
                    {!enquiry.notifiedAt && (
                      <span className="admin-pill admin-pill-warn" title="La demande est enregistrée mais l'email de notification n'est pas parti.">
                        Email non envoyé
                      </span>
                    )}
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <div>
                      <dt className="sr-only">Séjour</dt>
                      <dd>
                        {day(enquiry.arrival)} → {day(enquiry.departure)}
                        <span className="block text-sm text-muted-foreground">
                          {nights(enquiry.arrival, enquiry.departure)} nuits
                        </span>
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <div>
                      <dt className="sr-only">Invités</dt>
                      <dd>
                        {enquiry.guests} invité{enquiry.guests > 1 ? "s" : ""}
                      </dd>
                    </div>
                  </div>
                </dl>

                {enquiry.message && (
                  <p className="mt-4 whitespace-pre-wrap rounded-lg bg-muted/60 p-3 text-sm">{enquiry.message}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  {phone && (
                    <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="admin-button-quiet">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                  <a href={`mailto:${enquiry.email}`} className="admin-button-quiet">
                    <Mail className="h-4 w-4" /> {enquiry.email}
                  </a>
                  <span className="flex-1" />
                  {(NEXT[enquiry.status] ?? []).map((next) => (
                    <form key={next.to} action={setEnquiryStatus}>
                      <input type="hidden" name="id" value={enquiry.id} />
                      <input type="hidden" name="status" value={next.to} />
                      <button type="submit" className={next.primary ? "admin-button" : "admin-button-quiet"}>
                        {next.label}
                      </button>
                    </form>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
