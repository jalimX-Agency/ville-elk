import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil } from "lucide-react";

/**
 * One row of an ordered list (suites, amenities): picture, name, status in
 * words, and the actions — move, show or hide, edit — each with a label.
 */
export function OrderedRow({
  id,
  href,
  title,
  subtitle,
  imageUrl,
  published,
  first,
  last,
  move,
  toggle,
}: {
  id: string;
  href: string;
  title: string;
  subtitle?: string;
  imageUrl: string | null;
  published: boolean;
  first: boolean;
  last: boolean;
  move: (formData: FormData) => Promise<void>;
  toggle: (formData: FormData) => Promise<void>;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:p-4">
      <Link href={href} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center text-xs text-muted-foreground">Sans photo</span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={href} className="-my-3 block truncate py-3 font-semibold hover:text-primary">
          {title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={"admin-pill " + (published ? "admin-pill-live" : "admin-pill-off")}>
            {published ? "En ligne" : "Masqué"}
          </span>
          {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
        </div>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <form action={move}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="direction" value="up" />
          <button type="submit" disabled={first} aria-label={`Monter ${title}`} title="Monter" className="admin-button-quiet px-0">
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
        <form action={move}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="direction" value="down" />
          <button type="submit" disabled={last} aria-label={`Descendre ${title}`} title="Descendre" className="admin-button-quiet px-0">
            <ArrowDown className="h-4 w-4" />
          </button>
        </form>
        <form action={toggle}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="admin-button-quiet">
            {published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {published ? "Masquer" : "Publier"}
          </button>
        </form>
        <Link href={href} className="admin-button ms-auto sm:ms-0">
          <Pencil className="h-4 w-4" />
          Modifier
        </Link>
      </div>
    </li>
  );
}
