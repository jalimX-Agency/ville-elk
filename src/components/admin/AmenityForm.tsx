"use client";

import { useActionState } from "react";
import { saveAmenity, type AmenityState } from "@/app/admin/actions";
import { ImageField } from "./ImageField";
import { LangProvider, PerLang } from "./LangTabs";
import { SaveBar } from "./SaveBar";

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

const suffix = (code: string) => code[0].toUpperCase() + code.slice(1); // "fr" → "Fr"

export function AmenityForm({ amenity }: { amenity: Values }) {
  const [state, action, pending] = useActionState<AmenityState, FormData>(saveAmenity, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={amenity.id} />

      <section className="admin-card p-4 sm:p-6">
        <h2 className="font-semibold">Photo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Montrée au survol de la prestation sur ordinateur, en vignette sur téléphone.
        </p>
        <ImageField name="imageUrl" folder="amenities" initialUrl={amenity.imageUrl} />
      </section>

      <section className="admin-card p-4 sm:p-6">
        <h2 className="mb-4 font-semibold">Textes</h2>
        <LangProvider>
          <PerLang>
            {(lang) => {
              const s = suffix(lang.code) as "Fr" | "En" | "Es" | "Ar";
              return (
                <div className="space-y-5">
                  <label className="block">
                    <span className="field-label">Nom affiché {lang.code === "fr" && <span className="text-[#8f3d22]">*</span>}</span>
                    <input
                      name={`name${s}`}
                      dir={lang.dir}
                      defaultValue={amenity[`name${s}`]}
                      required={lang.code === "fr"}
                      className="field-input mt-1.5"
                    />
                    {lang.code !== "fr" && <p className="mt-1.5 text-sm text-muted-foreground">FR : {amenity.nameFr}</p>}
                  </label>
                  <label className="block">
                    <span className="field-label">Description de la photo</span>
                    <span className="block text-sm text-muted-foreground">Lue par Google et les lecteurs d&apos;écran.</span>
                    <input
                      name={`alt${s}`}
                      dir={lang.dir}
                      defaultValue={amenity[`alt${s}`] ?? ""}
                      className="field-input mt-1.5"
                    />
                  </label>
                </div>
              );
            }}
          </PerLang>
        </LangProvider>
      </section>

      <SaveBar pending={pending} state={state} hint="Une langue laissée vide reprend le nom français." />
    </form>
  );
}
