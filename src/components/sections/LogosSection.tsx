export default function LogosSection({
  data,
}: {
  data: { title?: string; logos: Array<{ imageUrl: string; alt?: string; href?: string }> };
}) {
  const logos = Array.isArray(data.logos) ? data.logos : [];

  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <section className="ls-root">
        <div className="ls-blob-tl" />
        <div className="ls-blob-br" />
        <div className="ls-dotgrid" />

        <div className="ls-inner">
          {data.title && (
            <div className="ls-header">
              <div className="ls-eyebrow">
                <div className="ls-eyebrow-dot">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                  </svg>
                </div>
                <span className="ls-eyebrow-text">Empresas que confían en nosotros</span>
              </div>

              <h2 className="ls-title">
                {titleEnd ? (
                  <>
                    <span className="ls-title-plain">{titleStart} </span>
                    <span className="ls-title-accent">{titleEnd}</span>
                  </>
                ) : (
                  <span className="ls-title-accent">{titleStart}</span>
                )}
              </h2>
            </div>
          )}

          <div className="ls-track-wrap">
            <div className="ls-fade-l" />
            <div className="ls-fade-r" />

            <div className="ls-logos">
              {logos.map((l, i) => {
                const inner = (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={l.imageUrl}
                    alt={l.alt ?? ""}
                    className="ls-img"
                  />
                );

                return l.href ? (
                  <a
                    key={i}
                    href={l.href}
                    className="ls-logo-wrap ls-logo-wrap--link"
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={l.alt || `Logo ${i + 1}`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="ls-logo-wrap">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --ls-green: #50B36D;
    --ls-lime: #8BCB2E;
    --ls-dark: #222322;
    --ls-mid: #5F6661;
    --ls-bg: #FFFFFF;
    --ls-soft: #F5FBF6;
    --ls-border: #DCEEDF;
  }

  .ls-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--ls-bg);
    color: var(--ls-dark);
    position: relative;
    overflow: hidden;
    padding: 72px 0 88px;
  }

  .ls-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: ls-morph 16s ease-in-out infinite alternate;
  }
  .ls-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: ls-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes ls-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .ls-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .ls-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .ls-inner { padding: 0 20px; } }

  /* Header */
  .ls-header { margin-bottom: 40px; }

  .ls-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--ls-soft); border: 1px solid var(--ls-border);
    margin-bottom: 20px;
  }
  .ls-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ls-green), var(--ls-lime));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ls-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--ls-green); }

  .ls-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--ls-dark); margin: 0;
  }
  .ls-title-plain { color: var(--ls-dark); }
  .ls-title-accent {
    font-style: italic; color: var(--ls-green);
    position: relative; display: inline;
  }
  .ls-title-accent::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 6px; opacity: 0.75;
  }

  /* Track */
  .ls-track-wrap {
    position: relative;
    padding: 20px 0;
    border-top: 1px solid var(--ls-border);
    border-bottom: 1px solid var(--ls-border);
  }

  .ls-fade-l,
  .ls-fade-r {
    position: absolute; top: 0; bottom: 0;
    width: 80px; z-index: 2; pointer-events: none;
  }
  .ls-fade-l {
    left: 0;
    background: linear-gradient(to right, var(--ls-bg), transparent);
  }
  .ls-fade-r {
    right: 0;
    background: linear-gradient(to left, var(--ls-bg), transparent);
  }

  /* Logos flex row */
  .ls-logos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 4px 16px;
  }

  /* Individual logo pill */
  .ls-logo-wrap {
    display: flex; align-items: center; justify-content: center;
    padding: 14px 22px;
    border-radius: 16px;
    background: var(--ls-soft);
    border: 1.5px solid var(--ls-border);
    box-shadow: 0 2px 8px rgba(34,35,34,0.04);
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .ls-logo-wrap--link {
    cursor: pointer;
    text-decoration: none;
  }
  .ls-logo-wrap:hover {
    border-color: rgba(80,179,109,0.45);
    background: var(--ls-bg);
    box-shadow: 0 6px 24px rgba(80,179,109,0.12);
    transform: translateY(-3px);
  }

  .ls-img {
    height: 36px;
    width: auto;
    display: block;
    opacity: 0.6;
    filter: grayscale(1);
    transition: opacity 0.2s, filter 0.2s;
    max-width: 120px;
    object-fit: contain;
  }
  .ls-logo-wrap:hover .ls-img {
    opacity: 1;
    filter: grayscale(0);
  }

  @media (max-width: 480px) {
    .ls-logo-wrap { padding: 12px 18px; }
    .ls-img { height: 28px; }
  }
`;