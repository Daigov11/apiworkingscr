"use client";

import React, { useEffect, useState, useCallback } from "react";

export type HeaderLink = {
  href: string;
  label: string;
};

export type HeaderCta = {
  href?: string;
  text?: string;
} | null;

export type HeaderData = {
  logoUrl?: string | null;
  links?: HeaderLink[];
  cta?: HeaderCta;
};

export default function HeaderClient({ data }: { data: HeaderData }) {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links  = Array.isArray(data?.links) ? data.links : [];
  const cta    = data?.cta ?? null;
  const logoUrl = data?.logoUrl ?? null;

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setIsOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 12); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <style>{STYLES}</style>

      <header className={`hd-root${scrolled ? " hd-root--scrolled" : ""}`}>
        <div className="hd-inner">

          {/* Logo */}
          <a href="/" className="hd-logo" onClick={closeMenu} aria-label="Ir al inicio">
            {logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoUrl} alt="Logo" className="hd-logo-img" />
            ) : (
              <>
                <span className="hd-logo-mark">A</span>
                <span className="hd-logo-name">ApiWorking</span>
              </>
            )}
          </a>

          {/* Desktop nav */}
          {links.length > 0 && (
            <nav className="hd-nav" aria-label="Navegación principal">
              {links.map((item) => (
                <a key={`${item.href}-${item.label}`} href={item.href} className="hd-nav-link">
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Desktop CTA + hamburger */}
          <div className="hd-actions">
            {cta?.href && cta?.text && (
              <a href={cta.href} className="hd-cta">
                {cta.text}
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            )}

            <button
              type="button"
              className={`hd-burger${isOpen ? " hd-burger--open" : ""}`}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              aria-controls="hd-mobile-menu"
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className="hd-bline" />
              <span className="hd-bline" />
              <span className="hd-bline" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          className="hd-overlay"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="hd-mobile-menu"
        className={`hd-drawer${isOpen ? " hd-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="hd-drawer-top">
          <a href="/" className="hd-logo" onClick={closeMenu} aria-label="Ir al inicio">
            <span className="hd-logo-mark">A</span>
            <span className="hd-logo-name">ApiWorking</span>
          </a>
          <button
            type="button"
            className="hd-drawer-close"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="hd-drawer-nav" aria-label="Navegación móvil">
          {links.map((item) => (
            <a
              key={`mobile-${item.href}-${item.label}`}
              href={item.href}
              className="hd-drawer-link"
              onClick={closeMenu}
            >
              <span className="hd-drawer-dot" />
              {item.label}
              <svg className="hd-drawer-arrow" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          ))}
        </nav>

        {cta?.href && cta?.text && (
          <div className="hd-drawer-footer">
            <a href={cta.href} className="hd-drawer-cta" onClick={closeMenu}>
              {cta.text}
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,800&display=swap');

  :root {
    --hd-green: #50B36D; --hd-green-h: #149C3D; --hd-lime: #8BCB2E;
    --hd-dark: #222322; --hd-mid: #5F6661;
    --hd-bg: #FFFFFF; --hd-soft: #F5FBF6; --hd-border: #DCEEDF;
    --hd-h: 64px;
  }

  .hd-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1.5px solid transparent;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .hd-root--scrolled {
    background: rgba(255,255,255,0.97);
    border-color: var(--hd-border);
    box-shadow: 0 4px 24px rgba(34,35,34,0.07);
  }

  .hd-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 40px;
    height: var(--hd-h); display: flex; align-items: center; gap: 32px;
  }
  @media (max-width: 640px) { .hd-inner { padding: 0 20px; } }

  /* Logo */
  .hd-logo { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; flex-shrink: 0; }
  .hd-logo-mark { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, var(--hd-green), var(--hd-lime)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 800; font-style: italic; font-size: 16px; color: #fff; box-shadow: 0 3px 10px rgba(80,179,109,0.32); flex-shrink: 0; }
  .hd-logo-img { height: 32px; width: auto; object-fit: contain; display: block; }
  .hd-logo-name { font-family: 'Fraunces', serif; font-weight: 800; font-size: 17px; color: var(--hd-dark); letter-spacing: -0.02em; }

  /* Desktop nav */
  .hd-nav { display: flex; align-items: center; gap: 2px; flex: 1; }
  @media (max-width: 767px) { .hd-nav { display: none; } }
  .hd-nav-link { font-size: 14px; font-weight: 600; color: var(--hd-mid); text-decoration: none; padding: 7px 13px; border-radius: 10px; transition: color .18s, background .18s; position: relative; }
  .hd-nav-link::after { content: ''; position: absolute; bottom: 4px; left: 13px; right: 13px; height: 2px; border-radius: 1px; background: linear-gradient(to right, var(--hd-green), var(--hd-lime)); transform: scaleX(0); transform-origin: left; transition: transform .2s; }
  .hd-nav-link:hover { color: var(--hd-dark); background: var(--hd-soft); }
  .hd-nav-link:hover::after { transform: scaleX(1); }

  /* Actions */
  .hd-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }

  .hd-cta { display: none; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 11px; background: var(--hd-green); font-size: 13.5px; font-weight: 700; color: #fff; text-decoration: none; box-shadow: 0 4px 14px rgba(80,179,109,0.34); transition: background .18s, transform .18s, box-shadow .18s; }
  @media (min-width: 768px) { .hd-cta { display: inline-flex; } }
  .hd-cta:hover { background: var(--hd-green-h); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(80,179,109,0.44); }

  /* Hamburger */
  .hd-burger { display: flex; flex-direction: column; justify-content: center; gap: 5px; width: 38px; height: 38px; border-radius: 10px; background: var(--hd-soft); border: 1.5px solid var(--hd-border); padding: 0 9px; cursor: pointer; transition: background .18s, border-color .18s; }
  @media (min-width: 768px) { .hd-burger { display: none; } }
  .hd-burger:hover { background: rgba(80,179,109,.08); border-color: var(--hd-green); }
  .hd-bline { display: block; height: 2px; border-radius: 1px; background: var(--hd-dark); transition: transform .22s, opacity .22s; transform-origin: center; }
  .hd-burger--open .hd-bline:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hd-burger--open .hd-bline:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hd-burger--open .hd-bline:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Overlay */
  .hd-overlay { position: fixed; inset: 0; z-index: 110; background: rgba(34,35,34,0.4); backdrop-filter: blur(3px); border: none; cursor: default; padding: 0; }

  /* Drawer */
  .hd-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 120; width: min(320px, 90vw); background: var(--hd-bg); border-left: 1.5px solid var(--hd-border); box-shadow: -8px 0 40px rgba(34,35,34,0.12); display: flex; flex-direction: column; transform: translateX(100%); transition: transform .28s cubic-bezier(.4,0,.2,1); }
  .hd-drawer--open { transform: translateX(0); }

  .hd-drawer-top { display: flex; align-items: center; justify-content: space-between; padding: 0 20px; height: var(--hd-h); border-bottom: 1px solid var(--hd-border); flex-shrink: 0; }
  .hd-drawer-close { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--hd-border); background: var(--hd-soft); display: flex; align-items: center; justify-content: center; color: var(--hd-mid); cursor: pointer; transition: border-color .18s, background .18s, color .18s; }
  .hd-drawer-close:hover { border-color: var(--hd-green); color: var(--hd-green); background: rgba(80,179,109,.08); }

  .hd-drawer-nav { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .hd-drawer-link { display: flex; align-items: center; gap: 10px; padding: 15px 20px; font-size: 15px; font-weight: 600; color: var(--hd-dark); text-decoration: none; border-bottom: 1px solid var(--hd-border); transition: background .15s, color .15s; }
  .hd-drawer-link:hover { background: var(--hd-soft); color: var(--hd-green); }
  .hd-drawer-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, var(--hd-green), var(--hd-lime)); flex-shrink: 0; }
  .hd-drawer-arrow { margin-left: auto; color: var(--hd-border); flex-shrink: 0; transition: color .15s; }
  .hd-drawer-link:hover .hd-drawer-arrow { color: var(--hd-green); }

  .hd-drawer-footer { padding: 20px; border-top: 1px solid var(--hd-border); flex-shrink: 0; }
  .hd-drawer-cta { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; padding: 14px 20px; border-radius: 13px; background: var(--hd-green); color: #fff; font-size: 14.5px; font-weight: 700; text-decoration: none; box-shadow: 0 5px 18px rgba(80,179,109,0.38); transition: background .18s, transform .18s; }
  .hd-drawer-cta:hover { background: var(--hd-green-h); transform: translateY(-1px); }
`;