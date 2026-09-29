import Link from "next/link";
import { db } from "@/lib/db/client";
import { moveActivity, toggleActivity } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/PageHeader";
import { OrderedRow } from "@/components/admin/OrderedRow";
import { ACTIVITY_CATEGORY_LABELS, CreateActivityForm } from "@/components/admin/ActivityForm";

export default async function ActivitiesAdminPage() {
  const activities = await db.activity.findMany({ orderBy: { position: "asc" } });

  return (
    <>
      <PageHeader
        title="Activités"
        description="Les lieux autour de la villa, sur la page Activités du site. L'ordre ci-dessous est celui de chaque rubrique."
        action={
          <Link href="/fr/activites" target="_blank" className="admin-button-quiet">
            Voir la page ↗
          </Link>
        }
      />

      <ul className="admin-card divide-y divide-border">
        {activities.map((activity, index) => (
          <OrderedRow
            key={activity.id}
            id={activity.id}
            href={`/admin/activites/${activity.id}`}
            title={activity.nameFr}
            subtitle={`${ACTIVITY_CATEGORY_LABELS[activity.category] ?? activity.category} · ${activity.minutes} min`}
            imageUrl={activity.imageUrl}
            published={activity.published}
            first={index === 0}
            last={index === activities.length - 1}
            move={moveActivity}
            toggle={toggleActivity}
          />
        ))}
      </ul>

      <CreateActivityForm />
    </>
  );
}
