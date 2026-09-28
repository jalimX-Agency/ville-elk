/**
 * Sends one photograph to /api/admin/upload.
 *
 * Vercel refuses request bodies over 4.5 MB before our code ever runs, and a
 * photograph straight off the photographer's camera is often 8–15 MB. Those
 * are redrawn in the browser first — at most 3200 px on the long side, which
 * is still sharper than any screen the site is shown on.
 */
const LIMIT = 4 * 1024 * 1024;
const LONG_SIDE = 3200;

async function shrink(file: File): Promise<Blob> {
  if (file.size <= LIMIT) return file;

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, LONG_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  for (const quality of [0.9, 0.82, 0.74, 0.66]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= LIMIT) return blob;
  }
  throw new Error("too-large");
}

export async function uploadPhoto(file: File, folder: string): Promise<{ url: string } | { error: string }> {
  let blob: Blob;
  try {
    blob = await shrink(file);
  } catch {
    return { error: "Photo trop lourde, même réduite. Essayez une photo plus petite." };
  }

  const body = new FormData();
  body.set("file", blob, file.name);
  body.set("folder", folder);

  let response: Response;
  try {
    response = await fetch("/api/admin/upload", { method: "POST", body });
  } catch {
    return { error: "L'envoi a échoué. Vérifiez votre connexion." };
  }

  // An error page from the host is HTML, not JSON; say something useful anyway.
  const result = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
  if (response.ok && result.url) return { url: result.url };
  if (response.status === 413) return { error: "Photo trop lourde pour le serveur." };
  if (response.status === 401) return { error: "Votre session a expiré. Reconnectez-vous." };
  return { error: result.error ?? `L'envoi a échoué (erreur ${response.status}).` };
}
