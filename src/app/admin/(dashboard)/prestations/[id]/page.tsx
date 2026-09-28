import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { db } from "@/lib/db/client";
import { AmenityForm } from "@/components/admin/AmenityForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteAmenity } from "@/app/admin/site-actions";

export default async function EditAmenityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const amenity = await db.amenity.findUnique({ where: { id } });
  if (!amenity) notFound();

  return (
    <>
      <PageHeader
        title={amenity.nameFr}
        back={{ href: "/admin/prestations", label: "Prestations" }}
      />
      <AmenityForm amenity={amenity} />
      <DeleteButton action={deleteAmenity} id={amenity.id} what="cette prestation" />
    </>
  );
}
