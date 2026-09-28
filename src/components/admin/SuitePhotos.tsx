"use client";

import { useActionState, useMemo, useOptimistic, useState, useTransition } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ImagePlus,
  Link2Off,
  Star,
  X,
} from "lucide-react";
import { saveGalleryAlt, toggleGalleryImage, type GalleryAltState } from "@/app/admin/actions";
import {
  addPhotosToSuite,
  removePhotoFromSuite,
  reorderSuitePhotos,
  setSuiteCover,
  setSuitePhotoSpace,
} from "@/app/admin/suite-photo-actions";
import type { AdminPhoto } from "./GalleryManager";
import { CATEGORY_OPTIONS, SPACE_OPTIONS } from "./gallery-categories";
import { isSuiteSpace, sortBySpace } from "@/lib/content/types";
import { GalleryUploader } from "./GalleryUploader";
import { SpaceSelect } from "./SpaceSelect";
import { LangProvider, PerLang } from "./LangTabs";
import { SaveBar } from "./SaveBar";

export type LibraryPhoto = {
  id: string;
  imageUrl: string;
  category: string;
  altFr: string;
  suiteName: string | null;
};

const PAGE = 30;

const spaceOf = (photo: AdminPhoto) => (photo.suiteSpace && isSuiteSpace(photo.suiteSpace) ? photo.suiteSpace : null);

/**
 * The photographs of one suite, on the suite's own page: the carousel in
 * order, arrows to rearrange it, and a picker to bring in photos from the
 * gallery — instead of opening each gallery photo to tick its suite.
 */
export function SuitePhotos({
  suiteId,
  suiteName,
  coverUrl,
  photos,
  library,
}: {
  suiteId: string;
  suiteName: string;
  coverUrl: string | null;
  photos: AdminPhoto[];
  library: LibraryPhoto[];
}) {
  const [ordered, setOrdered] = useOptimistic(photos, (_state, next: AdminPhoto[]) => next);
  const [, startTransition] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  // The page shows the photos part by part; each part is a run in `ordered`.
  const groups = [...SPACE_OPTIONS, { value: null, label: "Non classées" }]
    .map((group) => ({
      ...group,
      items: ordered.flatMap((photo, index) => (spaceOf(photo) === group.value ? [{ photo, index }] : [])),
    }))
    .filter((group) => group.items.length > 0);

  function reorder(next: AdminPhoto[]) {
    startTransition(async () => {
      setOrdered(next);
      await reorderSuitePhotos(suiteId, next.map((photo) => photo.id));
    });
  }

  /** Moves a photo within its part; `to` is an index in the whole list. */
  function move(index: number, to: number) {
    if (to < 0 || to >= ordered.length || index === to) return;
    if (spaceOf(ordered[to]) !== spaceOf(ordered[index])) return;
    const next = [...ordered];
    const [photo] = next.splice(index, 1);
    next.splice(to, 0, photo);
    reorder(next);
  }

  function changeSpace(photo: AdminPhoto, space: string) {
    const suiteSpace = space || null;
    startTransition(async () => {
      // Same rule as the server: it joins the end of its new part.
      setOrdered(sortBySpace([...ordered.filter((p) => p.id !== photo.id), { ...photo, suiteSpace }], spaceOf));
      await setSuitePhotoSpace(suiteId, photo.id, suiteSpace);
    });
  }

  const openIndex = ordered.findIndex((photo) => photo.id === openId);
  const openPhoto = openIndex >= 0 ? ordered[openIndex] : null;
  const openGroupStart = openPhoto ? ordered.findIndex((photo) => spaceOf(photo) === spaceOf(openPhoto)) : -1;
  const unsorted = ordered.filter((photo) => !spaceOf(photo)).length;

  return (
    <section className="admin-card p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold">
            Photos de la page <span className="font-normal text-muted-foreground">· {ordered.length}</span>
          </h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Rangées par partie de la suite, comme sur le site. Le menu sous
            chaque photo change sa partie, les flèches son ordre ; « Gérer »
            ouvre les autres réglages.
          </p>
        </div>
        <button type="button" onClick={() => setPicking(true)} className="admin-button">
          <ImagePlus className="h-4 w-4" />
          Ajouter depuis la galerie
        </button>
      </div>

      {unsorted > 0 && (
        <p role="status" className="mt-4 rounded-lg bg-[#f7e1d8] px-4 py-3 text-sm text-[#8f3d22]">
          {unsorted === 1
            ? "1 photo n'est pas classée : sur le site, elle s'affiche à la fin, sous « Autres »."
            : `${unsorted} photos ne sont pas classées : sur le site, elles s'affichent à la fin, sous « Autres ».`}
        </p>
      )}

      {ordered.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          Aucune photo pour cette suite. Ajoutez-en depuis la galerie ou envoyez-en de nouvelles.
        </p>
      ) : (
        groups.map((group) => (
          <div key={group.value ?? "none"} className="mt-6">
            <h3 className="mb-3 flex items-baseline gap-2 border-b border-border pb-2 font-semibold">
              {group.label}
              <span className="text-sm font-normal text-muted-foreground tabular-nums">{group.items.length}</span>
            </h3>
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {group.items.map(({ photo, index }, i) => (
                <li key={photo.id} className="overflow-hidden rounded-lg border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpenId(photo.id)}
                    aria-label={`Photo ${index + 1} : ${photo.altFr || "sans description"}`}
                    className="relative block aspect-[4/3] w-full bg-muted"
                  >
                    <Image src={photo.imageUrl} alt="" fill sizes="(min-width: 1280px) 16vw, (min-width: 640px) 28vw, 45vw" className="object-cover" />
                    <span className="absolute start-2 top-2 grid h-7 min-w-7 place-items-center rounded-full bg-[#15120f]/75 px-2 text-sm font-semibold tabular-nums text-white">
                      {index + 1}
                    </span>
                    <span className="absolute inset-x-2 bottom-2 flex flex-wrap gap-1">
                      {photo.imageUrl === coverUrl && <span className="admin-pill admin-pill-new">Principale</span>}
                      {!photo.published && <span className="admin-pill admin-pill-off">Masquée</span>}
                      {!photo.altFr.trim() && <span className="admin-pill admin-pill-warn">Sans description</span>}
                    </span>
                  </button>
                  <label className="block border-b border-border">
                    <span className="sr-only">Partie de la suite — photo {index + 1}</span>
                    <select
                      value={spaceOf(photo) ?? ""}
                      onChange={(event) => changeSpace(photo, event.target.value)}
                      className="h-11 w-full cursor-pointer bg-transparent px-3 text-sm font-medium outline-none hover:bg-muted focus-visible:bg-muted"
                    >
                      {SPACE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      <option value="">Non classée</option>
                    </select>
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => move(index, index - 1)}
                      disabled={i === 0}
                      aria-label={`Avancer la photo ${index + 1}`}
                      className="grid h-11 w-12 place-items-center text-foreground hover:bg-muted disabled:opacity-25"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenId(photo.id)}
                      className="h-11 flex-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Gérer
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, index + 1)}
                      disabled={i === group.items.length - 1}
                      aria-label={`Reculer la photo ${index + 1}`}
                      className="grid h-11 w-12 place-items-center text-foreground hover:bg-muted disabled:opacity-25"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))
      )}

      <div className="mt-6">
        <GalleryUploader suiteId={suiteId} />
      </div>

      <Dialog.Root open={openPhoto !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#15120f]/50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="admin-app fixed inset-y-0 end-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto bg-[var(--admin-bg)] shadow-2xl outline-none"
          >
            {openPhoto && (
              <PhotoSheet
                key={openPhoto.id}
                suiteId={suiteId}
                suiteName={suiteName}
                photo={openPhoto}
                index={openIndex}
                total={ordered.length}
                isCover={openPhoto.imageUrl === coverUrl}
                toFirst={() => move(openIndex, openGroupStart)}
                spaceLabel={SPACE_OPTIONS.find((o) => o.value === spaceOf(openPhoto))?.label ?? null}
                onRemoved={() => setOpenId(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={picking} onOpenChange={setPicking}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#15120f]/50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="admin-app fixed inset-0 z-50 flex flex-col bg-[var(--admin-bg)] shadow-2xl outline-none sm:inset-6 sm:rounded-xl lg:inset-x-[10vw]"
          >
            {picking && (
              <Picker
                suiteId={suiteId}
                suiteName={suiteName}
                library={library}
                onDone={() => setPicking(false)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

function PhotoSheet({
  suiteId,
  suiteName,
  photo,
  index,
  total,
  isCover,
  toFirst,
  spaceLabel,
  onRemoved,
}: {
  suiteId: string;
  suiteName: string;
  photo: AdminPhoto;
  index: number;
  total: number;
  isCover: boolean;
  toFirst: () => void;
  spaceLabel: string | null;
  onRemoved: () => void;
}) {
  const [state, action, pending] = useActionState<GalleryAltState, FormData>(saveGalleryAlt, {});
  const [working, startWorking] = useTransition();

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <Dialog.Title className="font-semibold">
          Photo {index + 1} <span className="font-normal text-muted-foreground">sur {total}</span>
        </Dialog.Title>
        <Dialog.Close aria-label="Fermer" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </div>

      <div className="relative aspect-[3/2] shrink-0 bg-muted">
        <Image src={photo.imageUrl} alt="" fill sizes="512px" className="object-contain" />
      </div>

      <div className="space-y-2 border-b border-border bg-card p-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={toFirst} className="admin-button-quiet">
            <ChevronLeft className="h-4 w-4" /> {spaceLabel ? `Première de « ${spaceLabel} »` : "Mettre en premier"}
          </button>
          {isCover ? (
            <span className="admin-pill admin-pill-new self-center">Photo principale de la suite</span>
          ) : (
            <button
              type="button"
              disabled={working}
              onClick={() => startWorking(() => setSuiteCover(suiteId, photo.id))}
              className="admin-button-quiet"
            >
              <Star className="h-4 w-4" /> Photo principale
            </button>
          )}
          <form action={toggleGalleryImage}>
            <input type="hidden" name="id" value={photo.id} />
            <button type="submit" className="admin-button-quiet">
              {photo.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {photo.published ? "Masquer" : "Publier"}
            </button>
          </form>
        </div>
        <p className="text-sm text-muted-foreground">
          « Photo principale » : celle de la suite sur la page Suites.
          {!photo.published && " Cette photo est masquée : elle n'apparaît nulle part sur le site."}
        </p>
      </div>

      <form action={action} className="space-y-5 p-4">
        <input type="hidden" name="id" value={photo.id} />
        <input type="hidden" name="category" value={photo.category} />
        <input type="hidden" name="suiteId" value={suiteId} />
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
                      placeholder={lang.code === "fr" ? `Ex. : ${suiteName}, le lit face au jardin` : ""}
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

      <div className="mt-auto border-t border-border p-4">
        <button
          type="button"
          disabled={working}
          onClick={() =>
            startWorking(async () => {
              await removePhotoFromSuite(suiteId, photo.id);
              onRemoved();
            })
          }
          className="admin-button-quiet text-[#8f3d22]"
        >
          <Link2Off className="h-4 w-4" /> Retirer de cette suite
        </button>
        <p className="mt-1 text-sm text-muted-foreground">La photo reste dans la galerie.</p>
      </div>
    </>
  );
}

type PickerFilter = "all" | (typeof CATEGORY_OPTIONS)[number]["value"];

function Picker({
  suiteId,
  suiteName,
  library,
  onDone,
}: {
  suiteId: string;
  suiteName: string;
  library: LibraryPhoto[];
  onDone: () => void;
}) {
  const [filter, setFilter] = useState<PickerFilter>(library.some((p) => p.category === "suites") ? "suites" : "all");
  const [visible, setVisible] = useState(PAGE);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, startSaving] = useTransition();
  const [space, setSpace] = useState<string>("");

  const shown = useMemo(
    () =>
      // Photos no suite uses yet are the likeliest picks, so they come first.
      (filter === "all" ? [...library] : library.filter((p) => p.category === filter)).sort((a, b) => Number(a.suiteName !== null) - Number(b.suiteName !== null)),
    [library, filter],
  );
  const fromOtherSuites = library.filter((p) => selected.includes(p.id) && p.suiteName).length;

  const filters: { id: PickerFilter; label: string; count: number }[] = [
    ...CATEGORY_OPTIONS.map((c) => ({ id: c.value, label: c.label, count: library.filter((p) => p.category === c.value).length })),
    { id: "all", label: "Toutes", count: library.length },
  ];

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2 sm:rounded-t-xl">
        <Dialog.Title className="min-w-0 truncate font-semibold">Ajouter à « {suiteName} »</Dialog.Title>
        <Dialog.Close aria-label="Fermer" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg hover:bg-muted">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 text-sm text-muted-foreground">
          Touchez les photos à ajouter, choisissez en bas la partie de la suite où elles vont, puis validez.
        </p>
        <div role="group" aria-label="Filtrer" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {filters
            .filter((f) => f.count > 0)
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
          <p className="mt-4 p-8 text-center text-muted-foreground">
            Toutes les photos de la galerie sont déjà dans cette suite.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {shown.slice(0, visible).map((photo) => {
              const on = selected.includes(photo.id);
              return (
                <li key={photo.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(photo.id)}
                    className={
                      "block w-full overflow-hidden rounded-lg border-2 bg-card text-start transition-colors " +
                      (on ? "border-[var(--terracotta)]" : "border-transparent")
                    }
                  >
                    <span className="relative block aspect-[4/3] bg-muted">
                      <Image src={photo.imageUrl} alt="" fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw" className="object-cover" />
                      <span
                        className={
                          "absolute end-2 top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-white " +
                          (on ? "bg-[var(--terracotta)] text-white" : "bg-[#15120f]/30")
                        }
                      >
                        {on && <Check className="h-4 w-4" strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="block px-2.5 py-2">
                      <span className="block truncate text-sm">{photo.altFr || "Sans description"}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {photo.suiteName ? `Dans : ${photo.suiteName}` : CATEGORY_OPTIONS.find((c) => c.value === photo.category)?.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {shown.length > visible && (
          <div className="mt-6 text-center">
            <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="admin-button-quiet">
              Afficher plus ({shown.length - visible} restantes)
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card p-4 sm:rounded-b-xl">
        {fromOtherSuites > 0 && (
          <p className="mb-2 text-sm text-[#8f3d22]">
            {fromOtherSuites === 1 ? "1 photo choisie est" : `${fromOtherSuites} photos choisies sont`} dans une autre
            suite : elle{fromOtherSuites > 1 ? "s" : ""} passera{fromOtherSuites > 1 ? "nt" : ""} dans celle-ci.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            {selected.length === 0 ? "Aucune photo choisie" : `${selected.length} choisie${selected.length > 1 ? "s" : ""}`}
          </span>
          <label className="ms-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Dans</span>
            <SpaceSelect value={space} onChange={setSpace} />
          </label>
          <button
            type="button"
            disabled={selected.length === 0 || saving}
            onClick={() =>
              startSaving(async () => {
                await addPhotosToSuite(suiteId, selected, space || null);
                onDone();
              })
            }
            className="admin-button"
          >
            {saving ? "Ajout…" : `Ajouter${selected.length ? ` ${selected.length}` : ""} à la suite`}
          </button>
        </div>
      </div>
    </>
  );
}
