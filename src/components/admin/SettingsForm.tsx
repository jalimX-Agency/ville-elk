"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "@/app/admin/site-actions";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";

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
    <form action={action} className="space-y-4">
      <fieldset className="admin-card p-4 sm:p-6">
        <legend className="sr-only">Coordonnées</legend>
        <p className="font-semibold">Coordonnées</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Utilisées partout : boutons WhatsApp, liens email, page contact, et
          l&apos;adresse qui reçoit les demandes de réservation.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="field-label">WhatsApp</span>
            <span className="block text-sm text-muted-foreground">Avec l&apos;indicatif du pays</span>
            <input
              name="contact.whatsapp"
              inputMode="tel"
              defaultValue={contact.whatsapp}
              placeholder="33627874284"
              className="field-input mt-1.5"
            />
          </label>
          <label className="block">
            <span className="field-label">Email</span>
            <span className="block text-sm text-muted-foreground">Reçoit aussi les demandes</span>
            <input name="contact.email" type="email" defaultValue={contact.email} className="field-input mt-1.5" />
          </label>
          <label className="block">
            <span className="field-label">Instagram</span>
            <span className="block text-sm text-muted-foreground">Nom du compte, sans @</span>
            <input name="contact.instagram" defaultValue={contact.instagram} className="field-input mt-1.5" />
          </label>
        </div>
      </fieldset>

      {images.map((group) => (
        <fieldset key={group.group} className="admin-card p-4 sm:p-6">
          <legend className="sr-only">{group.group}</legend>
          <p className="font-semibold">{group.group}</p>
          <div className="mt-2 grid gap-x-8 gap-y-6 lg:grid-cols-2">
            {group.items.map((image) => (
              <div key={image.key} className="rounded-lg border border-border p-3">
                <p className="field-label">{image.label}</p>
                <ImageField name={image.key} folder="site" initialUrl={image.value} />
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <SaveBar pending={pending} state={state} hint="« Retirer » une photo remet celle d'origine." />
    </form>
  );
}
