import { auth } from "@/auth";
import { identifyImage, uploadImage, MAX_UPLOAD_BYTES } from "@/lib/storage/r2";

/**
 * A Route Handler rather than a Server Action: actions cap their request body
 * at 1 MB, and a photograph off a real camera is many times that.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: `Image trop lourde (maximum ${MAX_UPLOAD_BYTES / 1024 / 1024} Mo).` },
      { status: 413 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = identifyImage(bytes);
  if (!kind) {
    return Response.json(
      { error: "Format non reconnu. Utilisez JPEG, PNG, WebP ou AVIF." },
      { status: 415 },
    );
  }

  const folder = String(form.get("folder") ?? "").replace(/[^a-z0-9-]/g, "") || "uploads";
  const url = await uploadImage(bytes, kind, folder);

  return Response.json({ url });
}
