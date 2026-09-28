import { db } from "@/lib/db/client";
import { moveAmenity, toggleAmenity } from "@/app/admin/actions";
import { CreateForm } from "@/components/admin/AdminForms";
import { PageHeader } from "@/components/admin/PageHeader";
import { OrderedRow } from "@/components/admin/OrderedRow";

export default async function PrestationsPage() {
  const amenities = await db.amenity.findMany({ orderBy: { position: "asc" } });

  return (
    <>
      <PageHeader
        title="Prestations"
        description="La liste affichée sur la page d'accueil, dans cet ordre. Une prestation masquée disparaît des quatre langues."
      />

      <ul className="admin-card divide-y divide-border">
        {amenities.map((amenity, index) => (
          <OrderedRow
            key={amenity.id}
            id={amenity.id}
            href={`/admin/prestations/${amenity.id}`}
            title={amenity.nameFr}
            subtitle={amenity.imageUrl ? undefined : "sans photo"}
            imageUrl={amenity.imageUrl}
            published={amenity.published}
            first={index === 0}
            last={index === amenities.length - 1}
            move={moveAmenity}
            toggle={toggleAmenity}
          />
        ))}
      </ul>

      <CreateForm kind="amenity" />
    </>
  );
}
