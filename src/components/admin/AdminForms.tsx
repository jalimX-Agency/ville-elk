"use client";

import { useActionState } from "react";
import {
  changePassword,
  createAmenity,
  createSuite,
  type FormState,
} from "@/app/admin/site-actions";

function Status({ state, pending, saved }: { state: FormState; pending: boolean; saved: string }) {
  if (state.error) {
    return (
      <p role="alert" className="text-sm text-[var(--terracotta-dark)]">
        {state.error}
      </p>
    );
  }
  if (state.saved && !pending) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {saved}
      </p>
    );
  }
  return null;
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});
  return (
    <form action={action} className="mt-8 max-w-md space-y-4">
      <label className="block">
        <span className="text-sm text-muted-foreground">Mot de passe actuel</span>
        <input name="current" type="password" autoComplete="current-password" required className="field-input mt-1.5" />
      </label>
      <label className="block">
        <span className="text-sm text-muted-foreground">Nouveau mot de passe (10 caractères minimum)</span>
        <input name="next" type="password" autoComplete="new-password" minLength={10} required className="field-input mt-1.5" />
      </label>
      <label className="block">
        <span className="text-sm text-muted-foreground">Nouveau mot de passe, encore une fois</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required className="field-input mt-1.5" />
      </label>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" disabled={pending} className="admin-button">
          {pending ? "…" : "Changer le mot de passe"}
        </button>
        <Status state={state} pending={pending} saved="Mot de passe changé." />
      </div>
    </form>
  );
}

/** One line to add a row; the full editor opens right after. */
export function CreateForm({ kind }: { kind: "amenity" | "suite" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    kind === "amenity" ? createAmenity : createSuite,
    {},
  );
  return (
    <form action={action} className="mt-6 flex flex-wrap items-end gap-3 border border-dashed border-border p-4">
      <label className="block min-w-56 flex-1">
        <span className="text-sm text-muted-foreground">
          {kind === "amenity" ? "Nouvelle prestation — nom en français" : "Nouvelle suite — nom en français"}
        </span>
        <input name="nameFr" required className="field-input mt-1.5" />
      </label>
      {kind === "suite" && (
        <label className="block">
          <span className="text-sm text-muted-foreground">Niveau</span>
          <select name="level" defaultValue="+1" className="field-input mt-1.5 h-[2.85rem]">
            <option value="+1">Étage</option>
            <option value="0">Rez-de-chaussée</option>
          </select>
        </label>
      )}
      <button type="submit" disabled={pending} className="admin-button">
        {pending ? "…" : "Ajouter"}
      </button>
      <Status state={state} pending={pending} saved="" />
      {kind === "suite" && (
        <p className="w-full text-sm text-muted-foreground">
          Une nouvelle suite reste masquée jusqu&apos;à ce que vous la publiiez.
        </p>
      )}
    </form>
  );
}
