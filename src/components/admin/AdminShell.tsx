"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminTopbar from "@/components/admin/AdminTopbar";

type NavItem = { label: string; href: string; icon: string; badge?: string };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');

  .aw-admin, .aw-admin * {
    box-sizing: border-box;
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* ── TOPBAR ── */
  .aw-topbar {
    height: 52px;
    background: #fff;
    border-bottom: 1px solid #e7e5e4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 40;
    flex-shrink: 0;
  }
  .aw-topbar-left { display: flex; align-items: center; gap: 10px; }
  .aw-topbar-right { display: flex; align-items: center; gap: 8px; }

  /* Brand */
  .aw-brand { display: flex; align-items: center; gap: 8px; }
  .aw-brand-logo {
    width: 28px; height: 28px;
    border-radius: 7px;
    background: #18181b;
    color: #fff;
    font-size: 13px; font-weight: 700;
    display: grid; place-items: center;
    flex-shrink: 0;
    letter-spacing: -0.02em;
  }
  .aw-brand-name { font-size: 14px; font-weight: 600; color: #1c1917; letter-spacing: -0.02em; }
  .aw-brand-sep  { color: #d4d0cb; font-size: 16px; margin: 0 -2px; }
  .aw-brand-section { font-size: 13px; font-weight: 500; color: #78716c; }

  /* Icon btn */
  .aw-icon-btn {
    width: 32px; height: 32px;
    display: grid; place-items: center;
    border-radius: 7px;
    border: 1px solid #e7e5e4;
    background: transparent;
    color: #57534e;
    cursor: pointer;
    transition: background .12s, color .12s;
  }
  .aw-icon-btn:hover { background: #f5f5f4; color: #1c1917; }

  /* ── SIDEBAR ── */
  .aw-sidebar {
    width: 220px;
    flex-shrink: 0;
    background: #fff;
    border-right: 1px solid #e7e5e4;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 52px);
    position: sticky;
    top: 52px;
    overflow-y: auto;
    scrollbar-width: none;
    transition: width .18s ease;
  }
  .aw-sidebar::-webkit-scrollbar { display: none; }
  .aw-sidebar--collapsed { width: 60px; }

  /* ── NAV ── */
  .aw-nav { padding: 12px 10px; flex: 1; }

  .aw-nav-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: #a8a29e;
    padding: 4px 8px 8px;
    white-space: nowrap;
    overflow: hidden;
    min-height: 28px;
  }

  .aw-nav-link {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 8px;
    border-radius: 7px;
    font-size: 13.5px;
    font-weight: 500;
    color: #44403c;
    text-decoration: none;
    transition: background .1s, color .1s;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 1px;
    position: relative;
  }
  .aw-nav-link:hover { background: #f5f5f4; color: #1c1917; }
  .aw-nav-link--active {
    background: #f5f5f4;
    color: #1c1917;
    font-weight: 600;
  }
  .aw-nav-link--active::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    background: #18181b;
    border-radius: 0 3px 3px 0;
  }

  .aw-nav-icon { font-size: 15px; flex-shrink: 0; width: 20px; text-align: center; }
  .aw-nav-text { flex: 1; }

  .aw-nav-badge {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .03em;
    padding: 2px 6px;
    border-radius: 4px;
    background: #f5f5f4;
    border: 1px solid #e7e5e4;
    color: #a8a29e;
    white-space: nowrap;
  }

  /* Collapse button */
  .aw-collapse-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    border: none;
    border-top: 1px solid #f5f5f4;
    background: transparent;
    color: #a8a29e;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: color .12s, background .12s;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    font-family: inherit;
  }
  .aw-collapse-btn:hover { background: #f5f5f4; color: #57534e; }

  /* ── MAIN ── */
  .aw-main {
    flex: 1;
    padding: 28px 32px;
    overflow: auto;
    min-width: 0;
    background: #f5f5f4;
  }

  /* ── MOBILE DRAWER ── */
  .aw-drawer-overlay {
    position: fixed; inset: 0; z-index: 50;
  }
  .aw-drawer-scrim {
    position: absolute; inset: 0;
    background: rgba(0,0,0,.35);
    backdrop-filter: blur(2px);
    border: none; cursor: pointer; width: 100%; height: 100%;
  }
  .aw-drawer {
    position: absolute; left: 0; top: 0;
    width: 260px; height: 100%;
    background: #fff;
    border-right: 1px solid #e7e5e4;
    display: flex; flex-direction: column;
  }
  .aw-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #f5f5f4;
  }

  /* ── UTILS ── */
  .aw-mobile-only { display: grid; }

  @media (min-width: 768px) {
    .aw-mobile-only { display: none !important; }
  }
  @media (max-width: 767px) {
    .aw-sidebar-desktop { display: none !important; }
    .aw-main { padding: 20px 16px; }
  }
`;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

const nav: NavItem[] = useMemo(
  () => [
    { label: "Páginas", href: "/admin/pages", icon: "📄" },
    { label: "Header & Footer", href: "/admin/layout", icon: "🧭" },
    { label: "Multimedia", href: "/admin/media", icon: "🖼️", badge: "Pronto" },
    { label: "Ajustes", href: "/admin/settings", icon: "⚙️", badge: "Pronto" },
  ],
  []
);
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="aw-admin" style={{ minHeight: "100vh", background: "#f5f5f4", color: "#1c1917" }}>
        <style>{BASE_STYLES}</style>
        {children}
      </div>
    );
  }

  const Layout = (
    <div className="aw-admin" style={{ minHeight: "100vh", background: "#f5f5f4", color: "#1c1917", display: "flex", flexDirection: "column" }}>
      <style>{BASE_STYLES}</style>

      {/* ── TOP BAR ── */}
      <header className="aw-topbar">
        <div className="aw-topbar-left">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="aw-icon-btn aw-mobile-only"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect y="2"    width="16" height="1.5" rx=".75" fill="currentColor"/>
              <rect y="7.25" width="16" height="1.5" rx=".75" fill="currentColor"/>
              <rect y="12.5" width="16" height="1.5" rx=".75" fill="currentColor"/>
            </svg>
          </button>

          {/* Brand */}
          <div className="aw-brand">
            <div className="aw-brand-logo">A</div>
            <span className="aw-brand-name">ApiWorking</span>
            <span className="aw-brand-sep">/</span>
            <span className="aw-brand-section">CMS</span>
          </div>
        </div>

        <div className="aw-topbar-right">
          <AdminTopbar />
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── SIDEBAR desktop ── */}
        <aside
          className={`aw-sidebar aw-sidebar-desktop${collapsed ? " aw-sidebar--collapsed" : ""}`}
        >
          <nav className="aw-nav">
            {!collapsed && <div className="aw-nav-label">Contenido</div>}
            {nav.map((it) => {
              const active = isActive(pathname, it.href);
              return (
                <a
                  key={it.href}
                  href={it.href}
                  className={`aw-nav-link${active ? " aw-nav-link--active" : ""}`}
                  title={collapsed ? it.label : undefined}
                >
                  <span className="aw-nav-icon">{it.icon}</span>
                  {!collapsed && <span className="aw-nav-text">{it.label}</span>}
                  {!collapsed && it.badge && (
                    <span className="aw-nav-badge">{it.badge}</span>
                  )}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className="aw-collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}
            >
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!collapsed && <span>Colapsar</span>}
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="aw-main">
          {children}
        </main>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="aw-drawer-overlay">
          <button
            type="button"
            className="aw-drawer-scrim"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside className="aw-drawer">
            <div className="aw-drawer-head">
              <div className="aw-brand">
                <div className="aw-brand-logo">A</div>
                <span className="aw-brand-name">ApiWorking</span>
              </div>
              <button
                type="button"
                className="aw-icon-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <nav className="aw-nav">
              <div className="aw-nav-label">Contenido</div>
              {nav.map((it) => {
                const active = isActive(pathname, it.href);
                return (
                  <a
                    key={it.href}
                    href={it.href}
                    onClick={() => setMobileOpen(false)}
                    className={`aw-nav-link${active ? " aw-nav-link--active" : ""}`}
                  >
                    <span className="aw-nav-icon">{it.icon}</span>
                    <span className="aw-nav-text">{it.label}</span>
                    {it.badge && <span className="aw-nav-badge">{it.badge}</span>}
                  </a>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );

  return <AdminGuard>{Layout}</AdminGuard>;
}