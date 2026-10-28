import Image from "next/image";
import Link from "next/link";
import { getPosts, readingMinutes, type BlogPost } from "@/lib/content/blog";
import { pick } from "@/lib/content/types";
import { hrefFor, postHref } from "@/lib/i18n/routes";
import { getContact } from "@/lib/content/site";
import { SITE, VILLA_ID, breadcrumbSchema, jsonLd } from "@/lib/seo";
import { ArticleBody } from "./ArticleBody";
import { formatDate } from "./BlogIndex";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

function absolute(src: string): string {
  return src.startsWith("http") ? src : `${SITE}${src}`;
}

export async function BlogPostPage({ post, dict, locale }: { post: BlogPost; dict: Dictionary; locale: Locale }) {
  const copy = dict.blog;
  const title = pick(post.title, locale);
  const body = pick(post.body, locale);
  const others = (await getPosts()).filter((other) => other.id !== post.id).slice(0, 3);
  const contact = await getContact();
  const url = `${SITE}${postHref(post.slug, locale)}`;

  const schema = jsonLd(
    {
      "@type": "BlogPosting",
      headline: title,
      description: pick(post.excerpt, locale),
      url,
      mainEntityOfPage: url,
      inLanguage: locale,
      datePublished: post.publishedAt.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      ...(post.image ? { image: absolute(post.image.src) } : {}),
      author: { "@type": "Organization", name: "Villa Elk", url: SITE },
      publisher: {
        "@type": "Organization",
        "@id": VILLA_ID,
        name: "Villa Elk",
        logo: { "@type": "ImageObject", url: `${SITE}/icon.svg` },
      },
    },
    breadcrumbSchema(locale, [
      { name: dict.nav.blog, path: hrefFor("blog", locale) },
      { name: title, path: postHref(post.slug, locale) },
    ]),
  );

  return (
    <article className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      <header className="mx-auto max-w-3xl px-6 pt-12 lg:pt-20">
        <Link href={hrefFor("blog", locale)} className="eyebrow text-primary">
          {locale === "ar" ? "→" : "←"} {copy.back}
        </Link>
        <h1 className="heading-display mt-6 text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02] text-foreground">{title}</h1>
        <p className="body-copy mt-6 text-xl">{pick(post.excerpt, locale)}</p>
        <p className="mt-6 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-muted-foreground">
          <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt, locale)}</time>
          {" · "}
          {readingMinutes(body)} {copy.readingTime}
        </p>
      </header>

      {post.image && (
        <div className="mx-auto mt-10 max-w-[1400px] px-6 lg:px-[5vw]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius)] bg-muted lg:aspect-[21/9]">
            <Image src={post.image.src} alt={pick(post.image.alt, locale)} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-14 lg:py-20">
        <ArticleBody body={body} locale={locale} />

        <aside className="mt-16 border-t border-border pt-10">
          <h2 className="heading-display text-3xl text-foreground">{copy.endTitle}</h2>
          <p className="body-copy mt-4 text-lg">{copy.endBody}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
            <Link href={hrefFor("booking", locale)} className="btn-primary">
              {dict.nav.bookNow}
            </Link>
            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-quiet">
              {dict.contact.whatsappCta}
            </a>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-[5vw]">
            <h2 className="eyebrow text-muted-foreground">{copy.related}</h2>
            <ul className="mt-6 grid gap-8 md:grid-cols-3">
              {others.map((other) => (
                <li key={other.id}>
                  <Link href={postHref(other.slug, locale)} className="group block">
                    <h3 className="heading-display text-2xl text-foreground transition-colors group-hover:text-primary">
                      {pick(other.title, locale)}
                    </h3>
                    <p className="body-copy mt-2 text-sm">{pick(other.excerpt, locale)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
