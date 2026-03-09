export default function DividerSection({ data }: { data: { label?: string } }) {
  return (
    <>
      <style>{STYLES}</style>
      <section className="dv-root">
        <div className="dv-inner">
          <div className="dv-line" />
          {data.label && (
            <div className="dv-label">
              <span className="dv-label-dot" />
              {data.label}
              <span className="dv-label-dot" />
            </div>
          )}
          <div className="dv-line" />
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600&display=swap');

  :root {
    --dv-green: #50B36D;
    --dv-lime: #8BCB2E;
    --dv-mid: #5F6661;
    --dv-bg: #FFFFFF;
    --dv-border: #DCEEDF;
  }

  .dv-root {
    background: var(--dv-bg);
    padding: 28px 0;
  }

  .dv-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
    display: flex; align-items: center; gap: 16px;
  }
  @media (max-width: 640px) { .dv-inner { padding: 0 20px; } }

  .dv-line {
    flex: 1; height: 1.5px;
    background: linear-gradient(to right, transparent, var(--dv-border) 20%, var(--dv-border) 80%, transparent);
  }

  .dv-label {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    background: #F5FBF6;
    border: 1.5px solid var(--dv-border);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11.5px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--dv-mid);
    white-space: nowrap;
  }

  .dv-label-dot {
    width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--dv-green), var(--dv-lime));
  }
`;