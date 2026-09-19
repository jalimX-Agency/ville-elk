import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import { moveAmenity, toggleAmenity } from "@/app/admin/actions";

export default async function PrestationsPage() {
  const amenities = await db.amenity.findMany({ orderBy: { position: "asc" } });
  const last = amenities.length - 1;

  return (
    <>
      <h1 className="text-2xl font-light">Prestations</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        L&apos;ordre ci-dessous est celui du site. Une prestation dépubliée
        disparaît de toutes les langues.
      </p>

      <ul className="mt-8 border-t border-border">
        {amenities.map((amenity, index) => (
          <li
            key={amenity.id}
            className="flex flex-wrap items-center gap-4 border-b border-border py-4"
          >
            <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-muted">
              {amenity.imageUrl ? (
                <Image
                  src={amenity.imageUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <span className="grid h-full place-items-center text-xs text-muted-foreground">
                  —
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/prestations/${amenity.id}`}
                className="text-lg hover:text-primary"
              >
                {amenity.nameFr}
              </Link>
              <p className="admin-label mt-1">
                {amenity.slug}
                {!amenity.published && " · dépubliée"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form action={moveAmenity}>
                <input type="hidden" name="id" value={amenity.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  aria-label={`Monter ${amenity.nameFr}`}
                  className="admin-button-quiet"
                >
                  ↑
                </button>
              </form>
              <form action={moveAmenity}>
                <input type="hidden" name="id" value={amenity.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === last}
                  aria-label={`Descendre ${amenity.nameFr}`}
                  className="admin-button-quiet"
                >
                  ↓
                </button>
              </form>
              <form action={toggleAmenity}>
                <input type="hidden" name="id" value={amenity.id} />
                <button type="submit" className="admin-button-quiet">
                  {amenity.published ? "Dépublier" : "Publier"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
