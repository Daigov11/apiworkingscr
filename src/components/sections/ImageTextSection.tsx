export default function ImageTextSection({
  data,
}: {
  data: {
    title?: string;
    text: string;
    imageUrl: string;
    imageAlt?: string;
    reverse?: boolean;
  };
}) {
  const reverse = Boolean(data.reverse);

  const titleWords = (data.title || "").trim().split(/\s+/).filter(Boolean);
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{STYLES}</style>

      <section className="its-root">
        <div className="its-bg-orb its-bg-orb--left" aria-hidden="true" />
        <div className="its-bg-orb its-bg-orb--right" aria-hidden="true" />
        <div className="its-grid-pattern" aria-hidden="true" />

        <div className="its-container">
          <div className={`its-grid${reverse ? " its-grid--reverse" : ""}`}>
            <div className="its-media-col">
              <div className="its-media-shell">
                <div className="its-media-border" aria-hidden="true" />

                <div className="its-media-card">
                  <div className="its-media-topbar">
                    <div className="its-topbar-dots" aria-hidden="true">
                      <span className="its-dot its-dot--red" />
                      <span className="its-dot its-dot--yellow" />
                      <span className="its-dot its-dot--green" />
                    </div>

                    <span className="its-topbar-label">Experiencia visual</span>

                    <span className="its-status">
                      <span className="its-status-ping" aria-hidden="true" />
                      Activo
                    </span>
                  </div>

                  <div className="its-image-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.imageUrl}
                      alt={data.imageAlt ?? ""}
                      className="its-image"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="its-image-overlay" aria-hidden="true" />
                    <div className="its-image-shine" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="its-content-col">
              <div className="its-badge">
                <span className="its-badge-icon" aria-hidden="true">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="its-badge-text">Descubre más</span>
              </div>

              {data.title && (
                <h2 className="its-title">
                  {titleEnd ? (
                    <>
                      <span className="its-title-main">{titleStart} </span>
                      <span className="its-title-accent">{titleEnd}</span>
                    </>
                  ) : (
                    <span className="its-title-accent">{titleStart}</span>
                  )}
                </h2>
              )}

              <div className="its-divider" aria-hidden="true" />

              <p className="its-text">{data.text}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  :root {
    --its-green: #50B36D;
    --its-green-strong: #149C3D;
    --its-lime: #8BCB2E;
    --its-dark: #222322;
    --its-text: #5F6661;
    --its-bg: #FFFFFF;
    --its-soft: #F5FBF6;
    --its-soft-2: #EDF8EF;
    --its-border: #DCEEDF;
    --its-shadow: 0 20px 60px rgba(34, 35, 34, 0.08);
    --its-radius-xl: 28px;
    --its-radius-lg: 22px;
  }

  .its-root {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at top left, rgba(80,179,109,0.07), transparent 28%),
      radial-gradient(circle at bottom right, rgba(139,203,46,0.06), transparent 24%),
      var(--its-bg);
    padding: 88px 0;
    color: var(--its-dark);
    font-family: var(
      --font-sans,
      Inter,
      "Plus Jakarta Sans",
      "Segoe UI",
      Roboto,
      Arial,
      sans-serif
    );
  }

  .its-container {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .its-bg-orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(10px);
    pointer-events: none;
  }

  .its-bg-orb--left {
    top: -140px;
    left: -120px;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(80,179,109,0.14) 0%, rgba(80,179,109,0.04) 55%, transparent 75%);
  }

  .its-bg-orb--right {
    right: -120px;
    bottom: -140px;
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(139,203,46,0.12) 0%, rgba(139,203,46,0.04) 55%, transparent 75%);
  }

  .its-grid-pattern {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.18;
    background-image: radial-gradient(rgba(80,179,109,0.55) 1px, transparent 1px);
    background-size: 26px 26px;
    mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
  }

  .its-grid {
    display: grid;
    gap: 56px;
    align-items: center;
  }

  .its-media-col,
  .its-content-col {
    min-width: 0;
  }

  .its-media-shell {
    position: relative;
  }

  .its-media-border {
    position: absolute;
    inset: 18px -14px -18px 14px;
    border-radius: calc(var(--its-radius-xl) + 2px);
    background: linear-gradient(180deg, rgba(220,238,223,0.95), rgba(237,248,239,0.9));
  }

  .its-media-card {
    position: relative;
    z-index: 1;
    overflow: hidden;
    border-radius: var(--its-radius-xl);
    border: 1px solid var(--its-border);
    background: rgba(255,255,255,0.9);
    box-shadow: var(--its-shadow);
    backdrop-filter: blur(6px);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .its-media-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 28px 70px rgba(34, 35, 34, 0.12);
  }

  .its-media-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    background: linear-gradient(180deg, var(--its-soft) 0%, #ffffff 100%);
    border-bottom: 1px solid var(--its-border);
  }

  .its-topbar-dots {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .its-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    display: block;
  }

  .its-dot--red { background: #f87171; }
  .its-dot--yellow { background: #fbbf24; }
  .its-dot--green { background: var(--its-green); }

  .its-topbar-label {
    flex: 1;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--its-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .its-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    color: var(--its-green-strong);
    background: rgba(80,179,109,0.08);
    border: 1px solid rgba(80,179,109,0.15);
    padding: 6px 10px;
    border-radius: 999px;
  }

  .its-status-ping {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--its-green);
    box-shadow: 0 0 0 0 rgba(80,179,109,0.55);
    animation: its-ping 2s infinite;
  }

  @keyframes its-ping {
    0% {
      box-shadow: 0 0 0 0 rgba(80,179,109,0.55);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(80,179,109,0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(80,179,109,0);
    }
  }

  .its-image-wrap {
    position: relative;
    overflow: hidden;
    background: var(--its-soft);
  }

  .its-image {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .its-media-card:hover .its-image {
    transform: scale(1.035);
  }

  .its-image-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to top, rgba(34,35,34,0.20), transparent 35%),
      linear-gradient(to right, rgba(255,255,255,0.08), transparent 22%);
    pointer-events: none;
  }

  .its-image-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      115deg,
      transparent 0%,
      transparent 35%,
      rgba(255,255,255,0.18) 50%,
      transparent 65%,
      transparent 100%
    );
    transform: translateX(-120%);
    transition: transform 0.9s ease;
    pointer-events: none;
  }

  .its-media-card:hover .its-image-shine {
    transform: translateX(120%);
  }

  .its-content-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .its-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    margin-bottom: 20px;
    padding: 8px 14px 8px 10px;
    border-radius: 999px;
    background: linear-gradient(180deg, #ffffff 0%, var(--its-soft) 100%);
    border: 1px solid var(--its-border);
    box-shadow: 0 8px 20px rgba(80,179,109,0.08);
  }

  .its-badge-icon {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: linear-gradient(135deg, var(--its-green), var(--its-lime));
    flex-shrink: 0;
  }

  .its-badge-text {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--its-green-strong);
  }

  .its-title {
    margin: 0 0 18px;
    font-family: var(
      --font-serif,
      "Fraunces",
      Georgia,
      "Times New Roman",
      serif
    );
    font-size: clamp(2rem, 4vw, 3.25rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    font-weight: 800;
    text-wrap: balance;
  }

  .its-title-main {
    color: var(--its-dark);
  }

  .its-title-accent {
    color: var(--its-green);
    font-style: italic;
    position: relative;
  }

  .its-title-accent::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 8px;
    opacity: 0.65;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: 60px 8px;
  }

  .its-divider {
    width: 72px;
    height: 4px;
    border-radius: 999px;
    margin-bottom: 22px;
    background: linear-gradient(90deg, var(--its-green) 0%, var(--its-lime) 100%);
    box-shadow: 0 6px 18px rgba(80,179,109,0.18);
  }

  .its-text {
    margin: 0;
    max-width: 58ch;
    font-size: 1.04rem;
    line-height: 1.9;
    color: var(--its-text);
    text-wrap: pretty;
  }

  @media (min-width: 900px) {
    .its-grid {
      grid-template-columns: minmax(0, 1.03fr) minmax(0, 0.97fr);
    }

    .its-grid--reverse .its-media-col {
      order: 2;
    }

    .its-grid--reverse .its-content-col {
      order: 1;
    }
  }

  @media (max-width: 899px) {
    .its-root {
      padding: 72px 0;
    }

    .its-grid {
      gap: 34px;
    }

    .its-title {
      font-size: clamp(1.8rem, 8vw, 2.6rem);
    }

    .its-text {
      max-width: none;
    }
  }

  @media (max-width: 640px) {
    .its-container {
      padding: 0 20px;
    }

    .its-root {
      padding: 56px 0;
    }

    .its-media-border {
      inset: 12px -8px -12px 8px;
      border-radius: 24px;
    }

    .its-media-card {
      border-radius: 22px;
    }

    .its-media-topbar {
      padding: 12px 14px;
    }

    .its-topbar-label {
      font-size: 10px;
    }

    .its-status {
      padding: 5px 8px;
      font-size: 10px;
    }

    .its-badge {
      margin-bottom: 16px;
    }

    .its-divider {
      width: 58px;
      margin-bottom: 18px;
    }

    .its-text {
      font-size: 1rem;
      line-height: 1.8;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .its-media-card,
    .its-image,
    .its-image-shine,
    .its-status-ping {
      animation: none !important;
      transition: none !important;
    }
  }
`;