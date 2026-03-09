export default function HeroSection({
  data,
}: {
  data: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string };
}) {
  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <section className="hs-root">
        <div className="hs-blob-tl" />
        <div className="hs-blob-br" />
        <div className="hs-dotgrid" />

        <div className="hs-inner">
          <div className="hs-eyebrow">
            <div className="hs-eyebrow-dot">
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="hs-eyebrow-text">Bienvenido</span>
          </div>

          <h1 className="hs-title">
            {titleEnd ? (
              <>
                <span className="hs-title-plain">{titleStart} </span>
                <span className="hs-title-accent">{titleEnd}</span>
              </>
            ) : (
              <span className="hs-title-accent">{titleStart}</span>
            )}
          </h1>

          {data.subtitle && <p className="hs-subtitle">{data.subtitle}</p>}

          {data.ctaText && data.ctaHref && (
            <a href={data.ctaHref} className="hs-btn">
              {data.ctaText}
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          )}
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --hs-green: #50B36D;
    --hs-green-hover: #149C3D;
    --hs-lime: #8BCB2E;
    --hs-dark: #222322;
    --hs-mid: #5F6661;
    --hs-bg: #FFFFFF;
    --hs-soft: #F5FBF6;
    --hs-border: #DCEEDF;
  }

  .hs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--hs-bg);
    color: var(--hs-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .hs-blob-tl {
    position: absolute;
    top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: hs-morph 16s ease-in-out infinite alternate;
  }
  .hs-blob-br {
    position: absolute;
    bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: hs-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes hs-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }

  .hs-dotgrid {
    position: absolute; inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .hs-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
    display: flex; flex-direction: column;
    align-items: flex-start;
  }
  @media (max-width: 640px) { .hs-inner { padding: 0 20px; } }

  .hs-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--hs-soft);
    border: 1px solid var(--hs-border);
    margin-bottom: 28px;
  }
  .hs-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--hs-green), var(--hs-lime));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .hs-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--hs-green); }

  .hs-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2.6rem, 6vw, 4.5rem);
    line-height: 1.05; letter-spacing: -0.025em;
    color: var(--hs-dark);
    margin: 0 0 22px;
    max-width: 820px;
  }
  .hs-title-plain { color: var(--hs-dark); }
  .hs-title-accent {
    font-style: italic; color: var(--hs-green);
    position: relative; display: inline;
  }
  .hs-title-accent::after {
    content: '';
    position: absolute;
    bottom: -5px; left: 0; right: 0;
    height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: 60px 6px;
    opacity: 0.75;
  }

  .hs-subtitle {
    font-size: 1.125rem; font-weight: 400;
    line-height: 1.75; color: var(--hs-mid);
    margin: 0 0 36px; max-width: 560px;
  }

  .hs-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px;
    border-radius: 14px;
    background: var(--hs-green);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700; color: #fff;
    text-decoration: none;
    box-shadow: 0 6px 24px rgba(80,179,109,0.38), 0 1px 4px rgba(80,179,109,0.2);
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .hs-btn:hover {
    background: var(--hs-green-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(80,179,109,0.48);
  }
`;