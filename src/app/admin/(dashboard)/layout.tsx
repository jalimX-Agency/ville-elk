import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/admin/guard";
import { db } from "@/lib/db/client";
import { logout } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const newRequests = await db.enquiry.count({ where: { status: "NEW" } }).catch(() => 0);

  return (
    <AdminShell
      user={{ name: user.name, email: user.email }}
      newRequests={newRequests}
      logout={logout}
    >
      {children}
    </AdminShell>
  );
}
