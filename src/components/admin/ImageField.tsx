"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/**
 * The owner picks a file; it goes straight to storage and the returned URL is
 * carried in a hidden input, so the surrounding form saves exactly as before.
 */
export function ImageField({
  name,
  folder,
  initialUrl,
}: {
  name: string;
  folder: string;
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("folder", folder);

      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        setError(result.error ?? "L'envoi a échoué.");
        return;
      }
      setUrl(result.url);
    } catch {
      setError("L'envoi a échoué. Vérifiez votre connexion.");
    } finally {
      setUploading(false);
      // Let the same file be chosen again after a failure.
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-start gap-5">
      <input type="hidden" name={name} value={url} />

      <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden border border-border bg-muted">
        {url ? (
          <Image src={url} alt="" fill sizes="112px" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center px-2 text-center text-xs text-muted-foreground">
            Aucune photo
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => input.current?.click()}
            className="admin-button-quiet"
          >
            {uploading ? "Envoi…" : url ? "Remplacer la photo" : "Choisir une photo"}
          </button>

          {url && !uploading && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="admin-button-quiet"
            >
              Retirer
            </button>
          )}
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          JPEG, PNG, WebP ou AVIF — 20 Mo maximum. La photo n&apos;apparaît sur
          le site qu&apos;après avoir enregistré.
        </p>

        {error && (
          <p role="alert" className="mt-2 text-sm text-[var(--terracotta-dark)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
