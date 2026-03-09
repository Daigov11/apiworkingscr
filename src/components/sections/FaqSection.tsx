"use client";

import { useState } from "react";

export default function FaqSection({
  data,
}: {
  data: { title?: string; items: Array<{ question: string; answer: string }> };
}) {
  const items = Array.isArray(data.items) ? data.items : [];
  const [open, setOpen] = useState<number | null>(null);

  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
  }

  return (
    <>
      <style>{STYLES}</style>
      <section className="fq-root">
        <div className="fq-blob-tl" />
        <div className="fq-blob-br" />
        <div className="fq-dotgrid" />

        <div className="fq-inner">
          {data.title && (
            <div className="fq-header">
              <div className="fq-eyebrow">
                <div className="fq-eyebrow-dot">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="fq-eyebrow-text">Preguntas frecuentes</span>
              </div>

              <h2 className="fq-title">
                {titleEnd ? (
                  <>
                    <span className="fq-title-plain">{titleStart} </span>
                    <span className="fq-title-accent">{titleEnd}</span>
                  </>
                ) : (
                  <span className="fq-title-accent">{titleStart}</span>
                )}
              </h2>
            </div>
          )}

          <div className="fq-list">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={`fq-item${isOpen ? " fq-item--open" : ""}`}>
                  <button
                    type="button"
                    className="fq-trigger"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`fq-answer-${i}`}
                    id={`fq-question-${i}`}
                  >
                    <span className="fq-q-num">0{i + 1}</span>
                    <span className="fq-q-text">{it.question}</span>
                    <span className={`fq-icon${isOpen ? " fq-icon--open" : ""}`} aria-hidden="true">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={`fq-answer-${i}`}
                    role="region"
                    aria-labelledby={`fq-question-${i}`}
                    className={`fq-answer${isOpen ? " fq-answer--open" : ""}`}
                  >
                    <p className="fq-answer-text">{it.answer}</p>
                  </div>

                  <div className="fq-item-bar" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --fq-green: #50B36D;
    --fq-lime: #8BCB2E;
    --fq-dark: #222322;
    --fq-mid: #5F6661;
    --fq-bg: #FFFFFF;
    --fq-soft: #F5FBF6;
    --fq-border: #DCEEDF;
  }

  .fq-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--fq-bg);
    color: var(--fq-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .fq-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: fq-morph 16s ease-in-out infinite alternate;
  }
  .fq-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: fq-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes fq-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .fq-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .fq-inner {
    position: relative; z-index: 2;
    max-width: 860px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .fq-inner { padding: 0 20px; } }

  /* Header */
  .fq-header { margin-bottom: 48px; }

  .fq-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--fq-soft); border: 1px solid var(--fq-border);
    margin-bottom: 20px;
  }
  .fq-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--fq-green), var(--fq-lime));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .fq-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--fq-green); }

  .fq-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--fq-dark); margin: 0;
  }
  .fq-title-plain { color: var(--fq-dark); }
  .fq-title-accent {
    font-style: italic; color: var(--fq-green);
    position: relative; display: inline;
  }
  .fq-title-accent::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 6px; opacity: 0.75;
  }

  /* List */
  .fq-list { display: flex; flex-direction: column; gap: 10px; }

  /* Item */
  .fq-item {
    position: relative;
    border-radius: 18px;
    border: 1.5px solid var(--fq-border);
    background: var(--fq-bg);
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(34,35,34,0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .fq-item--open {
    border-color: rgba(80,179,109,0.45);
    box-shadow: 0 6px 28px rgba(80,179,109,0.10), 0 2px 8px rgba(34,35,34,0.05);
    background: var(--fq-soft);
  }
  .fq-item--open .fq-item-bar { opacity: 1; }
  .fq-item--open .fq-q-num { color: var(--fq-green); }

  /* Trigger */
  .fq-trigger {
    width: 100%;
    display: flex; align-items: center; gap: 14px;
    padding: 20px 22px;
    background: none; border: none; cursor: pointer;
    text-align: left;
  }
  .fq-trigger:focus-visible {
    outline: 2px solid var(--fq-green);
    outline-offset: -2px;
    border-radius: 16px;
  }

  .fq-q-num {
    font-family: 'Fraunces', serif;
    font-size: 12px; font-weight: 900;
    font-style: italic;
    color: var(--fq-border);
    flex-shrink: 0;
    transition: color 0.2s;
    min-width: 22px;
  }

  .fq-q-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px; font-weight: 700;
    color: var(--fq-dark);
    flex: 1; line-height: 1.4;
  }

  .fq-icon {
    flex-shrink: 0;
    width: 32px; height: 32px;
    border-radius: 9px;
    border: 1.5px solid var(--fq-border);
    background: var(--fq-soft);
    display: flex; align-items: center; justify-content: center;
    color: var(--fq-mid);
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.25s;
  }
  .fq-icon--open {
    background: var(--fq-green);
    border-color: var(--fq-green);
    color: #fff;
    transform: rotate(180deg);
  }

  /* Answer — CSS height animation via grid trick */
  .fq-answer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.28s ease;
  }
  .fq-answer--open {
    grid-template-rows: 1fr;
  }
  .fq-answer > p {
    overflow: hidden;
  }
  .fq-answer-text {
    font-size: 14.5px; line-height: 1.75;
    color: var(--fq-mid);
    padding: 0 22px 22px 58px;
    margin: 0;
  }
  @media (max-width: 480px) {
    .fq-answer-text { padding: 0 18px 18px 18px; }
  }

  /* Bottom accent */
  .fq-item-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, var(--fq-green), var(--fq-lime));
    opacity: 0; transition: opacity 0.2s;
  }
`;