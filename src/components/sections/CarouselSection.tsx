"use client";

import React, { useMemo, useState, useCallback } from "react";

export default function CarouselSection({
  data,
}: {
  data: { title?: string; items: Array<{ imageUrl: string; alt?: string; caption?: string; href?: string }> };
}) {
  const items = useMemo(() => data.items || [], [data.items]);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (fading || items.length < 2) return;
      setFading(true);
      setTimeout(() => {
        setIndex(((next % items.length) + items.length) % items.length);
        setFading(false);
      }, 160);
    },
    [fading, items.length]
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  if (!items.length) return null;

  const current = items[index];

  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  const imgEl = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={current.imageUrl}
      alt={current.alt ?? ""}
      className="cr-img"
    />
  );

  return (
    <>
      <style>{STYLES}</style>
      <section className="cr-root">
        <div className="cr-blob-tl" />
        <div className="cr-blob-br" />
        <div className="cr-dotgrid" />

        <div className="cr-inner">
          {data.title && (
            <div className="cr-header">
              <div className="cr-eyebrow">
                <div className="cr-eyebrow-dot">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                  </svg>
                </div>
                <span className="cr-eyebrow-text">Galería</span>
              </div>

              <h2 className="cr-title">
                {titleEnd ? (
                  <>
                    <span className="cr-title-plain">{titleStart} </span>
                    <span className="cr-title-accent">{titleEnd}</span>
                  </>
                ) : (
                  <span className="cr-title-accent">{titleStart}</span>
                )}
              </h2>
            </div>
          )}

          <div className="cr-tray" />

          <div className="cr-card">
            {/* Topbar */}
            <div className="cr-topbar">
              <div className="cr-dots">
                <span className="cr-dot cr-dot-r" />
                <span className="cr-dot cr-dot-y" />
                <span className="cr-dot cr-dot-g" />
              </div>
              <span className="cr-topbar-lbl">
                {index + 1} / {items.length}
              </span>
              <div className="cr-live">
                <span className="cr-live-dot" />
                Live
              </div>
            </div>

            {/* Image frame */}
            <div className={`cr-frame${fading ? " cr-frame--fade" : ""}`}>
              {current.href ? (
                <a
                  href={current.href}
                  className="cr-frame-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={current.alt || "Ver imagen"}
                >
                  {imgEl}
                  <div className="cr-frame-overlay" />
                  <span className="cr-link-arrow" aria-hidden="true">↗</span>
                </a>
              ) : (
                <>
                  {imgEl}
                  <div className="cr-frame-overlay" />
                </>
              )}

              {/* Arrow buttons */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="cr-arrow cr-arrow--l"
                    aria-label="Anterior"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="cr-arrow cr-arrow--r"
                    aria-label="Siguiente"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="cr-footer">
              <div className="cr-caption">
                {current.caption && (
                  <span className="cr-caption-text">{current.caption}</span>
                )}
              </div>

              <div
                className="cr-nav-dots"
                role="tablist"
                aria-label="Slides"
              >
                {items.slice(0, 10).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`cr-nav-dot${i === index ? " cr-nav-dot--active" : ""}`}
                  />
                ))}
              </div>
            </div>

            <div className="cr-bar" />
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --cr-green: #50B36D;
    --cr-lime: #8BCB2E;
    --cr-dark: #222322;
    --cr-mid: #5F6661;
    --cr-bg: #FFFFFF;
    --cr-soft: #F5FBF6;
    --cr-border: #DCEEDF;
  }

  .cr-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--cr-bg);
    color: var(--cr-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .cr-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: cr-morph 16s ease-in-out infinite alternate;
  }
  .cr-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: cr-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes cr-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .cr-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .cr-inner {
    position: relative; z-index: 2;
    max-width: 900px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .cr-inner { padding: 0 20px; } }

  /* Header */
  .cr-header { margin-bottom: 40px; }
  .cr-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--cr-soft); border: 1px solid var(--cr-border);
    margin-bottom: 20px;
  }
  .cr-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--cr-green), var(--cr-lime));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cr-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--cr-green); }
  .cr-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--cr-dark); margin: 0;
  }
  .cr-title-plain { color: var(--cr-dark); }
  .cr-title-accent {
    font-style: italic; color: var(--cr-green);
    position: relative; display: inline;
  }
  .cr-title-accent::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 6px; opacity: 0.75;
  }

  /* Shadow tray */
  .cr-tray {
    position: absolute;
    bottom: -12px; left: 52px; right: -12px;
    height: calc(100% - 180px);
    border-radius: 24px;
    background: var(--cr-border);
    z-index: 1;
  }

  /* Card */
  .cr-card {
    position: relative; z-index: 2;
    border-radius: 22px; overflow: hidden;
    background: var(--cr-bg);
    border: 1.5px solid var(--cr-border);
    box-shadow: 0 16px 48px rgba(34,35,34,0.08), 0 2px 8px rgba(34,35,34,0.05);
  }

  /* Topbar */
  .cr-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 18px;
    background: var(--cr-soft);
    border-bottom: 1px solid var(--cr-border);
  }
  .cr-dots { display: flex; gap: 6px; }
  .cr-dot { width: 9px; height: 9px; border-radius: 50%; display: block; }
  .cr-dot-r { background: #f87171; }
  .cr-dot-y { background: #fbbf24; }
  .cr-dot-g { background: var(--cr-green); }
  .cr-topbar-lbl { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cr-mid); }
  .cr-live { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--cr-green); }
  .cr-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--cr-green);
    animation: cr-ping 2s ease-in-out infinite;
  }
  @keyframes cr-ping {
    0%, 100% { box-shadow: 0 0 0 0 rgba(80,179,109,0.5); }
    50% { box-shadow: 0 0 0 5px rgba(80,179,109,0); }
  }

  /* Frame */
  .cr-frame {
    position: relative;
    width: 100%; aspect-ratio: 16/9;
    overflow: hidden;
    background: var(--cr-soft);
    transition: opacity 0.16s ease;
  }
  .cr-frame--fade { opacity: 0; }
  .cr-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cr-frame-link { display: block; width: 100%; height: 100%; position: relative; }
  .cr-frame-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 55%, rgba(34,35,34,0.15) 100%);
    pointer-events: none;
  }
  .cr-link-arrow {
    position: absolute; top: 12px; right: 14px;
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,255,255,0.9); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: var(--cr-green); font-weight: 700;
    box-shadow: 0 2px 8px rgba(34,35,34,0.12);
  }

  /* Arrow nav */
  .cr-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 40px; height: 40px;
    border-radius: 12px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(8px);
    border: 1.5px solid var(--cr-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--cr-dark); cursor: pointer;
    box-shadow: 0 4px 16px rgba(34,35,34,0.12);
    transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
    z-index: 5;
  }
  .cr-arrow--l { left: 14px; }
  .cr-arrow--r { right: 14px; }
  .cr-arrow:hover {
    background: var(--cr-green); border-color: var(--cr-green); color: #fff;
    transform: translateY(-50%) scale(1.06);
  }

  /* Footer */
  .cr-footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 13px 18px;
    background: var(--cr-soft);
    border-top: 1px solid var(--cr-border);
  }
  .cr-caption { flex: 1; min-width: 0; }
  .cr-caption-text {
    font-size: 12.5px; color: var(--cr-mid); font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;
  }

  .cr-nav-dots { display: flex; gap: 5px; flex-shrink: 0; }
  .cr-nav-dot {
    width: 7px; height: 7px; border-radius: 999px;
    border: 1.5px solid var(--cr-border);
    background: transparent; cursor: pointer;
    transition: background 0.18s, border-color 0.18s, width 0.22s;
    padding: 0;
  }
  .cr-nav-dot--active {
    background: var(--cr-green); border-color: var(--cr-green); width: 18px;
  }

  /* Bar */
  .cr-bar {
    height: 3px;
    background: linear-gradient(to right, var(--cr-green), var(--cr-lime));
  }
`;