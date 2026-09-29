"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createActivity, saveActivity, type ActivityState } from "@/app/admin/activity-actions";
import { ImageField } from "./ImageField";
import { LangProvider, PerLang } from "./LangTabs";
import { SaveBar } from "./SaveBar";

type Values = {
  id: string;
  category: string;
  minutes: number;
  nameFr: string;
  nameEn: string;
  nameEs: string;
  nameAr: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionAr: string;
  imageUrl: string | null;
  imageCredit: string;
  altFr: string;
  altEn: string;
  altEs: string;
  altAr: string;
  websiteUrl: string;
  mapsQuery: string;
};

export const ACTIVITY_CATEGORY_LABELS: Record<string, string> = {
  golf: "Golf",
  loisirs: "Sport & loisirs",
  aquatique: "Parcs aquatiques",
  restauration: "Se restaurer",
};

const suffix = (code: string) => (code[0].toUpperCase() + code.slice(1)) as "Fr" | "En" | "Es" | "Ar";

export function ActivityForm({ activity }: { activity: Values }) {
  const [state, action, pending] = useActionState<ActivityState, FormData>(saveActivity, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={activity.id} />

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="admin-card p-4 sm:p-6 lg:col-span-3">
          <h2 className="font-semibold">Photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activity.imageCredit
              ? `Photo d'illustration (${activity.imageCredit}). Remplacez-la par une photo du lieu si vous en avez une.`
              : "La photo de la carte, au format paysage."}
          </p>
          <ImageField name="imageUrl" folder="activites" initialUrl={activity.imageUrl} />
        </section>

        <section className="admin-card space-y-4 p-4 sm:p-6 lg:col-span-2">
          <h2 className="font-semibold">Informations</h2>
          <label className="block">
            <span className="field-label">Catégorie</span>
            <select name="category" defaultValue={activity.category} className="field-input mt-1.5 h-11">
              {Object.entries(ACTIVITY_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Minutes en voiture depuis la villa</span>
            <input name="minutes" type="number" inputMode="numeric" min={1} max={240} defaultValue={activity.minutes} className="field-input mt-1.5" />
          </label>
          <label className="block">
            <span className="field-label">Site officiel (facultatif)</span>
            <input name="websiteUrl" inputMode="url" defaultValue={activity.websiteUrl} placeholder="https://…" className="field-input mt-1.5" />
          </label>
          <label className="block">
            <span className="field-label">Recherche Google Maps</span>
            <span className="block text-sm text-muted-foreground">Ce que le bouton « Itinéraire » cherche, ex. : Oasiria Water Park Marrakech</span>
            <input name="mapsQuery" defaultValue={activity.mapsQuery} className="field-input mt-1.5" />
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
                lang.code !== "fr" && text ? <p className="mt-1.5 text-sm text-muted-foreground">FR : {text}</p> : null;
              return (
                <div className="space-y-5">
                  <label className="block">
                    <span className="field-label">
                      Nom {lang.code === "fr" && <span className="text-[#8f3d22]">*</span>}
                    </span>
                    <input
                      name={`name${s}`}
                      dir={lang.dir}
                      defaultValue={activity[`name${s}`]}
                      required={lang.code === "fr"}
                      className="field-input mt-1.5"
                    />
                    {reference(activity.nameFr)}
                  </label>
                  <label className="block">
                    <span className="field-label">Description</span>
                    <span className="block text-sm text-muted-foreground">Une ou deux phrases.</span>
                    <textarea
                      name={`description${s}`}
                      dir={lang.dir}
                      rows={3}
                      defaultValue={activity[`description${s}`]}
                      className="field-input mt-1.5 resize-y"
                    />
                    {reference(activity.descriptionFr)}
                  </label>
                  <label className="block">
                    <span className="field-label">Description de la photo</span>
                    <span className="block text-sm text-muted-foreground">Lue par Google et les lecteurs d&apos;écran.</span>
                    <input name={`alt${s}`} dir={lang.dir} defaultValue={activity[`alt${s}`]} className="field-input mt-1.5" />
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

/** One line to add a place; its page opens right after. */
export function CreateActivityForm() {
  const [state, action, pending] = useActionState<ActivityState, FormData>(createActivity, {});
  return (
    <form action={action} className="admin-card mt-4 flex flex-wrap items-end gap-3 border-dashed p-4 sm:p-5">
      <p className="w-full font-semibold">Ajouter une activité</p>
      <label className="block min-w-56 flex-1">
        <span className="text-sm text-muted-foreground">Nom du lieu — le reste se remplit ensuite</span>
        <input name="nameFr" required className="field-input mt-1.5" />
      </label>
      <button type="submit" disabled={pending} className="admin-button">
        <Plus className="h-4 w-4" />
        {pending ? "…" : "Ajouter"}
      </button>
      {state.error && (
        <p role="alert" className="w-full text-sm text-[#8f3d22]">
          {state.error}
        </p>
      )}
      <p className="w-full text-sm text-muted-foreground">Une nouvelle activité reste masquée jusqu&apos;à ce que vous la publiiez.</p>
    </form>
  );
}
