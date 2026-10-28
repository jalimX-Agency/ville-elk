"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { deleteUnusedImage } from "@/lib/storage/cleanup";
import { requireUser, refreshPublicPages } from "./guard";

export type BlogState = { error?: string; saved?: boolean };

export async function saveBlogPost(_state: BlogState, formData: FormData): Promise<BlogState> {
  await requireUser();
  const text = (field: string) => String(formData.get(field) ?? "").trim();
  const id = text("id");

  const titleFr = text("titleFr");
  if (!titleFr) return { error: "Le titre en français est obligatoire." };

  const published = formData.get("published") === "on";
  const excerptFr = text("excerptFr");
  const bodyFr = text("bodyFr");
  if (published && (!excerptFr || !bodyFr)) {
    return { error: "Pour publier, le résumé et le texte en français doivent être remplis." };
  }

  const date = text("publishedAt");
  const publishedAt = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T09:00:00Z`) : null;
  if (!publishedAt || Number.isNaN(publishedAt.getTime())) return { error: "Indiquez une date de publication." };

  const imageUrl = text("imageUrl") || null;
  const previous = await db.blogPost.findUnique({ where: { id }, select: { imageUrl: true } });
  if (!previous) return { error: "Cet article n'existe plus." };

  await db.blogPost.update({
    where: { id },
    data: {
      published,
      publishedAt,
      titleFr,
      titleEn: text("titleEn") || titleFr,
      titleEs: text("titleEs") || titleFr,
      titleAr: text("titleAr") || titleFr,
      excerptFr,
      excerptEn: text("excerptEn") || excerptFr,
      excerptEs: text("excerptEs") || excerptFr,
      excerptAr: text("excerptAr") || excerptFr,
      bodyFr,
      bodyEn: text("bodyEn") || bodyFr,
      bodyEs: text("bodyEs") || bodyFr,
      bodyAr: text("bodyAr") || bodyFr,
      imageUrl,
      altFr: text("altFr"),
      altEn: text("altEn") || text("altFr"),
      altEs: text("altEs") || text("altFr"),
      altAr: text("altAr") || text("altFr"),
    },
  });

  if (previous.imageUrl && previous.imageUrl !== imageUrl) await deleteUnusedImage(previous.imageUrl);

  refreshPublicPages();
  revalidatePath("/admin/articles");
  return { saved: true };
}

export async function createBlogPost(_state: BlogState, formData: FormData): Promise<BlogState> {
  await requireUser();
  const titleFr = String(formData.get("titleFr") ?? "").trim();
  if (!titleFr) return { error: "Donnez un titre." };

  const rows = await db.blogPost.findMany({ select: { slug: true } });
  const base =
    titleFr
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "article";
  let slug = base;
  for (let n = 2; rows.some((row) => row.slug === slug); n += 1) slug = `${base}-${n}`;

  const created = await db.blogPost.create({
    data: { slug, titleFr, titleEn: titleFr, titleEs: titleFr, titleAr: titleFr, published: false },
  });
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${created.id}`);
}

export async function deleteBlogPost(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) return;
  await db.blogPost.delete({ where: { id } });
  await deleteUnusedImage(post.imageUrl);
  refreshPublicPages();
  redirect("/admin/articles");
}
