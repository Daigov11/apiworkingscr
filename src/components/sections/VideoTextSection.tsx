import Link from "next/link";

type VideoTextSectionData = {
  badge?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  videoUrl: string;
  layout?: "split" | "stacked";
  reverse?: boolean;
  textAlign?: "left" | "center";
  ctaText?: string;
  ctaHref?: string;
};

function getYoutubeEmbedUrl(input: string) {
  const value = String(input || "").trim();
  if (!value) return "";

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return `https://www.youtube.com/embed/${value}`;
  }

  if (/youtube\.com\/embed\//i.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace(/^\//, "").trim();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return value;
  }

  return value;
}

export default function VideoTextSection({ data }: { data: VideoTextSectionData }) {
  const layout = data.layout ?? "split";
  const reverse = layout === "split" && !!data.reverse;
  const center = data.textAlign === "center";
  const embedUrl = getYoutubeEmbedUrl(data.videoUrl);

  // Split title: first half plain, second half accented (italic green)
  const words = (data.title || "").split(" ");
  const half = Math.ceil(words.length / 2);
  const titleStart = words.slice(0, half).join(" ");
  const titleEnd = words.slice(half).join(" ");

  const TextContent = (
    <div className={center ? "vt-text vt-text--center" : "vt-text"}>
      {data.badge && (
        <div className={center ? "vt-badge-wrap vt-badge-wrap--center" : "vt-badge-wrap"}>
          <span className="vt-badge">
            <span className="vt-badge-dot" />
            {data.badge}
          </span>
        </div>
      )}

      {data.title && (
        <h2 className={center ? "vt-title vt-title--center" : "vt-title"}>
          {titleEnd ? (
            <>
              <span className="vt-title-plain">{titleStart} </span>
              <span className="vt-title-accent">{titleEnd}</span>
            </>
          ) : (
            <span className="vt-title-accent">{titleStart}</span>
          )}
        </h2>
      )}

      {data.subtitle && (
        <p className={center ? "vt-subtitle vt-subtitle--center" : "vt-subtitle"}>
          {data.subtitle}
        </p>
      )}

      {data.text && (
        <p className={center ? "vt-body vt-body--center" : "vt-body"}>
          {data.text}
        </p>
      )}

      {data.ctaText && data.ctaHref && (
        <div className={center ? "vt-cta-wrap vt-cta-wrap--center" : "vt-cta-wrap"}>
          <a href={data.ctaHref} className="vt-btn">
            {data.ctaText}
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );

  const VideoFrame = (
    <div className="vt-video-wrap">
      {/* Shadow tray */}
      <div className="vt-tray" />

      <div className="vt-video-card">
        {/* Topbar */}
        <div className="vt-topbar">
          <div className="vt-dots">
            <span className="vt-dot vt-dot-r" />
            <span className="vt-dot vt-dot-y" />
            <span className="vt-dot vt-dot-g" />
          </div>
          <span className="vt-topbar-lbl">{data.title || "Video"}</span>
          <div className="vt-live">
            <span className="vt-live-dot" />
            Live
          </div>
        </div>

        {/* iframe */}
        <div className="vt-frame-wrap">
          <iframe
            src={embedUrl}
            title={data.title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="vt-iframe"
          />
        </div>

        {/* Bottom bar */}
        <div className="vt-bar" />
      </div>
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <section className="vt-root">
        <div className="vt-blob-tl" />
        <div className="vt-blob-br" />
        <div className="vt-dotgrid" />

        <div className="vt-inner">
          {layout === "stacked" ? (
            <div className="vt-stacked">
              <div className={center ? "vt-stacked-text vt-stacked-text--center" : "vt-stacked-text"}>
                {TextContent}
              </div>
              <div className="vt-stacked-video">{VideoFrame}</div>
            </div>
          ) : (
            <div className={`vt-split${reverse ? " vt-split--reverse" : ""}`}>
              <div className="vt-split-video">{VideoFrame}</div>
              <div className="vt-split-text">{TextContent}</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --vt-green: #50B36D;
    --vt-green-hover: #149C3D;
    --vt-lime: #8BCB2E;
    --vt-dark: #222322;
    --vt-mid: #5F6661;
    --vt-bg: #FFFFFF;
    --vt-soft: #F5FBF6;
    --vt-border: #DCEEDF;
  }

  .vt-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--vt-bg);
    color: var(--vt-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  /* Blobs */
  .vt-blob-tl {
    position: absolute;
    top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: vt-morph 16s ease-in-out infinite alternate;
  }
  .vt-blob-br {
    position: absolute;
    bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: vt-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes vt-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .vt-dotgrid {
    position: absolute; inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  /* Inner */
  .vt-inner {
    position: relative; z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .vt-inner { padding: 0 20px; } }

  /* ── STACKED layout ── */
  .vt-stacked { display: flex; flex-direction: column; gap: 52px; }
  .vt-stacked-text {}
  .vt-stacked-text--center { display: flex; justify-content: center; }
  .vt-stacked-video { max-width: 900px; margin: 0 auto; width: 100%; }

  /* ── SPLIT layout ── */
  .vt-split {
    display: grid;
    gap: 64px;
    align-items: center;
  }
  @media (min-width: 768px) {
    .vt-split { grid-template-columns: 1fr 1fr; }
    .vt-split--reverse .vt-split-video { order: 2; }
    .vt-split--reverse .vt-split-text  { order: 1; }
  }

  /* ── TEXT BLOCK ── */
  .vt-text { display: flex; flex-direction: column; max-width: 520px; }
  .vt-text--center { align-items: center; text-align: center; max-width: 680px; margin: 0 auto; }

  /* Badge */
  .vt-badge-wrap { margin-bottom: 20px; }
  .vt-badge-wrap--center { display: flex; justify-content: center; }
  .vt-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--vt-soft);
    border: 1px solid var(--vt-border);
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--vt-green);
  }
  .vt-badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--vt-green), var(--vt-lime));
    flex-shrink: 0;
  }

  /* Title */
  .vt-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(1.9rem, 4vw, 3.2rem);
    line-height: 1.07;
    letter-spacing: -0.022em;
    color: var(--vt-dark);
    margin: 0 0 18px;
  }
  .vt-title--center { text-align: center; }
  .vt-title-plain { color: var(--vt-dark); }
  .vt-title-accent {
    font-style: italic;
    color: var(--vt-green);
    position: relative;
    display: inline;
  }
  .vt-title-accent::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0; right: 0;
    height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: 60px 6px;
    opacity: 0.75;
  }

  /* Subtitle */
  .vt-subtitle {
    font-size: 1.0625rem; font-weight: 400;
    line-height: 1.75; color: var(--vt-mid);
    margin: 0 0 14px; max-width: 480px;
  }
  .vt-subtitle--center { text-align: center; max-width: 600px; margin-left: auto; margin-right: auto; }

  /* Body text */
  .vt-body {
    font-size: 0.9375rem; font-weight: 400;
    line-height: 1.75; color: var(--vt-mid);
    margin: 0 0 0;
  }
  .vt-body--center { text-align: center; max-width: 560px; margin-left: auto; margin-right: auto; }

  /* CTA */
  .vt-cta-wrap { margin-top: 28px; }
  .vt-cta-wrap--center { display: flex; justify-content: center; }
  .vt-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 26px;
    border-radius: 14px;
    background: var(--vt-green);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    color: #fff;
    text-decoration: none;
    box-shadow: 0 6px 24px rgba(80,179,109,0.38), 0 1px 4px rgba(80,179,109,0.2);
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .vt-btn:hover {
    background: var(--vt-green-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(80,179,109,0.48);
  }

  /* ── VIDEO CARD ── */
  .vt-video-wrap { position: relative; }

  .vt-tray {
    position: absolute;
    bottom: -12px; left: 12px; right: -12px;
    height: 100%;
    border-radius: 24px;
    background: var(--vt-border);
    z-index: 0;
  }

  .vt-video-card {
    position: relative; z-index: 1;
    border-radius: 22px;
    overflow: hidden;
    background: var(--vt-bg);
    border: 1.5px solid var(--vt-border);
    box-shadow: 0 16px 48px rgba(34,35,34,0.08), 0 2px 8px rgba(34,35,34,0.05);
  }

  /* Topbar */
  .vt-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 18px;
    background: var(--vt-soft);
    border-bottom: 1px solid var(--vt-border);
  }
  .vt-dots { display: flex; gap: 6px; }
  .vt-dot { width: 9px; height: 9px; border-radius: 50%; display: block; }
  .vt-dot-r { background: #f87171; }
  .vt-dot-y { background: #fbbf24; }
  .vt-dot-g { background: var(--vt-green); }
  .vt-topbar-lbl {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--vt-mid);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 200px;
  }
  .vt-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; color: var(--vt-green);
    flex-shrink: 0;
  }
  .vt-live-dot {
    width: 6px; height: 6px;
    border-radius: 50%; background: var(--vt-green);
    animation: vt-ping 2s ease-in-out infinite;
  }
  @keyframes vt-ping {
    0%, 100% { box-shadow: 0 0 0 0 rgba(80,179,109,0.5); }
    50% { box-shadow: 0 0 0 5px rgba(80,179,109,0); }
  }

  /* iframe wrapper — intrinsic 16:9 */
  .vt-frame-wrap {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: var(--vt-soft);
  }
  .vt-iframe {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    border: 0;
    display: block;
  }

  /* Bottom accent bar */
  .vt-bar {
    height: 3px;
    background: linear-gradient(to right, var(--vt-green), var(--vt-lime));
  }
`;