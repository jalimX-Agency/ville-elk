"use client";

import { useState, useTransition } from "react";
import { ExternalLink, FileText, Send } from "lucide-react";
import { confirmWithFiche, saveFiche, type FicheFields, type FicheResult } from "@/app/admin/enquiry-actions";
import { estimate } from "@/lib/booking/replies";

export type FicheState = {
  id: string;
  status: string;
  email: string;
  locale: string;
  arrival: string;
  departure: string;
  guests: number;
  priceDh: number | null;
  depositDh: number | null;
  checkInTime: string;
  checkOutTime: string;
  ficheNote: string;
  ficheLocale: string | null;
  ficheSentAt: string | null;
  ficheToken: string | null;
};

const LANGS = [
  ["fr", "Français"],
  ["en", "Anglais"],
  ["es", "Espagnol"],
  ["ar", "Arabe"],
] as const;

/**
 * Everything the booking sheet says that only the owner knows — the agreed
 * price, the deposit, the times — then confirming the stay and sending the
 * sheet to the guest in one step.
 */
export function FicheSection({ enquiry: e }: { enquiry: FicheState }) {
  const [fields, setFields] = useState<FicheFields>(() => ({
    // The agreed price starts from the base rate; the owner adjusts it.
    priceDh: String(e.priceDh ?? estimate(e).stay),
    depositDh: e.depositDh ? String(e.depositDh) : "",
    checkInTime: e.checkInTime,
    checkOutTime: e.checkOutTime,
    ficheNote: e.ficheNote,
    ficheLocale: e.ficheLocale ?? (["fr", "en", "es", "ar"].includes(e.locale) ? e.locale : "fr"),
  }));
  const [send, setSend] = useState(Boolean(e.email));
  const [result, setResult] = useState<FicheResult | null>(null);
  const [working, start] = useTransition();
  const set = (key: keyof FicheFields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const confirmed = e.status === "CONFIRMED";
  const previewHref = `/admin/fiche/${e.id}?lang=${fields.ficheLocale}`;
  const guestLink =
    e.ficheToken && typeof window !== "undefined" ? `${window.location.origin}/fiche/${e.ficheToken}?lang=${fields.ficheLocale}` : null;

  return (
    <section id={`fiche-${e.id}`} className="admin-card scroll-mt-16 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <FileText className="h-4 w-4 text-[var(--terracotta)]" /> Fiche de réservation
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {e.ficheSentAt
          ? `Envoyée au client le ${new Date(e.ficheSentAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}.`
          : confirmed
            ? "Séjour confirmé. La fiche n'a pas encore été envoyée."
            : "Indiquez le prix convenu, puis confirmez : le client reçoit sa fiche par email, dans sa langue."}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Prix du séjour (DH)</span>
          <span className="block text-sm text-muted-foreground">Hors taxe de séjour, calculée seule</span>
          <input
            value={fields.priceDh}
            onChange={(event) => set("priceDh")(event.target.value)}
            inputMode="numeric"
            className="field-input mt-1.5"
          />
        </label>
        <label className="block">
          <span className="field-label">Acompte reçu (DH)</span>
          <span className="block text-sm text-muted-foreground">Vide si rien n&apos;est encore payé</span>
          <input
            value={fields.depositDh}
            onChange={(event) => set("depositDh")(event.target.value)}
            inputMode="numeric"
            className="field-input mt-1.5"
          />
        </label>
        <label className="block">
          <span className="field-label">Arrivée à partir de</span>
          <input type="time" value={fields.checkInTime} onChange={(event) => set("checkInTime")(event.target.value)} className="field-input mt-1.5" />
        </label>
        <label className="block">
          <span className="field-label">Départ avant</span>
          <input type="time" value={fields.checkOutTime} onChange={(event) => set("checkOutTime")(event.target.value)} className="field-input mt-1.5" />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Langue de la fiche</span>
          <select value={fields.ficheLocale} onChange={(event) => set("ficheLocale")(event.target.value)} className="field-input mt-1.5 h-11">
            {LANGS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Message sur la fiche (facultatif)</span>
          <span className="block text-sm text-muted-foreground">Écrit dans la langue de la fiche : accueil, code d&apos;accès, transfert prévu…</span>
          <textarea
            value={fields.ficheNote}
            onChange={(event) => set("ficheNote")(event.target.value)}
            rows={3}
            dir={fields.ficheLocale === "ar" ? "rtl" : "ltr"}
            className="field-input mt-1.5 resize-y"
          />
        </label>
      </div>

      {e.email ? (
        <label className="mt-4 flex min-h-11 items-center gap-3">
          <input type="checkbox" checked={send} onChange={(event) => setSend(event.target.checked)} className="h-5 w-5 accent-[var(--terracotta)]" />
          <span className="text-sm">
            Envoyer la fiche par email à <strong className="break-all">{e.email}</strong> (vous en recevez une copie)
          </span>
        </label>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Pas d&apos;email pour ce client : après confirmation, envoyez-lui le lien de la fiche par WhatsApp.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={working}
          onClick={() =>
            start(async () => {
              setResult(await confirmWithFiche(e.id, fields, send && Boolean(e.email)));
            })
          }
          className="admin-button"
        >
          <Send className="h-4 w-4" />
          {working
            ? "Envoi…"
            : confirmed
              ? send && e.email
                ? e.ficheSentAt
                  ? "Renvoyer la fiche"
                  : "Envoyer la fiche"
                : "Enregistrer la fiche"
              : send && e.email
                ? "Confirmer et envoyer au client"
                : "Confirmer le séjour"}
        </button>
        <button
          type="button"
          disabled={working}
          onClick={() =>
            start(async () => {
              const saved = await saveFiche(e.id, fields);
              if (!saved.error) window.open(previewHref, "_blank", "noopener");
              setResult(saved.error ? saved : null);
            })
          }
          className="admin-button-quiet"
        >
          <ExternalLink className="h-4 w-4" /> Aperçu / PDF
        </button>
      </div>

      {result?.error && (
        <p role="alert" className="mt-3 text-sm text-[#8f3d22]">
          {result.error}
        </p>
      )}
      {result?.sent && <p className="mt-3 text-sm text-[#2d5a3a]">Séjour confirmé, fiche envoyée au client.</p>}
      {result && !result.sent && !result.error && result.saved && (
        <p className="mt-3 text-sm text-[#2d5a3a]">{confirmed ? "Fiche enregistrée." : "Séjour confirmé."}</p>
      )}

      {confirmed && guestLink && (
        <div className="mt-4 border-t border-border pt-3 text-sm">
          <p className="text-muted-foreground">Lien de la fiche pour le client (à envoyer par WhatsApp si besoin) :</p>
          <p className="mt-1 break-all font-mono text-xs">{guestLink}</p>
          <button type="button" onClick={() => void navigator.clipboard.writeText(guestLink)} className="admin-button-quiet mt-2">
            Copier le lien
          </button>
        </div>
      )}
    </section>
  );
}
