"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { locales, localeNames, type Locale } from "@/lib/i18n/locales";
import { hrefFor, translatePath } from "@/lib/i18n/routes";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

export function Navigation({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const sections = [
    { href: hrefFor("suites", locale), label: dict.nav.rooms },
    { href: hrefFor("gallery", locale), label: dict.nav.gallery },
    { href: hrefFor("contact", locale), label: dict.nav.contact },
  ];
  const bookingHref = hrefFor("booking", locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "bg-card/90 backdrop-blur-lg border-b border-border" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href={`/${locale}`} aria-label="Villa Elk" className="shrink-0">
          <Logo variant="horizontal" hairline className="w-[150px] sm:w-[178px]" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className="eyebrow text-foreground/70 hover:text-primary">
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 md:flex">
            {locales.map((l) => (
              <Link
                key={l}
                href={translatePath(pathname, locale, l)}
                className={cn(
                  "eyebrow px-2 py-1 text-foreground/50 hover:text-primary",
                  l === locale && "text-primary",
                )}
                aria-label={localeNames[l]}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link href={bookingHref} className="btn-primary hidden lg:inline-flex">
            {dict.nav.bookNow}
          </Link>
          <button
            className="-me-2.5 grid h-11 w-11 place-items-center lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 top-20 flex flex-col items-center justify-center gap-8 bg-background/98 backdrop-blur-xl lg:hidden">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              className="heading-display text-3xl text-foreground"
            >
              {s.label}
            </Link>
          ))}
          <Link href={bookingHref} onClick={() => setOpen(false)} className="btn-primary mt-2">
            {dict.nav.bookNow}
          </Link>
          <div className="flex gap-3 pt-4">
            {locales.map((l) => (
              <Link
                key={l}
                href={translatePath(pathname, locale, l)}
                onClick={() => setOpen(false)}
                className={cn("eyebrow px-3 py-1.5", l === locale ? "text-primary" : "text-foreground/60")}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
