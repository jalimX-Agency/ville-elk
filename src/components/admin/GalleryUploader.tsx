"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addGalleryImages } from "@/app/admin/actions";
import { CATEGORY_OPTIONS } from "./gallery-categories";

/**
 * Several photographs at once, because a shoot arrives as a folder. Each file
 * is uploaded on its own so one failure does not lose the rest, and the URLs
 * are recorded in one go at the end.
 */
export function GalleryUploader() {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [failed, setFailed] = useState<string[]>([]);
  const [saving, startSaving] = useTransition();
  const [category, setCategory] = useState<string>("rdc");

  async function upload(files: File[]) {
    setBusy(true);
    setFailed([]);
    setProgress({ done: 0, total: files.length });

    const urls: string[] = [];
    const errors: string[] = [];

    for (const [index, file] of files.entries()) {
      const body = new FormData();
      body.set("file", file);
      body.set("folder", "galerie");
      try {
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const result = (await response.json()) as { url?: string; error?: string };
        if (response.ok && result.url) urls.push(result.url);
        else errors.push(`${file.name} — ${result.error ?? "échec"}`);
      } catch {
        errors.push(`${file.name} — échec de l'envoi`);
      }
      setProgress({ done: index + 1, total: files.length });
    }

    setFailed(errors);
    setBusy(false);
    if (input.current) input.current.value = "";

    if (urls.length > 0) {
      const form = new FormData();
      form.set("category", category);
      for (const url of urls) form.append("imageUrl", url);
      startSaving(async () => {
        await addGalleryImages({}, form);
        setProgress(null);
        router.refresh();
      });
    } else {
      setProgress(null);
    }
  }

  const working = busy || saving;

  return (
    <div className="border border-dashed border-border p-6">
      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) void upload(files);
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Espace</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={working}
            className="field-input h-11 w-auto py-0"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={working}
          onClick={() => input.current?.click()}
          className="admin-button"
        >
          {working ? "Envoi…" : "Ajouter des photos"}
        </button>
      </div>

      {progress && (
        <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
          {progress.done} / {progress.total}
        </p>
      )}

      <p className="mt-3 text-sm text-muted-foreground">
        JPEG, PNG, WebP ou AVIF — 20 Mo par photo. Pensez à écrire la
        description de chaque photo ensuite.
      </p>

      {failed.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 text-sm text-[var(--terracotta-dark)]">
          {failed.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
