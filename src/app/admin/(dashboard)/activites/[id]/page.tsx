import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ActivityForm } from "@/components/admin/ActivityForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteActivity } from "@/app/admin/activity-actions";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await db.activity.findUnique({ where: { id } });
  if (!activity) notFound();

  return (
    <>
      <PageHeader
        title={activity.nameFr}
        back={{ href: "/admin/activites", label: "Activités" }}
        description={activity.published ? undefined : "Cette activité est masquée : publiez-la depuis la liste quand elle est prête."}
      />
      {/* Remounts after a save that changed the photo, so the field shows the new one. */}
      <ActivityForm key={activity.imageUrl ?? ""} activity={activity} />
      <DeleteButton action={deleteActivity} id={activity.id} what="cette activité" />
    </>
  );
}
