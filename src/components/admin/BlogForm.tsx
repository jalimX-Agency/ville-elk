"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createBlogPost, saveBlogPost, type BlogState } from "@/app/admin/blog-actions";
import { ImageField } from "./ImageField";
import { LangProvider, PerLang } from "./LangTabs";
import { SaveBar } from "./SaveBar";

type Values = {
  id: string;
  slug: string;
  published: boolean;
  publishedAt: string;
  imageUrl: string | null;
  titleFr: string;
  titleEn: string;
  titleEs: string;
  titleAr: string;
  excerptFr: string;
  excerptEn: string;
  excerptEs: string;
  excerptAr: string;
  bodyFr: string;
  bodyEn: string;
  bodyEs: string;
  bodyAr: string;
  altFr: string;
  altEn: string;
  altEs: string;
  altAr: string;
};

const suffix = (code: string) => (code[0].toUpperCase() + code.slice(1)) as "Fr" | "En" | "Es" | "Ar";

export function BlogForm({ post }: { post: Values }) {
  const [state, action, pending] = useActionState<BlogState, FormData>(saveBlogPost, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={post.id} />

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="admin-card p-4 sm:p-6 lg:col-span-3">
          <h2 className="font-semibold">Photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">L&apos;image en haut de l&apos;article, au format paysage.</p>
          <ImageField name="imageUrl" folder="blog" initialUrl={post.imageUrl} />
        </section>

        <section className="admin-card space-y-4 p-4 sm:p-6 lg:col-span-2">
          <h2 className="font-semibold">Publication</h2>
          <label className="flex items-center gap-3">
            <input name="published" type="checkbox" defaultChecked={post.published} className="h-5 w-5 accent-[#b4684a]" />
            <span className="field-label">Publié sur le site</span>
          </label>
          <label className="block">
            <span className="field-label">Date de publication</span>
            <input name="publishedAt" type="date" defaultValue={post.publishedAt} className="field-input mt-1.5" />
            <span className="mt-1 block text-sm text-muted-foreground">Une date à venir cache l&apos;article jusqu&apos;à ce jour.</span>
          </label>
          <p className="text-sm text-muted-foreground">
            Adresse : <span className="font-mono">/blog/{post.slug}</span>
          </p>
        </section>
      </div>

      <section className="admin-card p-4 sm:p-6">
        <h2 className="mb-4 font-semibold">Textes</h2>
        <LangProvider>
          <PerLang>
            {(lang) => {
              const s = suffix(lang.code);
              const reference = (text: string) =>
                lang.code !== "fr" && text ? <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">FR : {text}</p> : null;
              return (
                <div className="space-y-5">
                  <label className="block">
                    <span className="field-label">
                      Titre {lang.code === "fr" && <span className="text-[#8f3d22]">*</span>}
                    </span>
                    <input name={`title${s}`} dir={lang.dir} defaultValue={post[`title${s}`]} required={lang.code === "fr"} className="field-input mt-1.5" />
                    {reference(post.titleFr)}
                  </label>
                  <label className="block">
                    <span className="field-label">Résumé</span>
                    <span className="block text-sm text-muted-foreground">Deux phrases : c&apos;est le texte de la carte et celui que Google affiche.</span>
                    <textarea name={`excerpt${s}`} dir={lang.dir} rows={3} defaultValue={post[`excerpt${s}`]} className="field-input mt-1.5 resize-y" />
                    {reference(post.excerptFr)}
                  </label>
                  <label className="block">
                    <span className="field-label">Texte de l&apos;article</span>
                    <span className="block whitespace-pre-line text-sm text-muted-foreground">
                      {"Séparez les paragraphes par une ligne vide.\n## Titre de partie  ·  - élément de liste  ·  **gras**  ·  [texte](https://…)\nLien vers une page du site : [Réserver](page:booking) — pages : booking, suites, gallery, activities, concierge, contact."}
                    </span>
                    <textarea name={`body${s}`} dir={lang.dir} rows={18} defaultValue={post[`body${s}`]} className="field-input mt-1.5 resize-y font-mono text-[0.9rem] leading-relaxed" />
                    {reference(post.bodyFr)}
                  </label>
                  <label className="block">
                    <span className="field-label">Description de la photo</span>
                    <input name={`alt${s}`} dir={lang.dir} defaultValue={post[`alt${s}`]} className="field-input mt-1.5" />
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

/** One line to start an article; its page opens right after. */
export function CreateBlogForm() {
  const [state, action, pending] = useActionState<BlogState, FormData>(createBlogPost, {});
  return (
    <form action={action} className="admin-card mt-4 flex flex-wrap items-end gap-3 border-dashed p-4 sm:p-5">
      <p className="w-full font-semibold">Écrire un article</p>
      <label className="block min-w-56 flex-1">
        <span className="text-sm text-muted-foreground">Titre en français — le reste se remplit ensuite</span>
        <input name="titleFr" required className="field-input mt-1.5" />
      </label>
      <button type="submit" disabled={pending} className="admin-button">
        <Plus className="h-4 w-4" />
        {pending ? "…" : "Commencer"}
      </button>
      {state.error && (
        <p role="alert" className="w-full text-sm text-[#8f3d22]">
          {state.error}
        </p>
      )}
      <p className="w-full text-sm text-muted-foreground">Un nouvel article reste masqué jusqu&apos;à ce que vous le publiiez.</p>
    </form>
  );
}
