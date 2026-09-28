import Link from "next/link";
import { BedDouble, ChevronRight, Images, Inbox, Settings, Sparkles, Type } from "lucide-react";
import { db } from "@/lib/db/client";
import { getAdminUser } from "@/app/admin/guard";
import { PageHeader } from "@/components/admin/PageHeader";

function day(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
}

export default async function DashboardHome() {
  const user = await getAdminUser();
  const [newRequests, latest, suites, hiddenSuites, photos, missingAlt, amenities, texts] = await Promise.all([
    db.enquiry.count({ where: { status: "NEW" } }),
    db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    db.suite.count({ where: { published: true } }),
    db.suite.count({ where: { published: false } }),
    db.galleryImage.count({ where: { published: true } }),
    db.galleryImage.count({ where: { altFr: "" } }),
    db.amenity.count({ where: { published: true } }),
    db.siteText.count(),
  ]);
  const first = user?.name.split(" ")[0] ?? "";

  const stats = [
    { href: "/admin/demandes", label: "Nouvelles demandes", value: newRequests, icon: Inbox, note: newRequests ? "à traiter" : "rien en attente", highlight: newRequests > 0 },
    { href: "/admin/suites", label: "Suites en ligne", value: suites, icon: BedDouble, note: hiddenSuites ? `${hiddenSuites} masquée${hiddenSuites > 1 ? "s" : ""}` : "toutes publiées" },
    { href: "/admin/galerie", label: "Photos en ligne", value: photos, icon: Images, note: missingAlt ? `${missingAlt} sans description` : "toutes décrites" },
    { href: "/admin/prestations", label: "Prestations", value: amenities, icon: Sparkles, note: "affichées sur l'accueil" },
  ];

  return (
    <>
      <PageHeader
        title={first ? `Bonjour ${first}` : "Bonjour"}
        description="Chaque modification est publiée immédiatement, dans les quatre langues."
      />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <li key={stat.href}>
              <Link
                href={stat.href}
                className={"admin-card block h-full p-4 sm:p-5 " + (stat.highlight ? "border-[var(--brass)] bg-[#fbf5ea]" : "")}
              >
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                <p className="mt-3 text-3xl font-semibold tabular-nums">{stat.value}</p>
                <p className="mt-1 text-sm font-medium">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.note}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="admin-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Dernières demandes</h2>
            <Link href="/admin/demandes" className="-my-2 inline-flex min-h-11 items-center px-1 text-sm font-medium text-primary hover:underline">
              Tout voir
            </Link>
          </div>
          {latest.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted-foreground">Aucune demande pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {latest.map((enquiry) => (
                <li key={enquiry.id}>
                  <Link href="/admin/demandes" className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{enquiry.name}</span>
                      <span className="block text-sm text-muted-foreground">
                        {day(enquiry.arrival)} → {day(enquiry.departure)} · {enquiry.guests} invité{enquiry.guests > 1 ? "s" : ""}
                      </span>
                    </span>
                    {enquiry.status === "NEW" && <span className="admin-pill admin-pill-new">Nouvelle</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card lg:col-span-2">
          <h2 className="border-b border-border px-5 py-4 font-semibold">Modifier le site</h2>
          <ul className="divide-y divide-border">
            {[
              { href: "/admin/textes", label: "Textes du site", note: texts ? `${texts} texte${texts > 1 ? "s" : ""} modifié${texts > 1 ? "s" : ""}` : "en quatre langues", icon: Type },
              { href: "/admin/galerie", label: "Ajouter des photos", note: "à la galerie", icon: Images },
              { href: "/admin/reglages", label: "Réglages", note: "coordonnées, photos des pages", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50">
                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{item.label}</span>
                      <span className="block text-sm text-muted-foreground">{item.note}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
