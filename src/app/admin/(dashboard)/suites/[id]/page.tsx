import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { SuiteForm } from "@/components/admin/SuiteForm";

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
      <Link href="/admin/suites" className="text-sm text-muted-foreground hover:text-primary">
        ← Suites
      </Link>
      <h1 className="mt-4 text-2xl font-light">{suite.nameFr}</h1>
      <SuiteForm suite={suite} />
    </>
  );
}
