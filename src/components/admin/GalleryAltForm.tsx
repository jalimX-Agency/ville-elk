"use client";

import { useActionState } from "react";
import { saveGalleryAlt, type GalleryAltState } from "@/app/admin/actions";
import { CATEGORY_OPTIONS } from "./gallery-categories";

const LANGUAGES = [
  { code: "Fr", label: "FR", dir: "ltr" },
  { code: "En", label: "EN", dir: "ltr" },
  { code: "Es", label: "ES", dir: "ltr" },
  { code: "Ar", label: "AR", dir: "rtl" },
] as const;

type Values = {
  id: string;
  category: string;
  suiteId: string | null;
  altFr: string;
  altEn: string;
  altEs: string;
  altAr: string;
};

/** The alt text is the only copy a photograph carries, so it is edited inline. */
export function GalleryAltForm({
  photo,
  suites,
}: {
  photo: Values;
  /** Rooms a photograph can belong to; it then also shows on that suite's page. */
  suites: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<GalleryAltState, FormData>(saveGalleryAlt, {});

  return (
    <form action={action} className="mt-3 space-y-2">
      <input type="hidden" name="id" value={photo.id} />

      <label className="flex items-center gap-2">
        <span className="field-label w-8 shrink-0">Où</span>
        <select
          name="category"
          defaultValue={photo.category}
          className="field-input h-9 py-0 text-sm"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2">
        <span className="field-label w-8 shrink-0">Suite</span>
        <select
          name="suiteId"
          defaultValue={photo.suiteId ?? ""}
          className="field-input h-9 py-0 text-sm"
        >
          <option value="">Aucune</option>
          {suites.map((suite) => (
            <option key={suite.id} value={suite.id}>
              {suite.name}
            </option>
          ))}
        </select>
      </label>

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
