export default function PricingSection({
  data,
}: {
  data: {
    title?: string;
    subtitle?: string;
    plans: Array<{
      name: string;
      price: string;
      period?: string;
      features: string[];
      ctaText?: string;
      ctaHref?: string;
      highlighted?: boolean;
    }>;
  };
}) {
  const plans = Array.isArray(data.plans) ? data.plans : [];

  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  const colClass =
    plans.length === 1 ? "ps-cols-1" :
    plans.length === 2 ? "ps-cols-2" :
    "ps-cols-3";

  return (
    <>
      <style>{STYLES}</style>
      <section className="ps-root">
        <div className="ps-blob-tl" />
        <div className="ps-blob-br" />
        <div className="ps-dotgrid" />

        <div className="ps-inner">
          {(data.title || data.subtitle) && (
            <div className="ps-header">
              {data.title && (
                <>
                  <div className="ps-eyebrow-wrap">
                    <div className="ps-eyebrow">
                      <div className="ps-eyebrow-dot">
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ps-eyebrow-text">Planes y precios</span>
                    </div>
                  </div>

                  <h2 className="ps-title">
                    {titleEnd ? (
                      <>
                        <span className="ps-title-plain">{titleStart} </span>
                        <span className="ps-title-accent">{titleEnd}</span>
                      </>
                    ) : (
                      <span className="ps-title-accent">{titleStart}</span>
                    )}
                  </h2>
                </>
              )}

              {data.subtitle && <p className="ps-subtitle">{data.subtitle}</p>}
            </div>
          )}

          <div className={`ps-grid ${colClass}`}>
            {plans.map((p, i) => (
              <div key={i} className={`ps-card${p.highlighted ? " ps-card--hl" : ""}`}>
                {p.highlighted && (
                  <div className="ps-popular">
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Más popular
                  </div>
                )}

                <div className="ps-plan-name">{p.name}</div>

                <div className="ps-price-block">
                  <span className="ps-price">{p.price}</span>
                  {p.period && <span className="ps-period">/{p.period}</span>}
                </div>

                <ul className="ps-features">
                  {(Array.isArray(p.features) ? p.features : []).map((f, fi) => (
                    <li key={fi} className="ps-feature">
                      <div className="ps-feature-icon">
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {p.ctaText && p.ctaHref && (
                  <a
                    href={p.ctaHref}
                    className={`ps-cta${p.highlighted ? " ps-cta--hl" : ""}`}
                  >
                    {p.ctaText}
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )}

                <div className="ps-card-bar" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --ps-green: #50B36D;
    --ps-green-hover: #149C3D;
    --ps-lime: #8BCB2E;
    --ps-dark: #222322;
    --ps-mid: #5F6661;
    --ps-bg: #FFFFFF;
    --ps-soft: #F5FBF6;
    --ps-border: #DCEEDF;
  }

  .ps-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--ps-bg);
    color: var(--ps-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .ps-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: ps-morph 16s ease-in-out infinite alternate;
  }
  .ps-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: ps-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes ps-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .ps-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .ps-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .ps-inner { padding: 0 20px; } }

  /* Header */
  .ps-header { margin-bottom: 52px; text-align: center; }

  .ps-eyebrow-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
  .ps-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--ps-soft); border: 1px solid var(--ps-border);
  }
  .ps-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ps-green), var(--ps-lime));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ps-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--ps-green); }

  .ps-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4.5vw, 3.4rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--ps-dark); margin: 0 0 16px;
  }
  .ps-title-plain { color: var(--ps-dark); }
  .ps-title-accent {
    font-style: italic; color: var(--ps-green);
    position: relative; display: inline;
  }
  .ps-title-accent::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 6px; opacity: 0.75;
  }

  .ps-subtitle {
    font-size: 1.0625rem; line-height: 1.75;
    color: var(--ps-mid); max-width: 560px;
    margin: 0 auto;
  }

  /* Grid */
  .ps-grid { display: grid; gap: 20px; align-items: start; }
  .ps-cols-1 { grid-template-columns: 1fr; max-width: 380px; margin: 0 auto; }
  .ps-cols-2 { grid-template-columns: 1fr; }
  .ps-cols-3 { grid-template-columns: 1fr; }

  @media (min-width: 640px) {
    .ps-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .ps-cols-3 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .ps-cols-3 { grid-template-columns: repeat(3, 1fr); }
  }

  /* Card */
  .ps-card {
    position: relative;
    display: flex; flex-direction: column;
    padding: 28px 24px 32px;
    border-radius: 22px;
    background: var(--ps-bg);
    border: 1.5px solid var(--ps-border);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(34,35,34,0.05), 0 1px 4px rgba(34,35,34,0.04);
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .ps-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 44px rgba(80,179,109,0.11), 0 4px 14px rgba(34,35,34,0.07);
    border-color: rgba(80,179,109,0.35);
  }
  .ps-card--hl {
    background: var(--ps-soft);
    border-color: var(--ps-green);
    box-shadow: 0 8px 40px rgba(80,179,109,0.18), 0 2px 8px rgba(34,35,34,0.06);
  }
  .ps-card--hl:hover {
    box-shadow: 0 18px 56px rgba(80,179,109,0.26), 0 4px 14px rgba(34,35,34,0.07);
  }
  .ps-card:hover .ps-card-bar { opacity: 1; }
  .ps-card--hl .ps-card-bar { opacity: 1; }

  /* Popular badge */
  .ps-popular {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 999px;
    background: linear-gradient(135deg, var(--ps-green), var(--ps-lime));
    font-size: 11px; font-weight: 800; color: #fff;
    letter-spacing: 0.04em;
    margin-bottom: 14px; width: fit-content;
    box-shadow: 0 3px 12px rgba(80,179,109,0.35);
  }

  .ps-plan-name {
    font-family: 'Fraunces', serif;
    font-weight: 700; font-size: 1.2rem;
    color: var(--ps-dark); margin-bottom: 18px;
  }

  /* Price */
  .ps-price-block {
    display: flex; align-items: baseline; gap: 4px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--ps-border);
    margin-bottom: 22px;
  }
  .ps-price {
    font-family: 'Fraunces', serif;
    font-weight: 900; font-size: 2.5rem;
    line-height: 1; letter-spacing: -0.025em;
    color: var(--ps-dark);
    background: linear-gradient(135deg, var(--ps-dark) 0%, var(--ps-green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ps-period {
    font-size: 13px; font-weight: 600;
    color: var(--ps-mid);
  }

  /* Features */
  .ps-features {
    list-style: none; padding: 0; margin: 0 0 auto;
    display: flex; flex-direction: column; gap: 10px;
    flex: 1;
  }
  .ps-feature {
    display: flex; align-items: flex-start; gap: 9px;
    font-size: 13.5px; color: var(--ps-dark); line-height: 1.5;
  }
  .ps-feature-icon {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
    background: linear-gradient(135deg, var(--ps-green), var(--ps-lime));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(80,179,109,0.28);
  }

  /* CTA */
  .ps-cta {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    margin-top: 24px;
    padding: 13px 20px; border-radius: 13px;
    background: var(--ps-soft); border: 1.5px solid var(--ps-border);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 700; color: var(--ps-green);
    text-decoration: none;
    transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .ps-cta:hover {
    background: var(--ps-green); border-color: var(--ps-green); color: #fff;
    transform: translateY(-1px); box-shadow: 0 5px 18px rgba(80,179,109,0.38);
  }
  .ps-cta--hl {
    background: var(--ps-green); border-color: var(--ps-green); color: #fff;
    box-shadow: 0 5px 18px rgba(80,179,109,0.38);
  }
  .ps-cta--hl:hover {
    background: var(--ps-green-hover); border-color: var(--ps-green-hover);
    box-shadow: 0 8px 28px rgba(80,179,109,0.48);
  }

  /* Bottom accent */
  .ps-card-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, var(--ps-green), var(--ps-lime));
    opacity: 0; transition: opacity 0.22s;
  }
`;