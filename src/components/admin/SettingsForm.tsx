"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "@/app/admin/site-actions";
import { ImageField } from "./ImageField";

type Image = { key: string; label: string; value: string };

export function SettingsForm({
  contact,
  images,
}: {
  contact: { whatsapp: string; email: string; instagram: string };
  images: { group: string; items: Image[] }[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, {});

  return (
    <form action={action} className="mt-8 space-y-12">
      <fieldset>
        <legend className="field-label">Coordonnées</legend>
        <p className="mt-2 text-sm text-muted-foreground">
          Utilisées partout : boutons WhatsApp, liens email, page contact, et
          l&apos;adresse qui reçoit les demandes de réservation.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm text-muted-foreground">WhatsApp, avec l&apos;indicatif</span>
            <input
              name="contact.whatsapp"
              inputMode="tel"
              defaultValue={contact.whatsapp}
              placeholder="33627874284"
              className="field-input mt-1.5"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Email</span>
            <input name="contact.email" type="email" defaultValue={contact.email} className="field-input mt-1.5" />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Instagram (nom du compte)</span>
            <input name="contact.instagram" defaultValue={contact.instagram} className="field-input mt-1.5" />
          </label>
        </div>
      </fieldset>

      {images.map((group) => (
        <fieldset key={group.group}>
          <legend className="field-label">{group.group}</legend>
          <div className="mt-2 grid gap-x-8 gap-y-6 lg:grid-cols-2">
            {group.items.map((image) => (
              <div key={image.key}>
                <p className="text-sm">{image.label}</p>
                <ImageField name={image.key} folder="site" initialUrl={image.value} />
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 border-t border-border bg-background/95 py-4 backdrop-blur">
        <button type="submit" disabled={pending} className="admin-button">
          {pending ? "Enregistrement…" : "Enregistrer et publier"}
        </button>
        {state.error && (
          <p role="alert" className="text-sm text-[var(--terracotta-dark)]">
            {state.error}
          </p>
        )}
        {state.saved && !pending && (
          <p role="status" className="text-sm text-muted-foreground">
            Enregistré — le site est à jour.
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          « Retirer » une photo remet celle d&apos;origine.
        </p>
      </div>
    </form>
  );
}
