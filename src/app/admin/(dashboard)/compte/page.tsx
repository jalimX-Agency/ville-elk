import { PageHeader } from "@/components/admin/PageHeader";
import { getAdminUser } from "@/app/admin/guard";
import { PasswordForm } from "@/components/admin/AdminForms";

export default async function AccountPage() {
  const user = await getAdminUser();
  return (
    <>
      <PageHeader title="Mon compte" description={`${user?.name ?? ""} · ${user?.email ?? ""}`} />
      <PasswordForm />
    </>
  );
}
