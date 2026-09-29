import Link from "next/link";
import { Plus } from "lucide-react";
import { hrefFor } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

/**
 * The questions guests ask before they write. Each answer opens in place —
 * native <details>, so it works without JavaScript and every answer stays in
 * the page for search engines and AI assistants to read.
 */
export function Faq({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.faq;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="questions" aria-labelledby="faq-title" className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-[5vw] lg:py-28">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-primary">{copy.eyebrow}</p>
            <h2
              id="faq-title"
              className="heading-display mt-3 max-w-md text-3xl text-foreground sm:text-4xl lg:text-5xl"
            >
              {copy.title}
            </h2>
            <p className="body-copy mt-6 max-w-md text-lg">{copy.intro}</p>
            <Link href={hrefFor("contact", locale)} className="btn-quiet mt-8">
              {dict.nav.contact}
              <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 lg:col-span-8 lg:mt-0">
          <ul className="border-t border-border">
            {copy.questions.map((item, index) => (
              <li key={item.question} className="border-b border-border">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 [&::-webkit-details-marker]:hidden lg:gap-8">
                    <span className="w-8 shrink-0 font-mono text-[0.75rem] tracking-[0.18em] text-muted-foreground tabular-nums">
                      {pad(index + 1)}
                    </span>
                    <h3 className="flex-1 text-lg text-foreground lg:text-xl">{item.question}</h3>
                    <Plus
                      className="h-5 w-5 shrink-0 self-center text-accent transition-transform duration-300 group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="body-copy -mt-1 max-w-2xl ps-[3.25rem] pb-7 lg:ps-16">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
