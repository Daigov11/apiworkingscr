export default function TextSection({ data }: { data: { title?: string; text: string } }) {
  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <section className="tx-root">
        <div className="tx-blob-tl" />
        <div className="tx-blob-br" />
        <div className="tx-dotgrid" />

        <div className="tx-inner">
          <div className="tx-card">
            <div className="tx-accent-bar" />

            <div className="tx-body">
              {data.title && (
                <>
                  <div className="tx-eyebrow">
                    <span className="tx-eyebrow-dot" />
                    <span className="tx-eyebrow-text">Información</span>
                  </div>

                  <h2 className="tx-title">
                    {titleEnd ? (
                      <>
                        <span className="tx-title-plain">{titleStart} </span>
                        <span className="tx-title-accent">{titleEnd}</span>
                      </>
                    ) : (
                      <span className="tx-title-accent">{titleStart}</span>
                    )}
                  </h2>
                </>
              )}

              <p className="tx-text">{data.text}</p>
            </div>

            <div className="tx-card-bar" />
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --tx-green: #50B36D;
    --tx-lime: #8BCB2E;
    --tx-dark: #222322;
    --tx-mid: #5F6661;
    --tx-bg: #FFFFFF;
    --tx-soft: #F5FBF6;
    --tx-border: #DCEEDF;
  }

  .tx-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--tx-bg);
    color: var(--tx-dark);
    position: relative;
    overflow: hidden;
    padding: 72px 0 88px;
  }

  .tx-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: tx-morph 16s ease-in-out infinite alternate;
  }
  .tx-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: tx-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes tx-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .tx-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .tx-inner {
    position: relative; z-index: 2;
    max-width: 860px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .tx-inner { padding: 0 20px; } }

  .tx-card {
    position: relative;
    border-radius: 22px;
    background: var(--tx-soft);
    border: 1.5px solid var(--tx-border);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(34,35,34,0.05), 0 1px 4px rgba(34,35,34,0.04);
    display: flex;
  }

  .tx-accent-bar {
    width: 4px; flex-shrink: 0;
    background: linear-gradient(to bottom, var(--tx-green), var(--tx-lime));
    border-radius: 2px 0 0 2px;
  }

  .tx-body {
    padding: 32px 36px;
    flex: 1;
  }
  @media (max-width: 640px) { .tx-body { padding: 24px 22px; } }

  .tx-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    margin-bottom: 16px;
  }
  .tx-eyebrow-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--tx-green), var(--tx-lime));
  }
  .tx-eyebrow-text {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--tx-green);
  }

  .tx-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(1.6rem, 3.5vw, 2.6rem);
    line-height: 1.08; letter-spacing: -0.02em;
    color: var(--tx-dark);
    margin: 0 0 18px;
  }
  .tx-title-plain { color: var(--tx-dark); }
  .tx-title-accent {
    font-style: italic; color: var(--tx-green);
    position: relative; display: inline;
  }
  .tx-title-accent::after {
    content: '';
    position: absolute; bottom: -3px; left: 0; right: 0; height: 5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 5px; opacity: 0.75;
  }

  .tx-text {
    font-size: 15.5px; line-height: 1.8;
    color: var(--tx-mid);
    margin: 0;
  }

  .tx-card-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, var(--tx-green), var(--tx-lime));
    opacity: 0.5;
  }
`;