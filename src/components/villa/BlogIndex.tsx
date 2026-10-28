import Image from "next/image";
import Link from "next/link";
import { getPosts, readingMinutes, type BlogPost } from "@/lib/content/blog";
import { pick } from "@/lib/content/types";
import { postHref } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA-u-nu-latn" : locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function PostCard({ post, locale, dict, large }: { post: BlogPost; locale: Locale; dict: Dictionary; large: boolean }) {
  const copy = dict.blog;
  const arrow = locale === "ar" ? "←" : "→";
  return (
    <article className="group">
      <Link href={postHref(post.slug, locale)} className="block">
        {post.image && (
          <div
            className={
              "relative overflow-hidden rounded-[var(--radius)] bg-muted " +
              (large ? "aspect-[16/9] lg:aspect-[21/9]" : "aspect-[4/3]")
            }
          >
            <Image
              src={post.image.src}
              alt={pick(post.image.alt, locale)}
              fill
              sizes={large ? "(min-width:1024px) 90vw, 100vw" : "(min-width:1024px) 30vw, 100vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              priority={large}
            />
          </div>
        )}
        <p className="mt-5 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-muted-foreground">
          <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt, locale)}</time>
          {" · "}
          {readingMinutes(pick(post.body, locale))} {copy.readingTime}
        </p>
        <h2
          className={
            "heading-display mt-3 text-foreground transition-colors group-hover:text-primary " +
            (large ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl")
          }
        >
          {pick(post.title, locale)}
        </h2>
        <p className="body-copy mt-3 max-w-2xl">{pick(post.excerpt, locale)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.06em] text-primary">
          {copy.read} <span aria-hidden="true">{arrow}</span>
        </span>
      </Link>
    </article>
  );
}

/** The blog's front page: the newest article large, the others in a grid. */
export async function BlogIndex({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.blog;
  const [first, ...rest] = await getPosts();

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-[5vw] lg:py-28">
      <p className="eyebrow text-primary">{copy.eyebrow}</p>
      <h1 className="heading-display mt-3 max-w-3xl text-4xl text-foreground sm:text-5xl lg:text-6xl">{copy.title}</h1>
      <p className="body-copy mt-6 max-w-2xl text-lg">{copy.intro}</p>

      {first ? (
        <div className="mt-14 space-y-16">
          <PostCard post={first} locale={locale} dict={dict} large />
          {rest.length > 0 && (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} locale={locale} dict={dict} large={false} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="body-copy mt-14">{copy.empty}</p>
      )}
    </section>
  );
}
