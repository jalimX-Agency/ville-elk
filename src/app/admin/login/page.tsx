import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Logo variant="framed" className="mx-auto w-20" />
        <h1 className="admin-label mt-8 text-center text-muted-foreground">
          Administration
        </h1>
        <div className="mt-6 border border-border bg-card p-7">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
