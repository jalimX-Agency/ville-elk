import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { AmenityForm } from "@/components/admin/AmenityForm";

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
      <Link href="/admin/prestations" className="text-sm text-muted-foreground hover:text-primary">
        ← Prestations
      </Link>
      <h1 className="mt-4 text-2xl font-light">{amenity.nameFr}</h1>
      <AmenityForm amenity={amenity} />
    </>
  );
}
