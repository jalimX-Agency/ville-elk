import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { identifyImage, uploadImage, MAX_UPLOAD_BYTES } from "@/lib/storage/r2";
import { postHref } from "@/lib/i18n/routes";
import { SITE } from "@/lib/seo";

/**
 * The blog's publishing API, for the weekly writing routine.
 *
 *   GET  /api/blog   the articles already on the site, to avoid repeating one
 *   POST /api/blog   publish a new article in four languages
 *
 * Both need "Authorization: Bearer <BLOG_API_KEY>". The cover photograph is
 * given as a Pexels URL; the server downloads it and stores it in R2, so the
 * article never depends on an outside host.
 */

/** Only these hosts are fetched, so the endpoint cannot be used to reach anything else. */
const IMAGE_HOSTS = new Set(["images.pexels.com"]);

function authorized(request: Request): boolean | null {
  const key = process.env.BLOG_API_KEY?.trim();
  if (!key) return null;
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

function deny(request: Request): Response | null {
  const ok = authorized(request);
  if (ok === null) return Response.json({ error: "BLOG_API_KEY is not set on the server." }, { status: 503 });
  if (!ok) return Response.json({ error: "Unauthorized." }, { status: 401 });
  return null;
}

export async function GET(request: Request) {
  const denied = deny(request);
  if (denied) return denied;
  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    select: { slug: true, titleFr: true, titleEn: true, published: true, publishedAt: true },
  });
  return Response.json({ posts });
}

/** A body is either one string (blocks separated by a blank line) or an array of blocks. */
const body = z.union([z.string().min(200), z.array(z.string().min(1)).min(3)]).transform((value) =>
  Array.isArray(value) ? value.join("\n\n") : value,
);

const language = z.object({
  title: z.string().trim().min(10).max(120),
  excerpt: z.string().trim().min(40).max(200),
  alt: z.string().trim().min(5).max(200),
  body,
});

const article = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, digits and hyphens only")
    .max(90),
  imageUrl: z.string().url(),
  published: z.boolean().default(true),
  publishedAt: z.string().datetime({ offset: true }).optional(),
  fr: language,
  en: language,
  es: language,
  ar: language,
});

async function storeCover(source: string): Promise<string> {
  const url = new URL(source);
  if (url.protocol !== "https:" || !IMAGE_HOSTS.has(url.hostname)) {
    throw new Error(`imageUrl must be an https URL on ${[...IMAGE_HOSTS].join(", ")}`);
  }
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`could not download the image (HTTP ${response.status})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_UPLOAD_BYTES) throw new Error("the image is larger than 20 MB");
  const kind = identifyImage(bytes);
  if (!kind) throw new Error("the image is not a JPEG, PNG, WebP or AVIF file");
  return uploadImage(bytes, kind, "blog");
}

export async function POST(request: Request) {
  const denied = deny(request);
  if (denied) return denied;

  let parsed;
  try {
    parsed = article.safeParse(await request.json());
  } catch {
    return Response.json({ error: "The request body is not valid JSON." }, { status: 400 });
  }
  if (!parsed.success) {
    return Response.json({ error: "Invalid article.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const input = parsed.data;

  if (await db.blogPost.findUnique({ where: { slug: input.slug }, select: { id: true } })) {
    return Response.json({ error: `An article with the slug "${input.slug}" already exists.` }, { status: 409 });
  }

  let imageUrl: string;
  try {
    imageUrl = await storeCover(input.imageUrl);
  } catch (error) {
    return Response.json(
      { error: `Cover image: ${error instanceof Error ? error.message : "upload failed"}.` },
      { status: 422 },
    );
  }

  const post = await db.blogPost.create({
    data: {
      slug: input.slug,
      published: input.published,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
      imageUrl,
      titleFr: input.fr.title,
      titleEn: input.en.title,
      titleEs: input.es.title,
      titleAr: input.ar.title,
      excerptFr: input.fr.excerpt,
      excerptEn: input.en.excerpt,
      excerptEs: input.es.excerpt,
      excerptAr: input.ar.excerpt,
      bodyFr: input.fr.body,
      bodyEn: input.en.body,
      bodyEs: input.es.body,
      bodyAr: input.ar.body,
      altFr: input.fr.alt,
      altEn: input.en.alt,
      altEs: input.es.alt,
      altAr: input.ar.alt,
    },
  });

  // The blog list, the sitemap and llms.txt all read the table: refresh every public page.
  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");

  return Response.json(
    {
      id: post.id,
      published: post.published,
      imageUrl,
      urls: {
        fr: `${SITE}${postHref(post.slug, "fr")}`,
        en: `${SITE}${postHref(post.slug, "en")}`,
        es: `${SITE}${postHref(post.slug, "es")}`,
        ar: `${SITE}${postHref(post.slug, "ar")}`,
      },
    },
    { status: 201 },
  );
}
