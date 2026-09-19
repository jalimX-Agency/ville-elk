import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { getSessionUser } from "@/lib/auth/session";
import { logout } from "@/app/admin/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
          <Link href="/admin" className="shrink-0">
            <Logo variant="horizontal" className="h-7 w-auto" hairline />
            <span className="sr-only">Villa Elk — administration</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link href="/admin/prestations" className="hover:text-primary">
              Prestations
            </Link>
            <Link href="/fr" target="_blank" className="hover:text-primary">
              Voir le site ↗
            </Link>
          </nav>

          <form action={logout} className="ms-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <button type="submit" className="text-sm underline hover:text-primary">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
