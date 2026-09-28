"use client";

import { useRef, useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { replaceGalleryImage } from "@/app/admin/actions";
import { uploadPhoto } from "./upload";

/**
 * Swaps the picture of a gallery photo and keeps everything else about it:
 * its descriptions in four languages, its space, its suite and its place.
 */
export function ReplacePhotoButton({ photoId }: { photoId: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function replace(file: File) {
    setError(null);
    setBusy(true);
    const result = await uploadPhoto(file, "galerie");
    setBusy(false);
    if (input.current) input.current.value = "";
    if ("error" in result) {
      setError(result.error);
      return;
    }
    startSaving(async () => {
      const outcome = await replaceGalleryImage(photoId, result.url);
      if (outcome?.error) setError(outcome.error);
    });
  }

  const working = busy || saving;

  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void replace(file);
        }}
      />
      <button type="button" disabled={working} onClick={() => input.current?.click()} className="admin-button-quiet">
        <RefreshCw className={"h-4 w-4 " + (working ? "animate-spin" : "")} />
        {working ? "Envoi…" : "Remplacer la photo"}
      </button>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-[#8f3d22]">
          {error}
        </p>
      )}
    </div>
  );
}
