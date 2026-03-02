"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminTopbar from "@/components/admin/AdminTopbar";

type NavItem = { label: string; href: string; icon: string; badge?: string };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ Hooks SIEMPRE arriba (no condicional)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const nav: NavItem[] = useMemo(
    () => [
      { label: "Páginas", href: "/admin/pages", icon: "📄" },
      { label: "Header & Footer", href: "/admin/layout", icon: "🧭", badge: "Pronto" },
      { label: "Multimedia", href: "/admin/media", icon: "🖼️", badge: "Pronto" },
      { label: "Ajustes", href: "/admin/settings", icon: "⚙️", badge: "Pronto" },
    ],
    []
  );

  const isLogin = pathname === "/admin/login";

  // ✅ Login sin sidebar (pero hooks ya fueron llamados)
  if (isLogin) {
    return (
      <div className="aw-admin min-h-screen bg-slate-50 text-slate-900">
        {children}
      </div>
    );
  }

  const Layout = (
    <div className="aw-admin min-h-screen bg-slate-50 text-slate-900">
      {/* Topbar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div className="w-full">
            <AdminTopbar />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[auto_1fr]">
        {/* Sidebar desktop */}
        <aside
          className={[
            "hidden md:block",
            "sticky top-[72px] h-[calc(100vh-88px)] overflow-auto",
            "rounded-2xl border border-slate-200 bg-white shadow-sm",
            collapsed ? "w-[84px]" : "w-[280px]",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-2 p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white font-extrabold">
                A
              </div>
              {!collapsed ? (
                <div>
                  <div className="text-sm font-extrabold">ApiWorking</div>
                  <div className="text-xs text-slate-500">CMS Admin</div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
              onClick={() => setCollapsed((v) => !v)}
              title={collapsed ? "Expandir" : "Colapsar"}
            >
              {collapsed ? "›" : "‹"}
            </button>
          </div>

          <div className="px-3 pb-3">
            {!collapsed ? (
              <div className="px-2 py-2 text-xs font-bold text-slate-500">
                Navegación
              </div>
            ) : null}

            <nav className="mt-1 space-y-1">
              {nav.map((it) => {
                const active = isActive(pathname, it.href);
                return (
                  <a
                    key={it.href}
                    href={it.href}
                    className={[
                      "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm",
                      active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg leading-none">{it.icon}</span>
                      {!collapsed ? <span className="font-medium">{it.label}</span> : null}
                    </div>

                    {!collapsed && it.badge ? (
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-500">
                        {it.badge}
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          {children}
        </main>
      </div>

      {/* Sidebar mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <div className="absolute left-0 top-0 h-full w-[300px] border-r border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold">Panel</div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>

            <nav className="mt-4 space-y-1">
              {nav.map((it) => {
                const active = isActive(pathname, it.href);
                return (
                  <a
                    key={it.href}
                    href={it.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
                      active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg leading-none">{it.icon}</span>
                      <span className="font-medium">{it.label}</span>
                    </div>
                    {it.badge ? (
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-500">
                        {it.badge}
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );

  return <AdminGuard>{Layout}</AdminGuard>;
}