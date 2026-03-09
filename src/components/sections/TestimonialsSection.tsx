export default function TestimonialsSection({
  data,
}: {
  data: { title?: string; items: Array<{ name: string; role?: string; text: string; avatarUrl?: string }> };
}) {
  const items = Array.isArray(data.items) ? data.items : [];

  const titleWords = (data.title || "").split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  const colClass =
    items.length === 1 ? "ts-cols-1" :
    items.length === 2 ? "ts-cols-2" :
    "ts-cols-3";

  return (
    <>
      <style>{STYLES}</style>
      <section className="ts-root">
        <div className="ts-blob-tl" />
        <div className="ts-blob-br" />
        <div className="ts-dotgrid" />

        <div className="ts-inner">
          {data.title && (
            <div className="ts-header">
              <div className="ts-eyebrow">
                <div className="ts-eyebrow-dot">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                  </svg>
                </div>
                <span className="ts-eyebrow-text">Testimonios</span>
              </div>

              <h2 className="ts-title">
                {titleEnd ? (
                  <>
                    <span className="ts-title-plain">{titleStart} </span>
                    <span className="ts-title-accent">{titleEnd}</span>
                  </>
                ) : (
                  <span className="ts-title-accent">{titleStart}</span>
                )}
              </h2>
            </div>
          )}

          <div className={`ts-grid ${colClass}`}>
            {items.map((t, i) => (
              <div key={i} className="ts-card">
                <div className="ts-quote-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                    <path d="M9.333 20c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4c-.341 0-.672.043-.99.12C12.786 13.478 14.7 11.2 17.333 10V6.667C11.443 8.044 7.333 13.4 7.333 20v6h6V20h-4zm16 0c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4c-.341 0-.672.043-.99.12C28.787 13.478 30.7 11.2 33.333 10V6.667C27.443 8.044 23.333 13.4 23.333 20v6h6V20h-4z" fill="currentColor"/>
                  </svg>
                </div>

                <div className="ts-stars" aria-label="5 estrellas">★★★★★</div>

                <p className="ts-text">{t.text}</p>

                <div className="ts-author">
                  {t.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={t.avatarUrl} alt={t.name} className="ts-avatar ts-avatar--img" />
                  ) : (
                    <div className="ts-avatar ts-avatar--initials" aria-hidden="true">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ts-author-info">
                    <div className="ts-author-name">{t.name}</div>
                    {t.role && <div className="ts-author-role">{t.role}</div>}
                  </div>
                </div>

                <div className="ts-card-bar" />
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
    --ts-green: #50B36D;
    --ts-lime: #8BCB2E;
    --ts-dark: #222322;
    --ts-mid: #5F6661;
    --ts-bg: #FFFFFF;
    --ts-soft: #F5FBF6;
    --ts-border: #DCEEDF;
  }

  .ts-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--ts-bg);
    color: var(--ts-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .ts-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: ts-morph 16s ease-in-out infinite alternate;
  }
  .ts-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: ts-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes ts-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .ts-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .ts-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .ts-inner { padding: 0 20px; } }

  .ts-header { margin-bottom: 48px; }

  .ts-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--ts-soft); border: 1px solid var(--ts-border);
    margin-bottom: 20px;
  }
  .ts-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ts-green), var(--ts-lime));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ts-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--ts-green); }

  .ts-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--ts-dark); margin: 0;
  }
  .ts-title-plain { color: var(--ts-dark); }
  .ts-title-accent {
    font-style: italic; color: var(--ts-green);
    position: relative; display: inline;
  }
  .ts-title-accent::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 6px; opacity: 0.75;
  }

  /* Grid */
  .ts-grid { display: grid; gap: 20px; align-items: start; }
  .ts-cols-1 { grid-template-columns: 1fr; max-width: 480px; }
  .ts-cols-2 { grid-template-columns: 1fr; }
  .ts-cols-3 { grid-template-columns: 1fr; }

  @media (min-width: 640px) {
    .ts-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .ts-cols-3 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .ts-cols-3 { grid-template-columns: repeat(3, 1fr); }
  }

  /* Card */
  .ts-card {
    position: relative;
    display: flex; flex-direction: column;
    padding: 28px 26px 32px;
    border-radius: 22px;
    background: var(--ts-bg);
    border: 1.5px solid var(--ts-border);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(34,35,34,0.05), 0 1px 4px rgba(34,35,34,0.04);
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .ts-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(80,179,109,0.13), 0 4px 16px rgba(34,35,34,0.07);
    border-color: rgba(80,179,109,0.4);
  }
  .ts-card:hover .ts-card-bar { opacity: 1; }
  .ts-card:hover .ts-quote-icon { color: var(--ts-green); }

  .ts-quote-icon {
    color: var(--ts-border);
    margin-bottom: 14px;
    transition: color 0.22s;
    flex-shrink: 0;
  }

  .ts-stars {
    font-size: 13px;
    color: var(--ts-lime);
    letter-spacing: 0.05em;
    margin-bottom: 14px;
  }

  .ts-text {
    font-size: 14.5px;
    line-height: 1.75;
    color: var(--ts-dark);
    font-style: italic;
    flex: 1;
    margin: 0 0 24px;
  }

  .ts-author {
    display: flex; align-items: center; gap: 12px;
    padding-top: 18px;
    border-top: 1px solid var(--ts-border);
  }

  .ts-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .ts-avatar--img {
    object-fit: cover;
    border: 2px solid var(--ts-border);
  }
  .ts-avatar--initials {
    background: linear-gradient(135deg, var(--ts-green), var(--ts-lime));
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 800; color: #fff;
    box-shadow: 0 3px 10px rgba(80,179,109,0.3);
  }

  .ts-author-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 700;
    color: var(--ts-dark);
  }
  .ts-author-role {
    font-size: 12px; color: var(--ts-mid);
    margin-top: 2px;
  }

  .ts-card-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, var(--ts-green), var(--ts-lime));
    opacity: 0; transition: opacity 0.22s;
  }
`;