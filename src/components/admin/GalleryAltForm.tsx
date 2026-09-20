"use client";

import { useActionState } from "react";
import { saveGalleryAlt, type GalleryAltState } from "@/app/admin/actions";

const LANGUAGES = [
  { code: "Fr", label: "FR", dir: "ltr" },
  { code: "En", label: "EN", dir: "ltr" },
  { code: "Es", label: "ES", dir: "ltr" },
  { code: "Ar", label: "AR", dir: "rtl" },
] as const;

type Values = {
  id: string;
  altFr: string;
  altEn: string;
  altEs: string;
  altAr: string;
};

/** The alt text is the only copy a photograph carries, so it is edited inline. */
export function GalleryAltForm({ photo }: { photo: Values }) {
  const [state, action, pending] = useActionState<GalleryAltState, FormData>(saveGalleryAlt, {});

  return (
    <form action={action} className="mt-3 space-y-2">
      <input type="hidden" name="id" value={photo.id} />

      {LANGUAGES.map((language) => (
        <label key={language.code} className="flex items-center gap-2">
          <span className="field-label w-8 shrink-0">{language.label}</span>
          <input
            name={`alt${language.code}`}
            dir={language.dir}
            defaultValue={photo[`alt${language.code}`]}
            placeholder={language.code === "Fr" ? "Décrivez la photo" : ""}
            className="field-input py-1.5 text-sm"
          />
        </label>
      ))}

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={pending} className="admin-button-quiet text-sm">
          {pending ? "…" : "Enregistrer"}
        </button>
        {state.error && (
          <span role="alert" className="text-sm text-[var(--terracotta-dark)]">
            {state.error}
          </span>
        )}
        {state.saved && !pending && (
          <span role="status" className="text-sm text-muted-foreground">
            Enregistré.
          </span>
        )}
      </div>
    </form>
  );
}
