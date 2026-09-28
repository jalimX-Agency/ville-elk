"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  List,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { setEnquiryStatus } from "@/app/admin/actions";
import { createManualBooking, deleteEnquiry, saveEnquiryNotes, type ManualState } from "@/app/admin/enquiry-actions";
import { draftReply, estimate, NIGHTLY_RATE_DH, TOURIST_TAX_DH, type ReplyKind } from "@/lib/booking/replies";

export type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  locale: string;
  message: string | null;
  arrival: string; // YYYY-MM-DD
  departure: string;
  guests: number;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED";
  source: string;
  notes: string;
  createdAt: string; // ISO
  statusChangedAt: string | null;
  notified: boolean;
};

const STATUS = {
  NEW: { label: "Nouvelle", pill: "admin-pill-new" },
  CONTACTED: { label: "Répondue", pill: "admin-pill-off" },
  CONFIRMED: { label: "Confirmée", pill: "admin-pill-live" },
  CANCELLED: { label: "Annulée", pill: "admin-pill-warn" },
} as const;

/** What a request can move to from where it is, in words. */
const NEXT: Record<EnquiryRow["status"], { to: EnquiryRow["status"]; label: string; primary?: boolean }[]> = {
  NEW: [
    { to: "CONTACTED", label: "Marquer comme répondue", primary: true },
    { to: "CONFIRMED", label: "Confirmer le séjour" },
    { to: "CANCELLED", label: "Annuler" },
  ],
  CONTACTED: [
    { to: "CONFIRMED", label: "Confirmer le séjour", primary: true },
    { to: "CANCELLED", label: "Annuler" },
  ],
  CONFIRMED: [{ to: "CANCELLED", label: "Annuler le séjour" }],
  CANCELLED: [{ to: "NEW", label: "Remettre en nouvelle" }],
};

const LANG: Record<string, string> = { fr: "Français", en: "Anglais", es: "Espagnol", ar: "Arabe" };

type Filter = "all" | EnquiryRow["status"];
type Sort = "recent" | "arrival";

const todayISO = () => new Date().toISOString().slice(0, 10);

function day(value: string, withYear = false) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

function ago(iso: string) {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86_400_000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} jours`;
  return `le ${new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
}

const dh = (value: number) => `${value.toLocaleString("fr-FR")} DH`;

/** Two stays share a night when each starts before the other ends. */
const overlaps = (a: EnquiryRow, b: EnquiryRow) => a.arrival < b.departure && b.arrival < a.departure;

export function EnquiriesBoard({ enquiries }: { enquiries: EnquiryRow[] }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const today = todayISO();
  const active = enquiries.filter((e) => e.status !== "CANCELLED");

  // Every request that shares a night with another live request.
  const conflicts = useMemo(() => {
    const map = new Map<string, EnquiryRow[]>();
    for (const a of active) {
      const others = active.filter((b) => b.id !== a.id && overlaps(a, b));
      if (others.length) map.set(a.id, others);
    }
    return map;
  }, [active]);

  const upcoming = active
    .filter((e) => e.status === "CONFIRMED" && e.departure > today)
    .sort((a, b) => a.arrival.localeCompare(b.arrival));
  const bookedNights = upcoming.reduce((sum, e) => sum + estimate(e).nights, 0);

  const stats = [
    { label: "À traiter", value: enquiries.filter((e) => e.status === "NEW").length, note: "nouvelles demandes", filter: "NEW" as Filter, highlight: true },
    { label: "En discussion", value: enquiries.filter((e) => e.status === "CONTACTED").length, note: "réponse envoyée", filter: "CONTACTED" as Filter },
    { label: "Séjours à venir", value: upcoming.length, note: upcoming[0] ? `prochain : ${day(upcoming[0].arrival)}` : "aucun pour l'instant", filter: "CONFIRMED" as Filter },
    { label: "Nuits réservées", value: bookedNights, note: "à venir", filter: "CONFIRMED" as Filter },
  ];

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Toutes" },
    { id: "NEW", label: "Nouvelles" },
    { id: "CONTACTED", label: "Répondues" },
    { id: "CONFIRMED", label: "Confirmées" },
    { id: "CANCELLED", label: "Annulées" },
  ];

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    return enquiries
      .filter((e) => filter === "all" || e.status === filter)
      .filter(
        (e) =>
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          (digits.length > 2 && (e.phone ?? "").replace(/\D/g, "").includes(digits)),
      )
      .sort((a, b) =>
        sort === "arrival"
          ? // Upcoming first, soonest on top; past stays after them.
            Number(a.departure <= today) - Number(b.departure <= today) || a.arrival.localeCompare(b.arrival)
          : b.createdAt.localeCompare(a.createdAt),
      );
  }, [enquiries, filter, query, sort, today]);

  const open = enquiries.find((e) => e.id === openId) ?? null;

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setAdding(true)} className="admin-button">
          Ajouter une réservation
        </button>
        {/* A file download, not a page, so a plain link rather than <Link>. */}
        <a href="/api/admin/enquiries" download className="admin-button-quiet">
          Exporter (Excel)
        </a>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label}>
            <button
              type="button"
              onClick={() => {
                setView("list");
                setFilter(stat.filter);
              }}
              className={
                "admin-card block h-full w-full p-4 text-start sm:p-5 " +
                (stat.highlight && stat.value > 0 ? "border-[var(--brass)] bg-[#fbf5ea]" : "")
              }
            >
              <p className="text-3xl font-semibold tabular-nums">{stat.value}</p>
              <p className="mt-1 text-sm font-medium">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.note}</p>
            </button>
          </li>
        ))}
      </ul>

      <div role="tablist" aria-label="Affichage" className="mt-6 inline-flex gap-1 rounded-full border border-border bg-card p-1">
        <button type="button" role="tab" aria-selected={view === "list"} onClick={() => setView("list")} className="admin-tab">
          <List className="h-4 w-4" /> Liste
        </button>
        <button type="button" role="tab" aria-selected={view === "calendar"} onClick={() => setView("calendar")} className="admin-tab">
          <CalendarDays className="h-4 w-4" /> Calendrier
        </button>
      </div>

      {view === "list" ? (
        <section className="mt-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <label className="relative flex-1 sm:max-w-sm">
                <span className="sr-only">Rechercher</span>
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nom, email, téléphone"
                  className="field-input h-11 ps-9"
                />
              </label>
              <label>
                <span className="sr-only">Trier</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="field-input h-11 w-auto">
                  <option value="recent">Plus récentes</option>
                  <option value="arrival">Arrivée la plus proche</option>
                </select>
              </label>
            </div>
            <div role="group" aria-label="Filtrer" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className="admin-tab admin-chip shrink-0"
                >
                  {f.label}
                  <span className="tabular-nums opacity-70">
                    {f.id === "all" ? enquiries.length : enquiries.filter((e) => e.status === f.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="admin-card mt-4 p-10 text-center text-muted-foreground">
              {enquiries.length === 0 ? "Aucune demande pour le moment." : "Aucune demande ne correspond."}
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {shown.map((e) => (
                <li key={e.id}>
                  <EnquiryCard enquiry={e} conflict={conflicts.has(e.id)} past={e.departure <= today} onOpen={() => setOpenId(e.id)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <Calendar enquiries={active} onOpen={setOpenId} />
      )}

      <Dialog.Root open={open !== null} onOpenChange={(value) => !value && setOpenId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#15120f]/50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="admin-app fixed inset-y-0 end-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto bg-[var(--admin-bg)] shadow-2xl outline-none"
          >
            {open && (
              <EnquirySheet
                key={open.id}
                enquiry={open}
                conflicts={conflicts.get(open.id) ?? []}
                onOpen={setOpenId}
                onDeleted={() => setOpenId(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={adding} onOpenChange={setAdding}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#15120f]/50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="admin-app fixed inset-y-0 end-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto bg-[var(--admin-bg)] shadow-2xl outline-none"
          >
            {adding && (
              <ManualBookingForm
                onCreated={(id) => {
                  setAdding(false);
                  setOpenId(id);
                }}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function EnquiryCard({
  enquiry: e,
  conflict,
  past,
  onOpen,
}: {
  enquiry: EnquiryRow;
  conflict: boolean;
  past: boolean;
  onOpen: () => void;
}) {
  const status = STATUS[e.status];
  const { nights } = estimate(e);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={"admin-card flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-4 text-start sm:p-5 " + (e.status === "CANCELLED" ? "opacity-60" : "")}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg font-semibold">{e.name}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          {day(e.arrival)} → {day(e.departure, true)} · {nights} nuit{nights > 1 ? "s" : ""} · {e.guests} invité{e.guests > 1 ? "s" : ""}
        </span>
        <span className="block text-sm text-muted-foreground">
          {e.source === "manual" ? "Ajoutée à la main" : `Reçue ${ago(e.createdAt)}`} · {LANG[e.locale] ?? e.locale}
        </span>
      </span>
      <span className="flex flex-wrap gap-1.5">
        <span className={`admin-pill ${status.pill}`}>{status.label}</span>
        {conflict && <span className="admin-pill admin-pill-warn">Dates en conflit</span>}
        {past && e.status !== "CANCELLED" && <span className="admin-pill admin-pill-off">Passé</span>}
        {!e.notified && <span className="admin-pill admin-pill-warn">Email non envoyé</span>}
        {e.notes && <span className="admin-pill admin-pill-off">Note</span>}
      </span>
    </button>
  );
}

function EnquirySheet({
  enquiry: e,
  conflicts,
  onOpen,
  onDeleted,
}: {
  enquiry: EnquiryRow;
  conflicts: EnquiryRow[];
  onOpen: (id: string) => void;
  onDeleted: () => void;
}) {
  const status = STATUS[e.status];
  const { nights, stay, tax, total } = estimate(e);
  const [kind, setKind] = useState<ReplyKind>("available");
  const draft = useMemo(() => draftReply(kind, e), [kind, e]);
  // Editable before sending; picking another template starts from that one.
  const [body, setBody] = useState(draft.body);
  const [notes, setNotes] = useState(e.notes);
  const [savingNotes, startSavingNotes] = useTransition();
  const [notesSaved, setNotesSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, startDeleting] = useTransition();
  const [copied, setCopied] = useState(false);

  // wa.me wants the international number, digits only.
  const phone = e.phone?.replace(/^\s*00/, "").replace(/\D/g, "") ?? "";

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2">
        <Dialog.Title className="min-w-0 truncate font-semibold">{e.name}</Dialog.Title>
        <Dialog.Close aria-label="Fermer" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg hover:bg-muted">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </div>

      <div className="space-y-4 p-4">
        {/* Where it stands, and the next step */}
        <section className="admin-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`admin-pill ${status.pill}`}>{status.label}</span>
            {e.statusChangedAt && e.status !== "NEW" && (
              <span className="text-sm text-muted-foreground">
                depuis le {new Date(e.statusChangedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {NEXT[e.status].map((next) => (
              <form key={next.to} action={setEnquiryStatus}>
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="status" value={next.to} />
                <button type="submit" className={next.primary ? "admin-button" : "admin-button-quiet"}>
                  {next.label}
                </button>
              </form>
            ))}
          </div>
        </section>

        {conflicts.length > 0 && (
          <section role="alert" className="rounded-lg border border-[#e7b9a5] bg-[#f7e1d8] p-4 text-[#8f3d22]">
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" /> Ces dates croisent {conflicts.length === 1 ? "une autre demande" : `${conflicts.length} autres demandes`}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {conflicts.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => onOpen(c.id)} className="min-h-11 text-start underline underline-offset-2">
                    {c.name} — {day(c.arrival)} → {day(c.departure)} ({STATUS[c.status].label.toLowerCase()})
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* The stay */}
        <section className="admin-card p-4">
          <h3 className="font-semibold">Séjour</h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Arrivée</dt>
              <dd className="font-medium">{day(e.arrival, true)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Départ</dt>
              <dd className="font-medium">{day(e.departure, true)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Durée</dt>
              <dd className="font-medium">{nights} nuit{nights > 1 ? "s" : ""}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Invités</dt>
              <dd className="font-medium">{e.guests}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Langue</dt>
              <dd className="font-medium">{LANG[e.locale] ?? e.locale}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{e.source === "manual" ? "Ajoutée" : "Reçue"}</dt>
              <dd className="font-medium">{new Date(e.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-lg bg-muted/60 p-3 text-sm">
            <p className="font-medium">Estimation au tarif de base</p>
            <p className="mt-1 flex justify-between gap-3">
              <span className="text-muted-foreground">{nights} × {dh(NIGHTLY_RATE_DH)}</span>
              <span className="tabular-nums">{dh(stay)}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-muted-foreground">Taxe de séjour : {e.guests} × {nights} × {dh(TOURIST_TAX_DH)}</span>
              <span className="tabular-nums">{dh(tax)}</span>
            </p>
            <p className="mt-1 flex justify-between gap-3 border-t border-border pt-1 font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{dh(total)}</span>
            </p>
          </div>

          {e.message && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Message du client</p>
              <p className="mt-1 whitespace-pre-wrap rounded-lg border border-border p-3 text-sm">{e.message}</p>
            </div>
          )}
        </section>

        {/* Reply, drafted in their language */}
        <section className="admin-card p-4">
          <h3 className="font-semibold">Répondre</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Un message prêt, en {(LANG[e.locale] ?? "français").toLowerCase()}. Modifiez-le si besoin, puis envoyez-le.
          </p>
          <div role="group" aria-label="Modèle" className="mt-3 flex flex-wrap gap-2">
            {([
              ["available", "Disponible"],
              ["unavailable", "Pas disponible"],
              ["thanks", "Simple merci"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={kind === id}
                onClick={() => {
                  setKind(id);
                  setBody(draftReply(id, e).body);
                }}
                className="admin-tab admin-chip"
              >
                {label}
              </button>
            ))}
          </div>
          <label className="mt-3 block">
            <span className="sr-only">Message</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={9}
              dir={e.locale === "ar" ? "rtl" : "ltr"}
              className="field-input resize-y text-sm"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {phone && (
              <a href={`https://wa.me/${phone}?text=${encodeURIComponent(body)}`} target="_blank" rel="noopener noreferrer" className="admin-button">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {e.email && (
              <a
                href={`mailto:${e.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(body)}`}
                className={phone ? "admin-button-quiet" : "admin-button"}
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(body).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="admin-button-quiet"
            >
              <Copy className="h-4 w-4" /> {copied ? "Copié" : "Copier"}
            </button>
          </div>
          <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
            {e.email && (
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="min-w-0 break-all">{e.email}</dd>
              </div>
            )}
            {e.phone && (
              <div className="flex items-center gap-2">
                <dt className="text-muted-foreground">Téléphone</dt>
                <dd>
                  <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center gap-1 underline underline-offset-2">
                    <Phone className="h-3.5 w-3.5" /> {e.phone}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Private notes */}
        <section className="admin-card p-4">
          <label htmlFor={`notes-${e.id}`} className="font-semibold">
            Notes privées
          </label>
          <p className="text-sm text-muted-foreground">Visibles seulement ici : acompte reçu, heure d&apos;arrivée, demandes…</p>
          <textarea
            id={`notes-${e.id}`}
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              setNotesSaved(false);
            }}
            rows={4}
            className="field-input mt-2 resize-y"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={savingNotes || notes === e.notes}
              onClick={() =>
                startSavingNotes(async () => {
                  await saveEnquiryNotes(e.id, notes);
                  setNotesSaved(true);
                })
              }
              className="admin-button"
            >
              {savingNotes ? "Enregistrement…" : "Enregistrer la note"}
            </button>
            {notesSaved && notes === e.notes && <span className="text-sm text-[#2d5a3a]">Enregistrée</span>}
          </div>
        </section>

        <section className="p-1">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">Supprimer définitivement cette demande ?</span>
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  startDeleting(async () => {
                    await deleteEnquiry(e.id);
                    onDeleted();
                  })
                }
                className="admin-button bg-[#8f3d22]"
              >
                Oui, supprimer
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="admin-button-quiet">
                Non
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="admin-button-quiet text-[#8f3d22]">
              <Trash2 className="h-4 w-4" /> Supprimer la demande
            </button>
          )}
          <p className="mt-1 text-sm text-muted-foreground">Pour les faux messages. Un séjour qui ne se fait pas : « Annuler ».</p>
        </section>
      </div>
    </>
  );
}

const WEEKDAYS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

/**
 * One month of nights. A night belongs to a stay from its arrival day up to,
 * not including, its departure day — the way a hotel counts.
 */
function Calendar({ enquiries, onOpen }: { enquiries: EnquiryRow[]; onOpen: (id: string) => void }) {
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)));
  const [selected, setSelected] = useState<string | null>(null);

  const year = month.getUTCFullYear();
  const m = month.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
  const lead = (month.getUTCDay() + 6) % 7; // Monday first
  const iso = (d: number) => new Date(Date.UTC(year, m, d)).toISOString().slice(0, 10);
  const staysOn = (date: string) => enquiries.filter((e) => e.arrival <= date && date < e.departure);
  const today = todayISO();

  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const shift = (by: number) => {
    setMonth(new Date(Date.UTC(year, m + by, 1)));
    setSelected(null);
  };

  const selectedStays = selected ? staysOn(selected) : [];

  return (
    <section className="admin-card mt-4 max-w-3xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => shift(-1)} aria-label="Mois précédent" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold capitalize">
          {month.toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" })}
        </h2>
        <button type="button" onClick={() => shift(1)} aria-label="Mois suivant" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, index) => {
          if (d === null) return <span key={`lead-${index}`} />;
          const date = iso(d);
          const stays = staysOn(date);
          const confirmed = stays.some((s) => s.status === "CONFIRMED");
          const pending = stays.some((s) => s.status !== "CONFIRMED");
          const clash = stays.length > 1;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelected(date === selected ? null : date)}
              aria-pressed={date === selected}
              aria-label={`${d} — ${stays.length ? stays.map((s) => s.name).join(", ") : "libre"}`}
              className={
                "relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-lg text-sm tabular-nums transition-colors " +
                (confirmed
                  ? "bg-[var(--terracotta)] font-semibold text-white"
                  : pending
                    ? "bg-[#f6e8cf] font-medium text-[#74500f]"
                    : "hover:bg-muted") +
                (date === selected ? " ring-2 ring-[var(--onyx)] ring-offset-1" : "") +
                (date === today ? " underline decoration-2 underline-offset-4" : "")
              }
            >
              {d}
              {clash && <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-[#8f3d22] ring-1 ring-white" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[var(--terracotta)]" /> Confirmé</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#f6e8cf]" /> En attente</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#8f3d22]" /> Plusieurs demandes</span>
      </div>

      {selected && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="font-medium">{day(selected, true)}</p>
          {selectedStays.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">Nuit libre.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedStays.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => onOpen(s.id)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-start hover:bg-muted">
                    <span>
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-sm text-muted-foreground">
                        {day(s.arrival)} → {day(s.departure)} · {s.guests} invités
                      </span>
                    </span>
                    <span className={`admin-pill ${STATUS[s.status].pill}`}>{STATUS[s.status].label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function ManualBookingForm({ onCreated }: { onCreated: (id: string) => void }) {
  const [state, action, pending] = useActionState<ManualState, FormData>(createManualBooking, {});
  const [, startSubmit] = useTransition();
  useEffect(() => {
    if (state.created) onCreated(state.created);
  }, [state.created, onCreated]);
  const err = (field: string) =>
    state.field === field ? <span role="alert" className="mt-1 block text-sm text-[#8f3d22]">{state.error}</span> : null;

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <Dialog.Title className="font-semibold">Ajouter une réservation</Dialog.Title>
        <Dialog.Close aria-label="Fermer" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </div>
      {/* Submitted by hand: a form `action` is reset by React once it settles,
          which would wipe everything typed whenever one field is wrong. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          startSubmit(() => action(data));
        }}
        className="space-y-4 p-4"
      >
        <p className="text-sm text-muted-foreground">
          Pour un séjour arrangé par téléphone ou WhatsApp : il apparaît dans le calendrier et dans les alertes de dates.
        </p>
        <label className="block">
          <span className="field-label">Nom du client</span>
          <input name="name" required className="field-input mt-1.5" />
          {err("name")}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Téléphone / WhatsApp</span>
            <input name="phone" type="tel" inputMode="tel" placeholder="+33 6 …" className="field-input mt-1.5" />
          </label>
          <label className="block">
            <span className="field-label">Email (facultatif)</span>
            <input name="email" type="email" className="field-input mt-1.5" />
            {err("email")}
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="field-label">Arrivée</span>
            <input name="arrival" type="date" required className="field-input mt-1.5" />
            {err("arrival")}
          </label>
          <label className="block">
            <span className="field-label">Départ</span>
            <input name="departure" type="date" required className="field-input mt-1.5" />
            {err("departure")}
          </label>
          <label className="block">
            <span className="field-label">Invités</span>
            <input name="guests" type="number" inputMode="numeric" min={1} max={10} defaultValue={2} className="field-input mt-1.5" />
            {err("guests")}
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Statut</span>
            <select name="status" defaultValue="CONFIRMED" className="field-input mt-1.5 h-11">
              <option value="CONFIRMED">Confirmée</option>
              <option value="CONTACTED">En discussion</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Langue du client</span>
            <select name="locale" defaultValue="fr" className="field-input mt-1.5 h-11">
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="ar">Arabe</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="field-label">Notes privées</span>
          <textarea name="notes" rows={3} className="field-input mt-1.5 resize-y" />
        </label>
        {state.error && !state.field && <p role="alert" className="text-sm text-[#8f3d22]">{state.error}</p>}
        <button type="submit" disabled={pending} className="admin-button">
          {pending ? "Enregistrement…" : "Ajouter la réservation"}
        </button>
      </form>
    </>
  );
}
