import { auth } from "@/auth";
import { PasswordForm } from "@/components/admin/AdminForms";

export default async function AccountPage() {
  const session = await auth();
  return (
    <>
      <h1 className="text-2xl font-light">Mon compte</h1>
      <p className="mt-2 text-muted-foreground">
        {session?.user?.name} · {session?.user?.email}
      </p>
      <PasswordForm />
    </>
  );
}
