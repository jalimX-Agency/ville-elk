"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarOff,
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Settings,
  Sparkles,
  Type,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean; badge?: boolean };

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Contenu",
    items: [
      { href: "/admin", label: "Aperçu", icon: LayoutDashboard, exact: true },
      { href: "/admin/suites", label: "Suites", icon: BedDouble },
      { href: "/admin/galerie", label: "Galerie", icon: Images },
      { href: "/admin/prestations", label: "Prestations", icon: Sparkles },
      { href: "/admin/activites", label: "Activités", icon: MapPin },
      { href: "/admin/textes", label: "Textes du site", icon: Type },
    ],
  },
  {
    title: "Réservations",
    items: [
      { href: "/admin/demandes", label: "Demandes", icon: Inbox, badge: true },
      { href: "/admin/disponibilites", label: "Disponibilités", icon: CalendarOff },
    ],
  },
  {
    title: "Paramètres",
    items: [
      { href: "/admin/reglages", label: "Réglages", icon: Settings },
      { href: "/admin/compte", label: "Mon compte", icon: UserRound },
    ],
  },
];

export function AdminShell({
  user,
  newRequests,
  logout,
  children,
}: {
  user: { name: string; email: string };
  newRequests: number;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // While the drawer is open: Escape closes it, and the page behind does not scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav aria-label="Administration" className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/admin" onClick={() => setOpen(false)} className="text-[#f5efe6]">
          <Logo variant="horizontal" className="h-7 w-auto [--logo-accent:var(--brass-light)] [--logo-line:#e8d9c7] [--logo-text:#e8d9c7]" hairline />
          <span className="sr-only">Villa Elk — administration</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
          className="grid h-11 w-11 place-items-center rounded-lg text-[var(--sidebar-foreground)] hover:bg-white/10 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {GROUPS.map((group) => (
          <div key={group.title} className="mt-5">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sidebar-muted)]">
              {group.title}
            </p>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={
                        "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-[0.95rem] transition-colors " +
                        (active
                          ? "bg-white/10 font-semibold text-[#f5efe6]"
                          : "text-[var(--sidebar-foreground)] hover:bg-white/5 hover:text-[#f5efe6]")
                      }
                    >
                      {active && (
                        <span className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-[var(--brass-light)]" aria-hidden="true" />
                      )}
                      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && newRequests > 0 && (
                        <span className="rounded-full bg-[var(--brass-light)] px-2 py-0.5 text-xs font-bold text-[#1f1c19] tabular-nums">
                          {newRequests}
                          <span className="sr-only"> nouvelle{newRequests > 1 ? "s" : ""}</span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/fr"
          target="_blank"
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-[0.95rem] text-[var(--sidebar-foreground)] hover:bg-white/5 hover:text-[#f5efe6]"
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Voir le site
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--terracotta)] text-sm font-semibold text-white">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#f5efe6]">{user.name}</span>
            <span className="block truncate text-xs text-[var(--sidebar-muted)]">{user.email}</span>
          </span>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              title="Se déconnecter"
              className="grid h-11 w-11 place-items-center rounded-lg text-[var(--sidebar-foreground)] hover:bg-white/10 hover:text-[#f5efe6]"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  const current = GROUPS.flatMap((g) => g.items).find((item) =>
    isActive(item.href, item.exact),
  );

  return (
    <div className="min-h-screen lg:ps-64">
      {/* Desktop: the sidebar is always there */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 bg-[var(--sidebar)] lg:block">{nav}</aside>

      {/* Phone and tablet: a bar with the page name, and the same nav as a drawer */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-lg hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold">{current?.label ?? "Administration"}</span>
        {newRequests > 0 && current?.href !== "/admin/demandes" && (
          // The pill is small; the link around it is a full 44px target.
          <Link href="/admin/demandes" className="ms-auto inline-flex min-h-11 items-center px-1">
            <span className="admin-pill admin-pill-new">
              {newRequests} demande{newRequests > 1 ? "s" : ""}
            </span>
          </Link>
        )}
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#15120f]/50"
          />
          <aside className="absolute inset-y-0 start-0 w-[82vw] max-w-72 bg-[var(--sidebar)] shadow-2xl">{nav}</aside>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
