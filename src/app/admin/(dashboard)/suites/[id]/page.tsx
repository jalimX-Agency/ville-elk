import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { db } from "@/lib/db/client";
import { SuiteForm } from "@/components/admin/SuiteForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSuite } from "@/app/admin/site-actions";

export default async function EditSuitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const suite = await db.suite.findUnique({ where: { id } });
  if (!suite) notFound();

  return (
    <>
      <PageHeader
        title={suite.nameFr}
        back={{ href: "/admin/suites", label: "Suites" }}
        description={suite.published ? undefined : "Cette suite est masquée : publiez-la depuis la liste des suites quand elle est prête."}
        action={
          suite.published ? (
            <Link href={`/fr/suites/${suite.slug}`} target="_blank" className="admin-button-quiet">
              Voir la page ↗
            </Link>
          ) : undefined
        }
      />
      <SuiteForm suite={suite} />
      <DeleteButton action={deleteSuite} id={suite.id} what="cette suite" />
    </>
  );
}
