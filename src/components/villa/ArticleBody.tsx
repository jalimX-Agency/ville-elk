import { Fragment } from "react";
import Link from "next/link";
import { hrefFor, pageSlugs, type PageKey } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/locales";

/**
 * An article's text is written in a text box, with four marks:
 *   ## A heading        - A list item        **bold**        [text](address)
 * An address is a web link (https://…) or a page of the site as `page:booking`,
 * which becomes the right URL in whichever language the article is read.
 * Everything is rendered as React elements, never as raw HTML.
 */
function href(target: string, locale: Locale): { url: string; external: boolean } | null {
  if (target.startsWith("page:")) {
    const key = target.slice(5);
    return key in pageSlugs ? { url: hrefFor(key as PageKey, locale), external: false } : null;
  }
  return /^https:\/\//i.test(target) ? { url: target, external: true } : null;
}

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
const LINK_CLASS = "text-primary underline decoration-accent underline-offset-4 hover:decoration-primary";

function Inline({ text, locale }: { text: string; locale: Locale }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[1]}
        </strong>,
      );
    } else {
      const link = href(match[3], locale);
      if (!link) parts.push(match[2]);
      else if (link.external)
        parts.push(
          <a key={match.index} href={link.url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {match[2]}
          </a>,
        );
      else
        parts.push(
          <Link key={match.index} href={link.url} className={LINK_CLASS}>
            {match[2]}
          </Link>,
        );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}

export function ArticleBody({ body, locale }: { body: string; locale: Locale }) {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={index} className="heading-display pt-4 text-2xl text-foreground">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="heading-display pt-8 text-3xl text-foreground sm:text-4xl">
              {block.slice(3)}
            </h2>
          );
        }
        const lines = block.split("\n");
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="space-y-3">
              {lines.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
                  <span className="body-copy text-lg">
                    <Inline text={line.slice(2)} locale={locale} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="body-copy text-lg leading-[1.85]">
            <Inline text={block.replace(/\n/g, " ")} locale={locale} />
          </p>
        );
      })}
    </div>
  );
}
