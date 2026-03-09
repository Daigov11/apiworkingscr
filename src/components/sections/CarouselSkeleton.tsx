export default function CarouselSkeleton() {
  return (
    <>
      <style>{STYLES}</style>
      <section className="csk-root">
        <div className="csk-inner">
          <div className="csk-header">
            <div className="csk-pill" />
            <div className="csk-title-line" />
          </div>

          <div className="csk-card">
            <div className="csk-topbar">
              <div className="csk-dots">
                <span className="csk-dot" />
                <span className="csk-dot" />
                <span className="csk-dot" />
              </div>
              <div className="csk-lbl-line" />
              <div className="csk-lbl-line csk-lbl-line--sm" />
            </div>

            <div className="csk-frame" />

            <div className="csk-footer">
              <div className="csk-caption-line" />
              <div className="csk-nav-dots">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`csk-nav-dot${i === 0 ? " csk-nav-dot--active" : ""}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  :root {
    --csk-bg: #FFFFFF;
    --csk-soft: #F5FBF6;
    --csk-border: #DCEEDF;
    --csk-shine: #eef7f0;
  }

  @keyframes csk-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  .csk-shimmer {
    background: linear-gradient(90deg, var(--csk-border) 25%, var(--csk-shine) 50%, var(--csk-border) 75%);
    background-size: 600px 100%;
    animation: csk-shimmer 1.6s ease-in-out infinite;
    border-radius: 6px;
  }

  .csk-root {
    background: var(--csk-bg);
    padding: 88px 0 104px;
  }

  .csk-inner {
    max-width: 900px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .csk-inner { padding: 0 20px; } }

  .csk-header { margin-bottom: 40px; }
  .csk-pill {
    width: 160px; height: 30px; border-radius: 999px; margin-bottom: 16px;
    background: linear-gradient(90deg, var(--csk-border) 25%, var(--csk-shine) 50%, var(--csk-border) 75%);
    background-size: 600px 100%;
    animation: csk-shimmer 1.6s ease-in-out infinite;
  }
  .csk-title-line {
    width: 280px; height: 36px; border-radius: 8px;
    background: linear-gradient(90deg, var(--csk-border) 25%, var(--csk-shine) 50%, var(--csk-border) 75%);
    background-size: 600px 100%;
    animation: csk-shimmer 1.6s ease-in-out infinite;
  }

  .csk-card {
    border-radius: 22px; overflow: hidden;
    background: var(--csk-bg);
    border: 1.5px solid var(--csk-border);
    box-shadow: 0 4px 20px rgba(34,35,34,0.05);
  }

  .csk-topbar {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 11px 18px;
    background: var(--csk-soft);
    border-bottom: 1px solid var(--csk-border);
  }
  .csk-dots { display: flex; gap: 6px; }
  .csk-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--csk-border); display: block; }
  .csk-lbl-line {
    width: 60px; height: 10px; border-radius: 4px;
    background: linear-gradient(90deg, var(--csk-border) 25%, var(--csk-shine) 50%, var(--csk-border) 75%);
    background-size: 600px 100%;
    animation: csk-shimmer 1.6s ease-in-out infinite;
  }
  .csk-lbl-line--sm { width: 36px; }

  .csk-frame {
    width: 100%; aspect-ratio: 16/9;
    background: linear-gradient(90deg, var(--csk-border) 25%, var(--csk-shine) 50%, var(--csk-border) 75%);
    background-size: 600px 100%;
    animation: csk-shimmer 1.6s ease-in-out infinite;
  }

  .csk-footer {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 13px 18px;
    background: var(--csk-soft);
    border-top: 1px solid var(--csk-border);
  }
  .csk-caption-line {
    width: 140px; height: 10px; border-radius: 4px;
    background: linear-gradient(90deg, var(--csk-border) 25%, var(--csk-shine) 50%, var(--csk-border) 75%);
    background-size: 600px 100%;
    animation: csk-shimmer 1.6s ease-in-out infinite;
  }
  .csk-nav-dots { display: flex; gap: 5px; }
  .csk-nav-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--csk-border); }
  .csk-nav-dot--active { width: 18px; background: var(--csk-border); }
`;