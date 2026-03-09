export default function StatsSection({
  data,
}: {
  data: { title?: string; items: Array<{ value: string; label: string }> };
}) {
  const items = Array.isArray(data.items) ? data.items : [];

  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  const colClass =
    items.length === 1 ? "ss-cols-1" :
    items.length === 2 ? "ss-cols-2" :
    items.length === 3 ? "ss-cols-3" :
    "ss-cols-4";

  return (
    <>
      <style>{STYLES}</style>
      <section className="ss-root">
        <div className="ss-blob-tl" />
        <div className="ss-blob-br" />
        <div className="ss-dotgrid" />

        <div className="ss-inner">
          {data.title && (
            <div className="ss-header">
              <div className="ss-eyebrow">
                <div className="ss-eyebrow-dot">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="ss-eyebrow-text">Números que hablan</span>
              </div>

              <h2 className="ss-title">
                {titleEnd ? (
                  <>
                    <span className="ss-title-plain">{titleStart} </span>
                    <span className="ss-title-accent">{titleEnd}</span>
                  </>
                ) : (
                  <span className="ss-title-accent">{titleStart}</span>
                )}
              </h2>
            </div>
          )}

          <div className={`ss-grid ${colClass}`}>
            {items.map((it, i) => (
              <div key={i} className="ss-card">
                <div className="ss-card-inner">
                  <div className="ss-index">0{i + 1}</div>
                  <div className="ss-value">{it.value}</div>
                  <div className="ss-label">{it.label}</div>
                </div>
                <div className="ss-card-bar" />
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
    --ss-green: #50B36D;
    --ss-green-hover: #149C3D;
    --ss-lime: #8BCB2E;
    --ss-dark: #222322;
    --ss-mid: #5F6661;
    --ss-bg: #FFFFFF;
    --ss-soft: #F5FBF6;
    --ss-border: #DCEEDF;
  }

  .ss-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--ss-bg);
    color: var(--ss-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .ss-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: ss-morph 16s ease-in-out infinite alternate;
  }
  .ss-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: ss-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes ss-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .ss-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .ss-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .ss-inner { padding: 0 20px; } }

  /* Header */
  .ss-header { margin-bottom: 48px; }

  .ss-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--ss-soft); border: 1px solid var(--ss-border);
    margin-bottom: 20px;
  }
  .ss-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ss-green), var(--ss-lime));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ss-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--ss-green); }

  .ss-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--ss-dark); margin: 0;
  }
  .ss-title-plain { color: var(--ss-dark); }
  .ss-title-accent {
    font-style: italic; color: var(--ss-green);
    position: relative; display: inline;
  }
  .ss-title-accent::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 6px; opacity: 0.75;
  }

  /* Grid */
  .ss-grid { display: grid; gap: 20px; }
  .ss-cols-1 { grid-template-columns: 1fr; max-width: 320px; }
  .ss-cols-2 { grid-template-columns: 1fr; }
  .ss-cols-3 { grid-template-columns: 1fr; }
  .ss-cols-4 { grid-template-columns: 1fr; }

  @media (min-width: 640px) {
    .ss-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .ss-cols-3 { grid-template-columns: repeat(2, 1fr); }
    .ss-cols-4 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .ss-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .ss-cols-4 { grid-template-columns: repeat(4, 1fr); }
  }

  /* Card */
  .ss-card {
    position: relative;
    border-radius: 22px;
    background: var(--ss-bg);
    border: 1.5px solid var(--ss-border);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(34,35,34,0.05), 0 1px 4px rgba(34,35,34,0.04);
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .ss-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(80,179,109,0.13), 0 4px 16px rgba(34,35,34,0.07);
    border-color: rgba(80,179,109,0.4);
  }
  .ss-card:hover .ss-card-bar { opacity: 1; }
  .ss-card:hover .ss-index { color: var(--ss-green); }

  .ss-card-inner { padding: 32px 28px 34px; }

  .ss-index {
    font-family: 'Fraunces', serif;
    font-size: 12px; font-weight: 900;
    font-style: italic;
    color: var(--ss-border);
    letter-spacing: 0.05em;
    margin-bottom: 16px;
    display: block;
    transition: color 0.22s;
  }

  .ss-value {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--ss-dark);
    margin-bottom: 10px;
    background: linear-gradient(135deg, var(--ss-dark) 0%, var(--ss-green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ss-label {
    font-size: 14px; font-weight: 500;
    color: var(--ss-mid); line-height: 1.5;
  }

  .ss-card-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, var(--ss-green), var(--ss-lime));
    opacity: 0; transition: opacity 0.22s;
  }
`;