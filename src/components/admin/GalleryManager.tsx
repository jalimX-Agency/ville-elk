"use client";

import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2, X } from "lucide-react";
import {
  deleteGalleryImage,
  moveGalleryImage,
  saveGalleryAlt,
  toggleGalleryImage,
  type GalleryAltState,
} from "@/app/admin/actions";
import { CATEGORY_OPTIONS } from "./gallery-categories";
import { LangProvider, PerLang } from "./LangTabs";
import { SaveBar } from "./SaveBar";

export type AdminPhoto = {
  id: string;
  imageUrl: string;
  category: string;
  suiteId: string | null;
  /** Its part of the suite (bedroom, bathroom…); only meaningful with a suite. */
  suiteSpace?: string | null;
  published: boolean;
  altFr: string;
  altEn: string;
  altEs: string;
  altAr: string;
};

type Filter = "all" | "missing" | "hidden" | (typeof CATEGORY_OPTIONS)[number]["value"];

const PAGE = 30;

/**
 * The gallery as pictures, not forms: a grid filtered by space, where a tap
 * opens everything about one photograph. 131 photos as 131 inline forms was
 * unusable on a phone.
 */
export function GalleryManager({
  photos,
  suites,
}: {
  photos: AdminPhoto[];
  suites: { id: string; name: string }[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE);
  const [openId, setOpenId] = useState<string | null>(null);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "Toutes", count: photos.length },
    ...CATEGORY_OPTIONS.map((c) => ({ id: c.value, label: c.label, count: photos.filter((p) => p.category === c.value).length })),
    { id: "missing", label: "Sans description", count: photos.filter((p) => !p.altFr.trim()).length },
    { id: "hidden", label: "Masquées", count: photos.filter((p) => !p.published).length },
  ];

  const shown = useMemo(() => {
    if (filter === "all") return photos;
    if (filter === "missing") return photos.filter((p) => !p.altFr.trim());
    if (filter === "hidden") return photos.filter((p) => !p.published);
    return photos.filter((p) => p.category === filter);
  }, [photos, filter]);

  const openPhoto = photos.find((p) => p.id === openId) ?? null;
  const position = openPhoto ? photos.findIndex((p) => p.id === openPhoto.id) : -1;

  return (
    <>
      <div role="group" aria-label="Filtrer" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters
          .filter((f) => f.count > 0 || f.id === "all")
          .map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => {
                setFilter(f.id);
                setVisible(PAGE);
              }}
              className="admin-tab admin-chip shrink-0"
            >
              {f.label}
              <span className="tabular-nums opacity-70">{f.count}</span>
            </button>
          ))}
      </div>

      {shown.length === 0 ? (
        <p className="admin-card mt-4 p-8 text-center text-muted-foreground">Aucune photo ici.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.slice(0, visible).map((photo) => (
            <li key={photo.id}>
              <button
                type="button"
                onClick={() => setOpenId(photo.id)}
                className="admin-card group block w-full overflow-hidden text-start"
              >
                <span className="relative block aspect-[4/3] bg-muted">
                  <Image src={photo.imageUrl} alt="" fill sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, 45vw" className="object-cover" />
                  {!photo.published && (
                    <span className="absolute start-2 top-2 admin-pill admin-pill-off">Masquée</span>
                  )}
                </span>
                <span className="block px-3 py-2.5">
                  <span className={"block truncate text-sm " + (photo.altFr ? "" : "font-medium text-[#8f3d22]")}>
                    {photo.altFr || "Sans description"}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {CATEGORY_OPTIONS.find((c) => c.value === photo.category)?.label}
                    {photo.suiteId && ` · ${suites.find((s) => s.id === photo.suiteId)?.name ?? ""}`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {shown.length > visible && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="admin-button-quiet">
            Afficher plus ({shown.length - visible} restantes)
          </button>
        </div>
      )}

      <Dialog.Root open={openPhoto !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#15120f]/50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="admin-app fixed inset-y-0 end-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto bg-[var(--admin-bg)] shadow-2xl outline-none"
          >
            {openPhoto && (
              <PhotoPanel
                key={openPhoto.id}
                photo={openPhoto}
                suites={suites}
                first={position === 0}
                last={position === photos.length - 1}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function PhotoPanel({
  photo,
  suites,
  first,
  last,
}: {
  photo: AdminPhoto;
  suites: { id: string; name: string }[];
  first: boolean;
  last: boolean;
}) {
  const [state, action, pending] = useActionState<GalleryAltState, FormData>(saveGalleryAlt, {});

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <Dialog.Title className="font-semibold">Photo</Dialog.Title>
        <Dialog.Close aria-label="Fermer" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </div>

      <div className="relative aspect-[3/2] bg-muted">
        <Image src={photo.imageUrl} alt="" fill sizes="512px" className="object-contain" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border bg-card p-4">
        <form action={moveGalleryImage}>
          <input type="hidden" name="id" value={photo.id} />
          <input type="hidden" name="direction" value="up" />
          <button type="submit" disabled={first} className="admin-button-quiet">
            <ArrowUp className="h-4 w-4" /> Avant
          </button>
        </form>
        <form action={moveGalleryImage}>
          <input type="hidden" name="id" value={photo.id} />
          <input type="hidden" name="direction" value="down" />
          <button type="submit" disabled={last} className="admin-button-quiet">
            <ArrowDown className="h-4 w-4" /> Après
          </button>
        </form>
        <form action={toggleGalleryImage}>
          <input type="hidden" name="id" value={photo.id} />
          <button type="submit" className="admin-button-quiet">
            {photo.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {photo.published ? "Masquer" : "Publier"}
          </button>
        </form>
        <span className={"admin-pill self-center " + (photo.published ? "admin-pill-live" : "admin-pill-off")}>
          {photo.published ? "En ligne" : "Masquée"}
        </span>
      </div>

      <form action={action} className="flex-1 space-y-5 p-4">
        <input type="hidden" name="id" value={photo.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Espace</span>
            <select name="category" defaultValue={photo.category} className="field-input mt-1.5 h-11">
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Suite</span>
            <select name="suiteId" defaultValue={photo.suiteId ?? ""} className="field-input mt-1.5 h-11">
              <option value="">Aucune</option>
              {suites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <p className="field-label">Description de la photo</p>
          <p className="mb-3 text-sm text-muted-foreground">Lue par Google et les lecteurs d&apos;écran, et affichée sous la photo agrandie.</p>
          <LangProvider sticky={false}>
            <PerLang>
              {(lang) => {
                const key = `alt${lang.code[0].toUpperCase()}${lang.code.slice(1)}` as "altFr" | "altEn" | "altEs" | "altAr";
                return (
                  <>
                    <input
                      name={key}
                      dir={lang.dir}
                      aria-label={`Description — ${lang.label}`}
                      defaultValue={photo[key]}
                      placeholder={lang.code === "fr" ? "Ex. : La piscine au coucher du soleil" : ""}
                      required={lang.code === "fr"}
                      className="field-input"
                    />
                    {lang.code !== "fr" && photo.altFr && (
                      <p className="mt-1.5 text-sm text-muted-foreground">FR : {photo.altFr}</p>
                    )}
                  </>
                );
              }}
            </PerLang>
          </LangProvider>
        </div>

        <SaveBar pending={pending} state={state} label="Enregistrer" />
      </form>

      <details className="m-4 mt-0 rounded-lg border border-[#e8cfc4] bg-card p-4">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-[#8f3d22]">
          <Trash2 className="h-4 w-4" /> Supprimer cette photo
        </summary>
        <form action={deleteGalleryImage} className="mt-2 flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={photo.id} />
          <p className="text-sm text-muted-foreground">Définitif : la photo est retirée du site et du stockage.</p>
          <button type="submit" className="admin-button bg-[#8f3d22] hover:bg-[#6f2e19]">
            Oui, supprimer
          </button>
        </form>
      </details>
    </>
  );
}
