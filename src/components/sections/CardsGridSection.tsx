import Link from "next/link";

type CardsGridData = {
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  cards: Array<{
    imageUrl: string;
    imageAlt?: string;
    title: string;
    text?: string;
    ctaText?: string;
    ctaHref?: string;
  }>;
};

function colsCss(cols?: number) {
  if (cols === 2) return "cg-cols-2";
  if (cols === 4) return "cg-cols-4";
  return "cg-cols-3";
}

export default function CardsGridSection({ data }: { data: any }) {
  const d = (data || {}) as CardsGridData;

  const title = d.title || "Soluciones especializadas por sector";
  const subtitle = d.subtitle || "";
  const columns = d.columns || 3;
  const cards = Array.isArray(d.cards) ? d.cards : [];

  if (!cards.length) {
    return (
      <>
        <style>{BASE_STYLES}</style>
        <section className="cg-root">
          <div className="cg-inner">
            <div className="cg-empty">
              <div className="cg-empty-title">{title}</div>
              <div className="cg-empty-sub">No hay tarjetas configuradas.</div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{BASE_STYLES}</style>
      <section className="cg-root">
        {/* Background blobs */}
        <div className="cg-blob-tl" />
        <div className="cg-blob-br" />
        <div className="cg-dotgrid" />

        <div className="cg-inner">
          {/* Header */}
          <div className="cg-header">
            <div className="cg-eyebrow">
              <div className="cg-eyebrow-dot">
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
                </svg>
              </div>
              <span className="cg-eyebrow-text">Categorías</span>
            </div>

            <h2 className="cg-title">{title}</h2>
            {subtitle ? <p className="cg-subtitle">{subtitle}</p> : null}
          </div>

          {/* Grid */}
          <div className={`cg-grid ${colsCss(columns)}`}>
            {cards.map((c, i) => (
              <div key={i} className="cg-card">
                {/* Image */}
                <div className="cg-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.imageUrl || `https://picsum.photos/seed/card${i}/800/600`}
                    alt={c.imageAlt || c.title || "Card"}
                    className="cg-img"
                  />
                  <div className="cg-img-overlay" />
                  <div className="cg-img-num">0{i + 1}</div>
                </div>

                {/* Body */}
                <div className="cg-body">
                  <div className="cg-card-title">{c.title}</div>
                  {c.text ? <div className="cg-card-text">{c.text}</div> : null}

                  {c.ctaHref ? (
                    <div className="cg-cta-wrap">
                      <Link href={c.ctaHref} className="cg-btn">
                        {c.ctaText || "Ver más"}
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  ) : null}
                </div>

                {/* Bottom accent bar */}
                <div className="cg-card-bar" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --cg-green: #50B36D;
    --cg-green-hover: #149C3D;
    --cg-lime: #8BCB2E;
    --cg-dark: #222322;
    --cg-mid: #5F6661;
    --cg-bg: #FFFFFF;
    --cg-soft: #F5FBF6;
    --cg-border: #DCEEDF;
  }

  .cg-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--cg-bg);
    color: var(--cg-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  /* Blobs */
  .cg-blob-tl {
    position: absolute;
    top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: cg-morph 16s ease-in-out infinite alternate;
  }
  .cg-blob-br {
    position: absolute;
    bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: cg-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes cg-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }

  .cg-dotgrid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  /* Inner */
  .cg-inner {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .cg-inner { padding: 0 20px; } }

  /* Header */
  .cg-header { margin-bottom: 48px; }

  .cg-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--cg-soft);
    border: 1px solid var(--cg-border);
    width: fit-content;
    margin-bottom: 20px;
  }
  .cg-eyebrow-dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cg-green), var(--cg-lime));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cg-eyebrow-text {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.04em; color: var(--cg-green);
  }

  .cg-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--cg-dark);
    margin: 0 0 12px;
  }

  .cg-subtitle {
    font-size: 1.0625rem;
    font-weight: 400;
    line-height: 1.7;
    color: var(--cg-mid);
    max-width: 560px;
    margin: 0;
  }

  /* Grid */
  .cg-grid {
    display: grid;
    gap: 24px;
  }
  .cg-cols-2 { grid-template-columns: repeat(1, 1fr); }
  .cg-cols-3 { grid-template-columns: repeat(1, 1fr); }
  .cg-cols-4 { grid-template-columns: repeat(1, 1fr); }

  @media (min-width: 640px) {
    .cg-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .cg-cols-3 { grid-template-columns: repeat(2, 1fr); }
    .cg-cols-4 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .cg-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .cg-cols-4 { grid-template-columns: repeat(4, 1fr); }
  }

  /* Card */
  .cg-card {
    position: relative;
    border-radius: 22px;
    background: var(--cg-bg);
    border: 1.5px solid var(--cg-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 24px rgba(34,35,34,0.06), 0 1px 4px rgba(34,35,34,0.04);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .cg-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(80,179,109,0.14), 0 4px 16px rgba(34,35,34,0.08);
  }
  .cg-card:hover .cg-card-bar { opacity: 1; }
  .cg-card:hover .cg-img { transform: scale(1.04); }
  .cg-card:hover .cg-img-num { opacity: 1; transform: translateY(0); }

  /* Image */
  .cg-img-wrap {
    position: relative;
    overflow: hidden;
    height: 188px;
    flex-shrink: 0;
    background: var(--cg-soft);
  }
  .cg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .cg-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(34,35,34,0.18) 100%);
    pointer-events: none;
  }
  .cg-img-num {
    position: absolute;
    top: 12px; right: 14px;
    font-family: 'Fraunces', serif;
    font-size: 13px;
    font-weight: 900;
    font-style: italic;
    color: #fff;
    background: rgba(80,179,109,0.75);
    backdrop-filter: blur(6px);
    border-radius: 8px;
    padding: 3px 10px;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 0.22s, transform 0.22s;
  }

  /* Body */
  .cg-body {
    padding: 20px 22px 22px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .cg-card-title {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.25;
    color: var(--cg-dark);
    margin-bottom: 8px;
  }
  .cg-card-text {
    font-size: 13.5px;
    color: var(--cg-mid);
    line-height: 1.65;
    flex: 1;
  }
  .cg-cta-wrap { margin-top: 18px; }
  .cg-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 10px;
    background: var(--cg-soft);
    border: 1.5px solid var(--cg-border);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--cg-green);
    text-decoration: none;
    transition: background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .cg-btn:hover {
    background: var(--cg-green);
    border-color: var(--cg-green);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(80,179,109,0.35);
  }

  /* Bottom accent bar */
  .cg-card-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(to right, var(--cg-green), var(--cg-lime));
    opacity: 0;
    transition: opacity 0.22s;
  }

  /* Empty */
  .cg-empty {
    padding: 32px;
    border-radius: 20px;
    border: 1.5px solid var(--cg-border);
    background: var(--cg-soft);
  }
  .cg-empty-title { font-family: 'Fraunces', serif; font-size: 1.25rem; font-weight: 900; color: var(--cg-dark); }
  .cg-empty-sub { margin-top: 8px; font-size: 14px; color: var(--cg-mid); }
`;