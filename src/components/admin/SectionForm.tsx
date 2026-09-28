"use client";

import { useActionState } from "react";
import { RotateCcw } from "lucide-react";
import { saveSection, resetField, type FormState } from "@/app/admin/site-actions";
import { LangProvider, PerLang } from "./LangTabs";
import { SaveBar } from "./SaveBar";

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

export function SectionForm({ section, fields }: { section: string; fields: EditableField[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSection, {});

  return (
    <>
      <form action={action}>
        <input type="hidden" name="section" value={section} />

        <LangProvider>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.path} className="admin-card p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="field-label">
                    {field.label}
                    {field.modified && <span className="admin-pill admin-pill-new ms-2 align-middle">modifié</span>}
                  </p>
                  {field.modified && (
                    // Submits its own small form below: forms cannot nest, and a
                    // server-action formAction renames the button and loses
                    // which field to reset.
                    <button
                      type="submit"
                      form={`reset-${field.path}`}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Texte d&apos;origine
                    </button>
                  )}
                </div>

                <PerLang>
                  {(lang) => {
                    const name = `${lang.code}|${field.path}`;
                    const value = field.values[lang.code];
                    return (
                      <>
                        {field.kind === "list" || field.long ? (
                          <textarea
                            name={name}
                            dir={lang.dir}
                            lang={lang.code}
                            aria-label={`${field.label} — ${lang.label}`}
                            defaultValue={value}
                            rows={field.kind === "list" ? Math.max(3, value.split("\n").length + 1) : 3}
                            className="field-input mt-3 resize-y"
                          />
                        ) : (
                          <input
                            name={name}
                            dir={lang.dir}
                            lang={lang.code}
                            aria-label={`${field.label} — ${lang.label}`}
                            defaultValue={value}
                            className="field-input mt-3"
                          />
                        )}
                        {field.kind === "list" && (
                          <p className="mt-1.5 text-sm text-muted-foreground">Un élément par ligne.</p>
                        )}
                        {lang.code !== "fr" && field.values.fr && (
                          <p className="mt-2 border-s-2 border-border ps-3 text-sm text-muted-foreground" dir="ltr">
                            <span className="font-semibold">FR :</span>{" "}
                            <span className="whitespace-pre-line">{field.values.fr}</span>
                          </p>
                        )}
                      </>
                    );
                  }}
                </PerLang>
              </div>
            ))}
          </div>
        </LangProvider>

        <SaveBar pending={pending} state={state} hint="Un champ vidé reprend son texte d'origine." />
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
