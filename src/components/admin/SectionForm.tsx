"use client";

import { useActionState } from "react";
import { saveSection, resetField, type FormState } from "@/app/admin/site-actions";

export type EditableField = {
  path: string;
  label: string;
  kind: "text" | "list";
  /** Whether any language differs from the text in the code. */
  modified: boolean;
  values: Record<"fr" | "en" | "es" | "ar", string>;
  /** Long text gets a text area. */
  long: boolean;
};

const LANGUAGES = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
] as const;

export function SectionForm({ section, fields }: { section: string; fields: EditableField[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSection, {});

  return (
    <>
    <form action={action} className="mt-8">
      <input type="hidden" name="section" value={section} />

      <div className="space-y-8">
        {fields.map((field) => (
          <fieldset key={field.path} className="border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <legend className="text-base font-medium">
                {field.label}
                {field.modified && (
                  <span className="field-label ms-3 inline text-primary">modifié</span>
                )}
              </legend>
              {field.modified && (
                // Submits its own small form below — forms cannot nest, and a
                // server-action formAction would rename the button and lose
                // which field to reset.
                <button
                  type="submit"
                  form={`reset-${field.path}`}
                  className="text-sm text-muted-foreground underline hover:text-primary"
                >
                  Revenir au texte d&apos;origine
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {LANGUAGES.map((language) => {
                const name = `${language.code}|${field.path}`;
                const value = field.values[language.code];
                return (
                  <label key={language.code} className="block">
                    <span className="text-sm text-muted-foreground">{language.label}</span>
                    {field.kind === "list" || field.long ? (
                      <textarea
                        name={name}
                        dir={language.dir}
                        defaultValue={value}
                        rows={field.kind === "list" ? Math.max(3, value.split("\n").length + 1) : 4}
                        className="field-input mt-1.5 resize-y"
                      />
                    ) : (
                      <input name={name} dir={language.dir} defaultValue={value} className="field-input mt-1.5" />
                    )}
                  </label>
                );
              })}
            </div>
            {field.kind === "list" && (
              <p className="mt-2 text-sm text-muted-foreground">Un élément par ligne.</p>
            )}
          </fieldset>
        ))}
      </div>

      {/* Stays in reach at the bottom of a long screen */}
      <div className="sticky bottom-0 mt-10 flex flex-wrap items-center gap-4 border-t border-border bg-background/95 py-4 backdrop-blur">
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
          Un champ vidé reprend son texte d&apos;origine.
        </p>
      </div>
    </form>

    {fields
      .filter((field) => field.modified)
      .map((field) => (
        <form key={field.path} id={`reset-${field.path}`} action={resetField} hidden>
          <input type="hidden" name="reset" value={field.path} />
        </form>
      ))}
    </>
  );
}
