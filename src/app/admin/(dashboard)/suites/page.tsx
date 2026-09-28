import { db } from "@/lib/db/client";
import { moveSuite, toggleSuite } from "@/app/admin/actions";
import { CreateForm } from "@/components/admin/AdminForms";
import { PageHeader } from "@/components/admin/PageHeader";
import { OrderedRow } from "@/components/admin/OrderedRow";

export default async function SuitesPage() {
  const suites = await db.suite.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { photos: true } } },
  });

  return (
    <>
      <PageHeader
        title="Suites"
        description="L'ordre ci-dessous est celui du site. Chaque suite a sa propre page, avec ses photos."
      />

      <ul className="admin-card divide-y divide-border">
        {suites.map((suite, index) => (
          <OrderedRow
            key={suite.id}
            id={suite.id}
            href={`/admin/suites/${suite.id}`}
            title={suite.nameFr}
            subtitle={[
              suite.level === "0" ? "Rez-de-chaussée" : "Étage",
              suite.areaSqm ? `${suite.areaSqm} m²` : null,
              `${suite._count.photos} photo${suite._count.photos > 1 ? "s" : ""}`,
            ]
              .filter(Boolean)
              .join(" · ")}
            imageUrl={suite.imageUrl}
            published={suite.published}
            first={index === 0}
            last={index === suites.length - 1}
            move={moveSuite}
            toggle={toggleSuite}
          />
        ))}
      </ul>

      <CreateForm kind="suite" />
    </>
  );
}
