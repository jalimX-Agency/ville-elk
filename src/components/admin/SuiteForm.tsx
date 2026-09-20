"use client";

import { useActionState } from "react";
import { saveSuite, type SuiteState } from "@/app/admin/actions";
import { ImageField } from "./ImageField";

type Values = {
  id: string;
  level: string;
  areaSqm: number | null;
  nameFr: string;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionAr: string;
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

export function SuiteForm({ suite }: { suite: Values }) {
  const [state, action, pending] = useActionState<SuiteState, FormData>(saveSuite, {});

  return (
    <form action={action} className="mt-8 space-y-10">
      <input type="hidden" name="id" value={suite.id} />

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="field-label mb-4">Emplacement</legend>
        <label className="block">
          <span className="text-sm text-muted-foreground">Niveau</span>
          <select name="level" defaultValue={suite.level} className="field-input mt-1.5 h-[2.85rem]">
            <option value="+1">Étage</option>
            <option value="0">Rez-de-chaussée</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-muted-foreground">
            Surface en m² — laissez vide si elle n&apos;est pas connue
          </span>
          <input
            name="areaSqm"
            type="number"
            min={1}
            max={2000}
            defaultValue={suite.areaSqm ?? ""}
            className="field-input mt-1.5"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend className="field-label">Nom</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {LANGUAGES.map((language) => (
            <label key={language.code} className="block">
              <span className="text-sm text-muted-foreground">{language.label}</span>
              <input
                name={`name${language.code}`}
                dir={language.dir}
                defaultValue={suite[`name${language.code}`]}
                required={language.code === "Fr"}
                className="field-input mt-1.5"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Description</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {LANGUAGES.map((language) => (
            <label key={language.code} className="block">
              <span className="text-sm text-muted-foreground">{language.label}</span>
              <textarea
                name={`description${language.code}`}
                dir={language.dir}
                rows={4}
                defaultValue={suite[`description${language.code}`]}
                className="field-input mt-1.5 resize-y"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Photographie</legend>
        <ImageField name="imageUrl" folder="suites" initialUrl={suite.imageUrl} />

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
                defaultValue={suite[`alt${language.code}`] ?? ""}
                className="field-input mt-1.5"
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
