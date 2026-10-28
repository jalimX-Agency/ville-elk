import { db } from "@/lib/db/client";
import type { BlogPostModel } from "@/generated/prisma/models";
import type { ContentImage, Localized } from "./types";

export type BlogPost = {
  id: string;
  slug: string;
  published: boolean;
  publishedAt: Date;
  updatedAt: Date;
  title: Localized;
  excerpt: Localized;
  body: Localized;
  image: ContentImage | null;
};

export function toPost(row: BlogPostModel): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    published: row.published,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    title: { fr: row.titleFr, en: row.titleEn, es: row.titleEs, ar: row.titleAr },
    excerpt: { fr: row.excerptFr, en: row.excerptEn, es: row.excerptEs, ar: row.excerptAr },
    body: { fr: row.bodyFr, en: row.bodyEn, es: row.bodyEs, ar: row.bodyAr },
    image: row.imageUrl
      ? { src: row.imageUrl, alt: { fr: row.altFr, en: row.altEn, es: row.altEs, ar: row.altAr } }
      : null,
  };
}

/**
 * The blog must never be the reason a page fails: if the table cannot be read
 * the blog is simply empty, and the rest of the site is untouched.
 */
export async function getPosts(): Promise<BlogPost[]> {
  try {
    const rows = await db.blogPost.findMany({
      where: { published: true, publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
    });
    return rows.map(toPost);
  } catch (error) {
    console.error("Blog unavailable", error);
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const row = await db.blogPost.findUnique({ where: { slug } });
    return row && row.published && row.publishedAt <= new Date() ? toPost(row) : null;
  } catch (error) {
    console.error("Blog unavailable", error);
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  return (await getPosts()).map((post) => post.slug);
}

/** About 200 words a minute, and never less than one. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
