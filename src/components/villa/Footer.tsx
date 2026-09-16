import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-border bg-card px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="heading-display text-xl">Villa Elk</p>
        <p className="body-copy max-w-md text-sm">{dict.footer.description}</p>
        <p className="eyebrow text-foreground/40">
          © {new Date().getFullYear()} Villa Elk — {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
