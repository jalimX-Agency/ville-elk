import { logoLockups, type LogoVariant } from "./logo-paths";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  /** Keep strokes at ~1px regardless of render size — use for small placements like the header. */
  hairline?: boolean;
  title?: string;
};

export function Logo({ variant = "horizontal", className, hairline, title = "Villa Elk" }: LogoProps) {
  const { viewBox, body } = logoLockups[variant];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      role="img"
      aria-label={title}
      className={cn("block h-auto", hairline && "logo-hairline", className)}
      // Static, build-generated markup from the brand script — not user input.
      dangerouslySetInnerHTML={{ __html: `<title>${title}</title>${body}` }}
    />
  );
}
