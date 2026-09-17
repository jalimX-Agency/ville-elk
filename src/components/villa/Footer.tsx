import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { Logo } from "@/components/brand/Logo";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-border px-6 pb-10 pt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <Logo variant="framed" className="w-[190px] sm:w-[220px]" />
        <p className="body-copy max-w-md text-sm">{dict.footer.description}</p>
        <p className="eyebrow text-muted-foreground">
          © {new Date().getFullYear()} Villa Elk — {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
