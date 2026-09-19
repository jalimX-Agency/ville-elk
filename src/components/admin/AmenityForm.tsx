"use client";

import { useActionState } from "react";
import { saveAmenity, type AmenityState } from "@/app/admin/actions";
import { ImageField } from "./ImageField";

type Values = {
  id: string;
  nameFr: string;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  imageUrl: string | null;
  altFr: string | null;
  altEn: string | null;
  altEs: string | null;
  altAr: string | null;
};

const LANGUAGES = [
  { code: "Fr", label: "Français", dir: "ltr" },
  { code: "En", label: "English", dir: "ltr" },
  { code: "Es", label: "Español", dir: "ltr" },
  { code: "Ar", label: "العربية", dir: "rtl" },
] as const;

export function AmenityForm({ amenity }: { amenity: Values }) {
  const [state, action, pending] = useActionState<AmenityState, FormData>(saveAmenity, {});

  return (
    <form action={action} className="mt-8 space-y-10">
      <input type="hidden" name="id" value={amenity.id} />

      <fieldset>
        <legend className="admin-label">Nom affiché</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {LANGUAGES.map((language) => (
            <label key={language.code} className="block">
              <span className="text-sm text-muted-foreground">{language.label}</span>
              <input
                name={`name${language.code}`}
                dir={language.dir}
                defaultValue={amenity[`name${language.code}`]}
                required={language.code === "Fr"}
                className="admin-input mt-1.5"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="admin-label">Photographie</legend>
        <ImageField name="imageUrl" folder="amenities" initialUrl={amenity.imageUrl} />

        <p className="mt-6 text-sm text-muted-foreground">
          Description de la photo, lue par les moteurs de recherche et les
          lecteurs d&apos;écran.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {LANGUAGES.map((language) => (
            <label key={language.code} className="block">
              <span className="text-sm text-muted-foreground">{language.label}</span>
              <input
                name={`alt${language.code}`}
                dir={language.dir}
                defaultValue={amenity[`alt${language.code}`] ?? ""}
                className="admin-input mt-1.5"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="admin-button">
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        {state.error && (
          <p role="alert" className="text-sm text-[var(--terracotta-dark)]">
            {state.error}
          </p>
        )}
        {state.saved && !pending && (
          <p role="status" className="text-sm text-muted-foreground">
            Enregistré et publié.
          </p>
        )}
      </div>
    </form>
  );
}
