import Link from "next/link";

type HeroMediaData = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;

  badges?: string[];

  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };

  mediaType?: "image" | "video";
  mediaUrl?: string;
  mediaAlt?: string;

  includesTitle?: string;
  includesText?: string;
  includesImages?: Array<{ imageUrl: string; alt?: string }>;
};

function isHttpUrl(u?: string) {
  if (!u) return false;
  return /^https?:\/\//i.test(u);
}

export default function HeroMediaSection({ data }: { data: any }) {
  const d = (data || {}) as HeroMediaData;

  const eyebrow = d.eyebrow || "Soluciones para negocios en Perú";
  const title = d.title || "El mejor sistema para tu negocio";
  const subtitle = d.subtitle || "Gestión, ventas y operaciones en un solo lugar.";

  const badges = Array.isArray(d.badges) ? d.badges.slice(0, 6) : [];

  const primary = d.primaryCta?.text
    ? d.primaryCta
    : { text: "Solicitar demo", href: "/contacto" };

  const secondary = d.secondaryCta?.text
    ? d.secondaryCta
    : { text: "Ver productos", href: "/productos" };

  const mediaType = d.mediaType === "video" ? "video" : "image";
  const mediaUrl = d.mediaUrl || "";
  const mediaAlt = d.mediaAlt || title;

  const includesTitle = d.includesTitle || "Tu sistema incluye";
  const includesText =
    d.includesText || "Pagos QR, facturación y módulos listos para operar.";

  const includesImages = Array.isArray(d.includesImages)
    ? d.includesImages.slice(0, 5)
    : [];

  const titleWords = title.split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

        :root {
          --c-green: #50B36D;
          --c-green-hover: #149C3D;
          --c-lime: #8BCB2E;
          --c-dark: #222322;
          --c-mid: #5F6661;
          --c-bg: #FFFFFF;
          --c-soft: #F5FBF6;
          --c-border: #DCEEDF;
        }

        .h-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--c-bg);
          color: var(--c-dark);
          position: relative;
          overflow: hidden;
        }

        /* Organic blobs */
        .h-blob-tl {
          position: absolute;
          top: -140px;
          left: -100px;
          width: 600px;
          height: 600px;
          border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
          background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.12) 0%, rgba(139,203,46,0.07) 50%, transparent 75%);
          pointer-events: none;
          animation: morph 16s ease-in-out infinite alternate;
        }
        .h-blob-br {
          position: absolute;
          bottom: -100px;
          right: -80px;
          width: 480px;
          height: 480px;
          border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
          background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.10) 0%, rgba(80,179,109,0.06) 55%, transparent 80%);
          pointer-events: none;
          animation: morph 20s ease-in-out infinite alternate-reverse;
        }
        @keyframes morph {
          0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
          50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
          100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
        }

        /* Dot grid */
        .h-dotgrid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
          background-size: 30px 30px;
          -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
          opacity: 0.45;
        }

        /* Layout */
        .h-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 88px 40px 104px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .h-inner { grid-template-columns: 1fr; padding: 64px 24px 80px; gap: 52px; }
        }
        @media (max-width: 640px) {
          .h-inner { padding: 48px 20px 64px; }
        }

        /* LEFT */
        .h-left { display: flex; flex-direction: column; }

        .h-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 8px;
          border-radius: 999px;
          background: var(--c-soft);
          border: 1px solid var(--c-border);
          width: fit-content;
          margin-bottom: 28px;
        }
        .h-eyebrow-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--c-green), var(--c-lime));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .h-eyebrow-text {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--c-green);
        }

        .h-title {
          font-family: 'Fraunces', serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: var(--c-dark);
          margin: 0 0 24px;
        }
        .h-title-plain { color: var(--c-dark); }
        .h-title-accent {
          font-style: italic;
          color: var(--c-green);
          position: relative;
          display: inline-block;
          white-space: nowrap;
        }
        .h-title-accent::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          right: 0;
          height: 6px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: repeat-x;
          background-size: 60px 6px;
          opacity: 0.8;
        }

        .h-subtitle {
          font-size: 1.0625rem;
          font-weight: 400;
          line-height: 1.75;
          color: var(--c-mid);
          margin: 0 0 28px;
          max-width: 460px;
        }

        /* Social proof */
        .h-proof {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          padding: 12px 16px;
          border-radius: 14px;
          background: var(--c-soft);
          border: 1px solid var(--c-border);
          width: fit-content;
        }
        .h-avatars { display: flex; }
        .h-av {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--c-bg);
          background: var(--c-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: var(--c-green);
          margin-left: -7px;
          overflow: hidden;
        }
        .h-av:first-child { margin-left: 0; }
        .h-proof-copy { font-size: 12.5px; font-weight: 500; color: var(--c-mid); }
        .h-proof-copy strong { color: var(--c-dark); font-weight: 800; }
        .h-stars { color: var(--c-lime); font-size: 12px; margin-bottom: 2px; }

        /* Badges */
        .h-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
        .h-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: var(--c-soft);
          border: 1px solid var(--c-border);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--c-mid);
          transition: border-color 0.18s, background 0.18s, color 0.18s;
          cursor: default;
        }
        .h-badge:hover { border-color: var(--c-green); background: rgba(80,179,109,0.06); color: var(--c-green); }
        .h-badge::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--c-lime);
          flex-shrink: 0;
        }

        /* CTAs */
        .h-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 40px; align-items: center; }

        .h-btn-p {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          border-radius: 14px;
          background: var(--c-green);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          box-shadow: 0 6px 24px rgba(80,179,109,0.38), 0 1px 4px rgba(80,179,109,0.2);
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
        }
        .h-btn-p:hover { background: var(--c-green-hover); transform: translateY(-2px); box-shadow: 0 10px 32px rgba(80,179,109,0.48); }

        .h-btn-s {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          border-radius: 14px;
          background: var(--c-soft);
          border: 1.5px solid var(--c-border);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--c-dark);
          text-decoration: none;
          transition: border-color 0.18s, background 0.18s, transform 0.18s;
        }
        .h-btn-s:hover { border-color: var(--c-green); background: rgba(80,179,109,0.05); transform: translateY(-2px); }

        /* Includes */
        .h-inc-block {
          padding: 22px 22px 22px 26px;
          border-radius: 18px;
          background: var(--c-soft);
          border: 1px solid var(--c-border);
          position: relative;
          overflow: hidden;
        }
        .h-inc-block::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--c-green), var(--c-lime));
          border-radius: 2px 0 0 2px;
        }
        .h-inc-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .h-inc-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--c-green), var(--c-lime));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(80,179,109,0.3);
        }
        .h-inc-ttl { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--c-dark); }
        .h-inc-desc { font-size: 13px; color: var(--c-mid); line-height: 1.65; margin-bottom: 14px; padding-left: 40px; }
        .h-inc-imgs { display: flex; flex-wrap: wrap; gap: 10px; padding-left: 40px; }
        .h-inc-img {
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid var(--c-border);
          box-shadow: 0 2px 8px rgba(34,35,34,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .h-inc-img:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(80,179,109,0.18); }
        .h-inc-img img { display: block; width: 76px; height: 58px; object-fit: cover; }
        @media (min-width: 640px) { .h-inc-img img { width: 92px; height: 68px; } }

        /* RIGHT */
        .h-right { position: relative; }

        .h-deco-ring {
          position: absolute;
          top: -28px; right: -28px;
          width: 200px; height: 200px;
          border-radius: 50%;
          border: 1.5px dashed rgba(139,203,46,0.35);
          pointer-events: none;
        }
        .h-deco-blob {
          position: absolute;
          bottom: 24px; left: -24px;
          width: 110px; height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(80,179,109,0.14), rgba(139,203,46,0.10));
          pointer-events: none;
          filter: blur(4px);
        }

        /* Shadow tray */
        .h-tray {
          position: absolute;
          bottom: -14px; left: 14px; right: -14px;
          height: 100%;
          border-radius: 26px;
          background: var(--c-border);
          z-index: 0;
        }

        /* Card */
        .h-card {
          position: relative;
          z-index: 1;
          border-radius: 24px;
          overflow: hidden;
          background: var(--c-bg);
          border: 1.5px solid var(--c-border);
          box-shadow: 0 20px 60px rgba(34,35,34,0.09), 0 4px 16px rgba(34,35,34,0.05);
        }

        /* Topbar */
        .h-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 18px;
          background: var(--c-soft);
          border-bottom: 1px solid var(--c-border);
        }
        .h-dots { display: flex; gap: 6px; }
        .h-dot { width: 9px; height: 9px; border-radius: 50%; }
        .h-dot-r { background: #f87171; }
        .h-dot-y { background: #fbbf24; }
        .h-dot-g { background: var(--c-green); }
        .h-bar-lbl { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--c-mid); }
        .h-live {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; color: var(--c-green);
        }
        .h-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--c-green);
          animation: ping 2s ease-in-out infinite;
        }
        @keyframes ping {
          0%, 100% { box-shadow: 0 0 0 0 rgba(80,179,109,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(80,179,109,0); }
        }

        /* Media */
        .h-frame { aspect-ratio: 4/3; overflow: hidden; background: var(--c-soft); }
        @media (min-width: 1024px) { .h-frame { aspect-ratio: 5/4; } }
        .h-frame img, .h-frame iframe { width: 100%; height: 100%; object-fit: cover; display: block; }
        .h-frame-empty { display: grid; place-items: center; height: 100%; font-size: 13px; color: var(--c-mid); }

        /* Footer */
        .h-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: var(--c-soft);
          border-top: 1px solid var(--c-border);
        }
        .h-footer-l { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: var(--c-mid); }
        .h-footer-icon {
          width: 22px; height: 22px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--c-green), var(--c-lime));
          display: flex; align-items: center; justify-content: center;
        }
        .h-footer-chip {
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(80,179,109,0.1);
          border: 1px solid rgba(80,179,109,0.2);
          font-size: 11px;
          font-weight: 700;
          color: var(--c-green);
          letter-spacing: 0.05em;
        }

        /* Floating stat */
        .h-stat {
          position: absolute;
          bottom: 44px; left: -44px;
          z-index: 20;
          padding: 13px 16px;
          border-radius: 16px;
          background: var(--c-bg);
          border: 1.5px solid var(--c-border);
          box-shadow: 0 10px 36px rgba(34,35,34,0.11);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 158px;
        }
        @media (max-width: 1024px) { .h-stat { display: none; } }
        .h-stat-ico {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(80,179,109,0.10);
          border: 1px solid var(--c-border);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .h-stat-val { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 900; color: var(--c-dark); line-height: 1; }
        .h-stat-lbl { font-size: 11px; color: var(--c-mid); margin-top: 2px; }

        /* Floating trust */
        .h-trust {
          position: absolute;
          top: 18px; right: -36px;
          z-index: 20;
          padding: 10px 15px;
          border-radius: 14px;
          background: var(--c-bg);
          border: 1.5px solid var(--c-border);
          box-shadow: 0 8px 28px rgba(34,35,34,0.09);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        @media (max-width: 1024px) { .h-trust { display: none; } }
        .h-trust-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--c-lime);
          box-shadow: 0 0 8px rgba(139,203,46,0.55);
          flex-shrink: 0;
        }
        .h-trust-txt { font-size: 12px; font-weight: 500; color: var(--c-mid); }
        .h-trust-txt strong { color: var(--c-dark); font-weight: 800; }
      `}</style>

      <section className="h-root">
        <div className="h-blob-tl" />
        <div className="h-blob-br" />
        <div className="h-dotgrid" />

        <div className="h-inner">
          {/* LEFT */}
          <div className="h-left">
            <div className="h-eyebrow">
              <div className="h-eyebrow-dot">
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="h-eyebrow-text">{eyebrow}</span>
            </div>

            <h1 className="h-title">
              {titleEnd
                ? <><span className="h-title-plain">{titleStart} </span><span className="h-title-accent">{titleEnd}</span></>
                : <span className="h-title-accent">{titleStart}</span>
              }
            </h1>

            <p className="h-subtitle">{subtitle}</p>

            <div className="h-proof">
              <div className="h-avatars">
                {["A","B","C","D"].map((l, i) => (
                  <div key={i} className="h-av">{l}</div>
                ))}
              </div>
              <div>
                <div className="h-stars">★★★★★</div>
                <div className="h-proof-copy"><strong>+2,400</strong> negocios activos</div>
              </div>
            </div>

            {badges.length > 0 && (
              <div className="h-badges">
                {badges.map((b, i) => (
                  <span key={i} className="h-badge">{b}</span>
                ))}
              </div>
            )}

            <div className="h-cta">
              <Link href={primary.href} className="h-btn-p">
                {primary.text}
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href={secondary.href} className="h-btn-s">
                {secondary.text}
              </Link>
            </div>

            <div className="h-inc-block">
              <div className="h-inc-head">
                <div className="h-inc-icon">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="h-inc-ttl">{includesTitle}</span>
              </div>
              <p className="h-inc-desc">{includesText}</p>
              {includesImages.length > 0 && (
                <div className="h-inc-imgs">
                  {includesImages.map((img, i) => (
                    <div key={i} className="h-inc-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.imageUrl} alt={img.alt || "Includes"} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="h-right">
            <div className="h-deco-ring" />
            <div className="h-deco-blob" />

            <div className="h-trust">
              <span className="h-trust-dot" />
              <span className="h-trust-txt"><strong>Activo</strong> · Perú 🇵🇪</span>
            </div>

            <div className="h-tray" />

            <div className="h-card">
              <div className="h-topbar">
                <div className="h-dots">
                  <div className="h-dot h-dot-r" />
                  <div className="h-dot h-dot-y" />
                  <div className="h-dot h-dot-g" />
                </div>
                <span className="h-bar-lbl">{mediaType === "video" ? "Video demo" : "Vista principal"}</span>
                <div className="h-live">
                  <span className="h-live-dot" />
                  Live
                </div>
              </div>

              <div className="h-frame">
                {mediaType === "video" ? (
                  isHttpUrl(mediaUrl) ? (
                    <iframe
                      src={mediaUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={title}
                    />
                  ) : (
                    <div className="h-frame-empty">Falta mediaUrl (video embed).</div>
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl || "https://picsum.photos/seed/hero/1200/900"}
                    alt={mediaAlt}
                  />
                )}
              </div>

              <div className="h-footer">
                <div className="h-footer-l">
                  <div className="h-footer-icon">
                    {mediaType === "video"
                      ? <svg width="10" height="10" fill="#fff" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      : <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21"/></svg>
                    }
                  </div>
                  {mediaType === "video" ? "Demo en vivo" : "Preview"}
                </div>
                <span className="h-footer-chip">HeroMedia</span>
              </div>
            </div>

            <div className="h-stat">
              <div className="h-stat-ico">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#50B36D" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="h-stat-val">98%</div>
                <div className="h-stat-lbl">Uptime garantizado</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}