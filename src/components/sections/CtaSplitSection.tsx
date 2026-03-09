"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";

type CtaSplitData = {
  title?: string;
  subtitle?: string;

  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };

  slides: Array<{
    imageUrl: string;
    alt?: string;
    caption?: string;
    href?: string;
  }>;
};

export default function CtaSplitSection({ data }: { data: any }) {
  const d = (data || {}) as CtaSplitData;

  const title = d.title || "¿Listo para revolucionar tu negocio?";
  const subtitle = d.subtitle || "Agenda tu demo personalizada y comienza hoy.";

  const primary = d.primaryCta?.text ? d.primaryCta : { text: "Agendar demo", href: "/contacto" };
  const secondary = d.secondaryCta?.text ? d.secondaryCta : { text: "Ver productos", href: "/productos" };

  const slides = Array.isArray(d.slides) ? d.slides : [];
  const hasSlides = slides.length > 0;

  const [idx, setIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const safeIdx = useMemo(
    () => (hasSlides ? ((idx % slides.length) + slides.length) % slides.length : 0),
    [idx, hasSlides, slides.length]
  );

  const goTo = useCallback(
    (next: number) => {
      if (!hasSlides || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setIdx(next);
        setIsTransitioning(false);
      }, 180);
    },
    [hasSlides, isTransitioning]
  );

  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);
  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const current = hasSlides ? slides[safeIdx] : null;
  const titleWords = title.split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <section className="cs-root">
        <div className="cs-blob-tl" />
        <div className="cs-blob-br" />
        <div className="cs-dotgrid" />

        <div className="cs-inner">
          <div className="cs-card">
            {/* Decorative ring */}
            <div className="cs-deco-ring" />

            <div className="cs-grid">
              {/* ── LEFT: CTA ── */}
              <div className="cs-left">
                <div className="cs-eyebrow">
                  <div className="cs-eyebrow-dot">
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="cs-eyebrow-text">Empieza ahora</span>
                </div>

                <h2 className="cs-title">
                  {titleEnd ? (
                    <>
                      <span className="cs-title-plain">{titleStart} </span>
                      <span className="cs-title-accent">{titleEnd}</span>
                    </>
                  ) : (
                    <span className="cs-title-accent">{titleStart}</span>
                  )}
                </h2>

                <p className="cs-subtitle">{subtitle}</p>

                <div className="cs-cta-row">
                  <Link href={primary.href} className="cs-btn-p">
                    {primary.text}
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link href={secondary.href} className="cs-btn-s">
                    {secondary.text}
                  </Link>
                </div>

                {/* Trust row */}
                <div className="cs-trust">
                  <div className="cs-trust-avatars">
                    {["A", "B", "C"].map((l, i) => (
                      <div key={i} className="cs-av">{l}</div>
                    ))}
                  </div>
                  <div className="cs-trust-copy">
                    <div className="cs-stars">★★★★★</div>
                    <span><strong>+2,400</strong> negocios activos · Sin tarjeta requerida</span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Slider ── */}
              <div className="cs-right">
                {/* Shadow tray */}
                <div className="cs-tray" />

                <div className="cs-slider-card">
                  {/* Topbar */}
                  <div className="cs-topbar">
                    <div className="cs-dots">
                      <span className="cs-dot cs-dot-r" />
                      <span className="cs-dot cs-dot-y" />
                      <span className="cs-dot cs-dot-g" />
                    </div>
                    <span className="cs-topbar-lbl">
                      {hasSlides ? `${safeIdx + 1} / ${slides.length}` : "Vista previa"}
                    </span>
                    <div className="cs-live">
                      <span className="cs-live-dot" />
                      Live
                    </div>
                  </div>

                  {/* Image */}
                  <div className={`cs-frame${isTransitioning ? " cs-frame--fade" : ""}`}>
                    {current ? (
                      current.href ? (
                        <a href={current.href} className="cs-frame-link" tabIndex={0} aria-label={current.alt || "Ver más"}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={current.imageUrl}
                            alt={current.alt || "Slide"}
                            className="cs-img"
                          />
                          <div className="cs-frame-overlay" />
                          <div className="cs-frame-arrow" aria-hidden="true">↗</div>
                        </a>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={current.imageUrl}
                            alt={current.alt || "Slide"}
                            className="cs-img"
                          />
                          <div className="cs-frame-overlay" />
                        </>
                      )
                    ) : (
                      <div className="cs-frame-empty">No hay slides configurados.</div>
                    )}
                  </div>

                  {/* Caption + controls */}
                  <div className="cs-controls">
                    <div className="cs-caption">
                      {current?.caption && (
                        <span className="cs-caption-text">{current.caption}</span>
                      )}
                    </div>

                    <div className="cs-nav">
                      {/* Dots */}
                      <div className="cs-nav-dots" role="tablist" aria-label="Slides">
                        {slides.slice(0, 8).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            role="tab"
                            aria-selected={i === safeIdx}
                            aria-label={`Slide ${i + 1}`}
                            onClick={() => goTo(i)}
                            className={`cs-nav-dot${i === safeIdx ? " cs-nav-dot--active" : ""}`}
                          />
                        ))}
                      </div>

                      {/* Arrows */}
                      <div className="cs-nav-arrows">
                        <button
                          type="button"
                          onClick={prev}
                          disabled={!hasSlides}
                          aria-label="Slide anterior"
                          className="cs-arrow"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          disabled={!hasSlides}
                          aria-label="Siguiente slide"
                          className="cs-arrow"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="cs-bar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --cs-green: #50B36D;
    --cs-green-hover: #149C3D;
    --cs-lime: #8BCB2E;
    --cs-dark: #222322;
    --cs-mid: #5F6661;
    --cs-bg: #FFFFFF;
    --cs-soft: #F5FBF6;
    --cs-border: #DCEEDF;
  }

  .cs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--cs-bg);
    color: var(--cs-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  /* Blobs */
  .cs-blob-tl {
    position: absolute;
    top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: cs-morph 16s ease-in-out infinite alternate;
  }
  .cs-blob-br {
    position: absolute;
    bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: cs-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes cs-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .cs-dotgrid {
    position: absolute; inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  /* Inner */
  .cs-inner {
    position: relative; z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .cs-inner { padding: 0 20px; } }

  /* Outer card container */
  .cs-card {
    position: relative;
    border-radius: 28px;
    border: 1.5px solid var(--cs-border);
    background: var(--cs-soft);
    padding: 48px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(34,35,34,0.07);
  }
  @media (max-width: 768px) { .cs-card { padding: 32px 24px; } }

  .cs-deco-ring {
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    border: 1.5px dashed rgba(139,203,46,0.25);
    pointer-events: none;
  }

  /* Grid */
  .cs-grid {
    display: grid;
    gap: 56px;
    align-items: center;
  }
  @media (min-width: 1024px) { .cs-grid { grid-template-columns: 1fr 1fr; } }

  /* LEFT */
  .cs-left { display: flex; flex-direction: column; }

  .cs-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--cs-bg);
    border: 1px solid var(--cs-border);
    width: fit-content;
    margin-bottom: 24px;
  }
  .cs-eyebrow-dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cs-green), var(--cs-lime));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cs-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--cs-green); }

  .cs-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.07;
    letter-spacing: -0.02em;
    color: var(--cs-dark);
    margin: 0 0 18px;
  }
  .cs-title-plain { color: var(--cs-dark); }
  .cs-title-accent {
    font-style: italic;
    color: var(--cs-green);
    position: relative;
    display: inline-block;
  }
  .cs-title-accent::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0; right: 0;
    height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: 60px 6px;
    opacity: 0.75;
  }

  .cs-subtitle {
    font-size: 1.0625rem;
    line-height: 1.75;
    color: var(--cs-mid);
    margin: 0 0 28px;
    max-width: 440px;
  }

  .cs-cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 28px; align-items: center; }

  .cs-btn-p {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 26px;
    border-radius: 14px;
    background: var(--cs-green);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    color: #fff;
    text-decoration: none;
    box-shadow: 0 6px 24px rgba(80,179,109,0.38), 0 1px 4px rgba(80,179,109,0.2);
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .cs-btn-p:hover { background: var(--cs-green-hover); transform: translateY(-2px); box-shadow: 0 10px 32px rgba(80,179,109,0.48); }

  .cs-btn-s {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 26px;
    border-radius: 14px;
    background: var(--cs-bg);
    border: 1.5px solid var(--cs-border);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    color: var(--cs-dark);
    text-decoration: none;
    transition: border-color 0.18s, background 0.18s, transform 0.18s;
  }
  .cs-btn-s:hover { border-color: var(--cs-green); background: rgba(80,179,109,0.05); transform: translateY(-2px); }

  /* Trust row */
  .cs-trust { display: flex; align-items: center; gap: 12px; }
  .cs-trust-avatars { display: flex; }
  .cs-av {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 2px solid var(--cs-bg);
    background: var(--cs-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800;
    color: var(--cs-green);
    margin-left: -7px;
  }
  .cs-av:first-child { margin-left: 0; }
  .cs-trust-copy { font-size: 12px; font-weight: 500; color: var(--cs-mid); }
  .cs-trust-copy strong { color: var(--cs-dark); font-weight: 800; }
  .cs-stars { color: var(--cs-lime); font-size: 11px; margin-bottom: 2px; }

  /* RIGHT */
  .cs-right { position: relative; }

  .cs-tray {
    position: absolute;
    bottom: -12px; left: 12px; right: -12px;
    height: 100%;
    border-radius: 24px;
    background: var(--cs-border);
    z-index: 0;
  }

  .cs-slider-card {
    position: relative; z-index: 1;
    border-radius: 22px;
    overflow: hidden;
    background: var(--cs-bg);
    border: 1.5px solid var(--cs-border);
    box-shadow: 0 16px 48px rgba(34,35,34,0.08), 0 2px 8px rgba(34,35,34,0.05);
  }

  /* Topbar */
  .cs-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 18px;
    background: var(--cs-soft);
    border-bottom: 1px solid var(--cs-border);
  }
  .cs-dots { display: flex; gap: 6px; }
  .cs-dot { width: 9px; height: 9px; border-radius: 50%; display: block; }
  .cs-dot-r { background: #f87171; }
  .cs-dot-y { background: #fbbf24; }
  .cs-dot-g { background: var(--cs-green); }
  .cs-topbar-lbl { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cs-mid); }
  .cs-live { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--cs-green); }
  .cs-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--cs-green);
    animation: cs-ping 2s ease-in-out infinite;
  }
  @keyframes cs-ping {
    0%, 100% { box-shadow: 0 0 0 0 rgba(80,179,109,0.5); }
    50% { box-shadow: 0 0 0 5px rgba(80,179,109,0); }
  }

  /* Frame */
  .cs-frame {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--cs-soft);
    position: relative;
    transition: opacity 0.18s ease;
  }
  .cs-frame--fade { opacity: 0; }
  .cs-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cs-frame-link { display: block; width: 100%; height: 100%; position: relative; }
  .cs-frame-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 55%, rgba(34,35,34,0.14) 100%);
    pointer-events: none;
  }
  .cs-frame-arrow {
    position: absolute; top: 12px; right: 14px;
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: var(--cs-green); font-weight: 700;
    box-shadow: 0 2px 8px rgba(34,35,34,0.12);
  }
  .cs-frame-empty {
    display: grid; place-items: center;
    height: 100%;
    font-size: 13px; color: var(--cs-mid);
  }

  /* Controls row */
  .cs-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    border-top: 1px solid var(--cs-border);
    background: var(--cs-soft);
  }
  .cs-caption { flex: 1; min-width: 0; }
  .cs-caption-text {
    font-size: 12.5px;
    color: var(--cs-mid);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .cs-nav { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

  .cs-nav-dots { display: flex; gap: 5px; }
  .cs-nav-dot {
    width: 7px; height: 7px;
    border-radius: 999px;
    border: 1.5px solid var(--cs-border);
    background: transparent;
    cursor: pointer;
    transition: background 0.18s, border-color 0.18s, width 0.22s;
    padding: 0;
  }
  .cs-nav-dot--active {
    background: var(--cs-green);
    border-color: var(--cs-green);
    width: 18px;
  }

  .cs-nav-arrows { display: flex; gap: 6px; }
  .cs-arrow {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    border-radius: 9px;
    background: var(--cs-bg);
    border: 1.5px solid var(--cs-border);
    color: var(--cs-dark);
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, color 0.18s, transform 0.18s;
  }
  .cs-arrow:hover:not(:disabled) {
    border-color: var(--cs-green);
    background: var(--cs-green);
    color: #fff;
    transform: scale(1.06);
  }
  .cs-arrow:disabled { opacity: 0.35; cursor: not-allowed; }

  /* Bottom accent bar */
  .cs-bar {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(to right, var(--cs-green), var(--cs-lime));
  }
`;