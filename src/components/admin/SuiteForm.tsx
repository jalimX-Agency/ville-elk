"use client";

import { useActionState } from "react";
import { saveSuite, type SuiteState } from "@/app/admin/actions";
import { ImageField } from "./ImageField";
import { LangProvider, PerLang } from "./LangTabs";
import { SaveBar } from "./SaveBar";

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
  featuresFr: string[];
  featuresEn: string[];
  featuresEs: string[];
  featuresAr: string[];
  imageUrl: string | null;
  altFr: string | null;
  altEn: string | null;
  altEs: string | null;
  altAr: string | null;
};

const NEWLINE = String.fromCharCode(10);
const suffix = (code: string) => (code[0].toUpperCase() + code.slice(1)) as "Fr" | "En" | "Es" | "Ar";

export function SuiteForm({ suite }: { suite: Values }) {
  const [state, action, pending] = useActionState<SuiteState, FormData>(saveSuite, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={suite.id} />

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="admin-card p-4 sm:p-6 lg:col-span-3">
          <h2 className="font-semibold">Photo principale</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sur la page Suites et dans « les autres suites ». Les photos de la
            page de la suite se choisissent dans la Galerie.
          </p>
          <ImageField name="imageUrl" folder="suites" initialUrl={suite.imageUrl} />
        </section>

        <section className="admin-card space-y-4 p-4 sm:p-6 lg:col-span-2">
          <h2 className="font-semibold">Emplacement</h2>
          <label className="block">
            <span className="field-label">Niveau</span>
            <select name="level" defaultValue={suite.level} className="field-input mt-1.5 h-11">
              <option value="+1">Étage</option>
              <option value="0">Rez-de-chaussée</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Surface (m²)</span>
            <span className="block text-sm text-muted-foreground">Laissez vide si elle n&apos;est pas connue.</span>
            <input
              name="areaSqm"
              type="number"
              inputMode="numeric"
              min={1}
              max={2000}
              defaultValue={suite.areaSqm ?? ""}
              className="field-input mt-1.5"
            />
          </label>
        </section>
      </div>

      <section className="admin-card p-4 sm:p-6">
        <h2 className="mb-4 font-semibold">Textes</h2>
        <LangProvider>
          <PerLang>
            {(lang) => {
              const s = suffix(lang.code);
              const reference = (text: string) =>
                lang.code !== "fr" && text ? (
                  <p className="mt-1.5 whitespace-pre-line text-sm text-muted-foreground">FR : {text}</p>
                ) : null;
              return (
                <div className="space-y-5">
                  <label className="block">
                    <span className="field-label">
                      Nom {lang.code === "fr" && <span className="text-[#8f3d22]">*</span>}
                    </span>
                    <input
                      name={`name${s}`}
                      dir={lang.dir}
                      defaultValue={suite[`name${s}`]}
                      required={lang.code === "fr"}
                      className="field-input mt-1.5"
                    />
                    {reference(suite.nameFr)}
                  </label>
                  <label className="block">
                    <span className="field-label">Description</span>
                    <textarea
                      name={`description${s}`}
                      dir={lang.dir}
                      rows={5}
                      defaultValue={suite[`description${s}`]}
                      className="field-input mt-1.5 resize-y"
                    />
                    {reference(suite.descriptionFr)}
                  </label>
                  <label className="block">
                    <span className="field-label">Équipements</span>
                    <span className="block text-sm text-muted-foreground">Un par ligne — affichés en liste numérotée.</span>
                    <textarea
                      name={`features${s}`}
                      dir={lang.dir}
                      rows={Math.max(5, suite[`features${s}`].length + 1)}
                      defaultValue={suite[`features${s}`].join(NEWLINE)}
                      className="field-input mt-1.5 resize-y"
                    />
                    {reference(suite.featuresFr.join(NEWLINE))}
                  </label>
                  <label className="block">
                    <span className="field-label">Description de la photo principale</span>
                    <span className="block text-sm text-muted-foreground">Lue par Google et les lecteurs d&apos;écran.</span>
                    <input
                      name={`alt${s}`}
                      dir={lang.dir}
                      defaultValue={suite[`alt${s}`] ?? ""}
                      className="field-input mt-1.5"
                    />
                  </label>
                </div>
              );
            }}
          </PerLang>
        </LangProvider>
      </section>

      <SaveBar pending={pending} state={state} hint="Une langue laissée vide reprend le texte français." />
    </form>
  );
}
