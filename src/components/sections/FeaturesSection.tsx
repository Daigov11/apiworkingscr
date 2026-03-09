import React from "react";

type FeatureItem = {
  title: string;
  text: string;
  icon?: string;
};

type FeaturesSectionData = {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  textAlign?: "left" | "center";
  columns?: 2 | 3 | 4;
  variant?: "default" | "soft";
};

const ICON_SVG: Record<string, React.ReactNode> = {
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 1 0 7.07 7.07L14 19" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <path d="M20 17.5A4.5 4.5 0 0 0 18 9h-1a7 7 0 0 0-13 2 4 4 0 0 0 1 7.8h15Z" />
    </svg>
  ),
  receipt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <path d="M3 20h18M7 16V8M12 16V4M17 16v-6" />
    </svg>
  ),
  device: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fs-icon-svg">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.8a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87L4.2 6.27A2 2 0 1 1 7.03 3.44l.06.06A1.7 1.7 0 0 0 9 4.6c.39 0 .76-.14 1.04-.4.3-.28.47-.66.46-1.06V3a2 2 0 1 1 4 0v.1c0 .4.16.78.46 1.06.28.26.65.4 1.04.4a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .39.14.76.4 1.04.28.3.66.47 1.06.46h.1a2 2 0 1 1 0 4h-.1c-.4 0-.78.16-1.06.46-.26.28-.4.65-.4 1.04Z" />
    </svg>
  ),
};

function FeatureIcon({ name }: { name?: string }) {
  if (!name) return null;
  const key = String(name).trim().toLowerCase();
  const node = ICON_SVG[key];
  return (
    <div className="fs-icon-wrap">
      {node ?? <span className="fs-icon-fallback">{name}</span>}
    </div>
  );
}

function getColClass(columns?: 2 | 3 | 4) {
  if (columns === 2) return "fs-cols-2";
  if (columns === 4) return "fs-cols-4";
  return "fs-cols-3";
}

export default function FeaturesSection({ data }: { data: FeaturesSectionData }) {
  const columns = data.columns ?? 3;
  const isCentered = data.textAlign === "center";

  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <section className="fs-root">
        <div className="fs-blob-tl" />
        <div className="fs-blob-br" />
        <div className="fs-dotgrid" />

        <div className="fs-inner">
          {(data.title || data.subtitle) && (
            <div className={isCentered ? "fs-header fs-header--center" : "fs-header"}>
              <div className={isCentered ? "fs-eyebrow-wrap fs-eyebrow-wrap--center" : "fs-eyebrow-wrap"}>
                <div className="fs-eyebrow">
                  <div className="fs-eyebrow-dot">
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="fs-eyebrow-text">Características</span>
                </div>
              </div>

              {data.title && (
                <h2 className={isCentered ? "fs-title fs-title--center" : "fs-title"}>
                  {titleEnd ? (
                    <>
                      <span className="fs-title-plain">{titleStart} </span>
                      <span className="fs-title-accent">{titleEnd}</span>
                    </>
                  ) : (
                    <span className="fs-title-accent">{titleStart}</span>
                  )}
                </h2>
              )}

              {data.subtitle && (
                <p className={isCentered ? "fs-subtitle fs-subtitle--center" : "fs-subtitle"}>
                  {data.subtitle}
                </p>
              )}
            </div>
          )}

          <div className={`fs-grid ${getColClass(columns)}`}>
            {data.items.map((item, i) => (
              <div key={i} className="fs-card">
                <div className="fs-card-top">
                  {item.icon && <FeatureIcon name={item.icon} />}
                  <div className="fs-card-num">0{i + 1}</div>
                </div>
                <div className="fs-card-title">{item.title}</div>
                <p className="fs-card-text">{item.text}</p>
                <div className="fs-card-bar" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --fs-green: #50B36D;
    --fs-green-hover: #149C3D;
    --fs-lime: #8BCB2E;
    --fs-dark: #222322;
    --fs-mid: #5F6661;
    --fs-bg: #FFFFFF;
    --fs-soft: #F5FBF6;
    --fs-border: #DCEEDF;
  }

  .fs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--fs-bg);
    color: var(--fs-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .fs-blob-tl {
    position: absolute;
    top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: fs-morph 16s ease-in-out infinite alternate;
  }
  .fs-blob-br {
    position: absolute;
    bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: fs-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes fs-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }

  .fs-dotgrid {
    position: absolute; inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .fs-inner {
    position: relative; z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .fs-inner { padding: 0 20px; } }

  .fs-header { margin-bottom: 52px; }
  .fs-header--center { text-align: center; }

  .fs-eyebrow-wrap { margin-bottom: 20px; }
  .fs-eyebrow-wrap--center { display: flex; justify-content: center; }

  .fs-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--fs-soft);
    border: 1px solid var(--fs-border);
  }
  .fs-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--fs-green), var(--fs-lime));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .fs-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--fs-green); }

  .fs-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--fs-dark);
    margin: 0 0 16px;
  }
  .fs-title--center { text-align: center; }
  .fs-title-plain { color: var(--fs-dark); }
  .fs-title-accent {
    font-style: italic; color: var(--fs-green);
    position: relative; display: inline;
  }
  .fs-title-accent::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0; right: 0;
    height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: 60px 6px;
    opacity: 0.75;
  }

  .fs-subtitle {
    font-size: 1.0625rem; font-weight: 400;
    line-height: 1.75; color: var(--fs-mid);
    margin: 0; max-width: 560px;
  }
  .fs-subtitle--center { margin: 0 auto; text-align: center; }

  .fs-grid { display: grid; gap: 20px; }
  .fs-cols-2 { grid-template-columns: 1fr; }
  .fs-cols-3 { grid-template-columns: 1fr; }
  .fs-cols-4 { grid-template-columns: 1fr; }

  @media (min-width: 768px) {
    .fs-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .fs-cols-3 { grid-template-columns: repeat(2, 1fr); }
    .fs-cols-4 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1280px) {
    .fs-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .fs-cols-4 { grid-template-columns: repeat(4, 1fr); }
  }

  .fs-card {
    position: relative;
    padding: 28px 26px 32px;
    border-radius: 22px;
    background: var(--fs-bg);
    border: 1.5px solid var(--fs-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(34,35,34,0.05), 0 1px 4px rgba(34,35,34,0.04);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .fs-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(80,179,109,0.13), 0 4px 16px rgba(34,35,34,0.07);
    border-color: rgba(80,179,109,0.4);
  }
  .fs-card:hover .fs-card-bar { opacity: 1; }
  .fs-card:hover .fs-icon-wrap {
    background: linear-gradient(135deg, var(--fs-green), var(--fs-lime));
    border-color: transparent;
  }
  .fs-card:hover .fs-icon-wrap svg { stroke: #fff; }
  .fs-card:hover .fs-card-num { color: var(--fs-green); }

  .fs-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .fs-icon-wrap {
    width: 46px; height: 46px;
    border-radius: 14px;
    border: 1.5px solid var(--fs-border);
    background: var(--fs-soft);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.22s, border-color 0.22s;
  }
  .fs-icon-svg { width: 22px; height: 22px; color: var(--fs-green); transition: stroke 0.22s; }
  .fs-icon-fallback {
    font-size: 14px; font-weight: 800;
    color: var(--fs-green);
  }

  .fs-card-num {
    font-family: 'Fraunces', serif;
    font-size: 13px; font-weight: 900;
    font-style: italic;
    color: var(--fs-border);
    transition: color 0.22s;
    line-height: 1;
    padding-top: 2px;
  }

  .fs-card-title {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.25;
    color: var(--fs-dark);
    margin-bottom: 10px;
  }

  .fs-card-text {
    font-size: 13.5px;
    color: var(--fs-mid);
    line-height: 1.7;
    flex: 1;
    margin: 0;
  }

  .fs-card-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(to right, var(--fs-green), var(--fs-lime));
    opacity: 0;
    transition: opacity 0.22s;
  }
`;