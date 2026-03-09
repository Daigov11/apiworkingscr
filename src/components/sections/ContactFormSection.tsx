"use client";

import { useMemo, useState } from "react";

type ContactFormData = {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  formTitle?: string;
  giroOptions?: string[];
  primaryCtaText?: string;
  secondaryCtaText?: string;
};

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}

export default function ContactFormSection({ data }: { data: any }) {
  const d = (data || {}) as ContactFormData;

  const title = d.title || "Agenda tu demo y recibe asesoría";
  const subtitle =
    d.subtitle ||
    "Déjanos tus datos y te contactamos para mostrarte cómo ApiWorking mejora tu negocio.";

  const bullets = Array.isArray(d.bullets) ? d.bullets : [];
  const formTitle = d.formTitle || "Contáctanos";

  const giroOptions = useMemo(() => {
    return Array.isArray(d.giroOptions) && d.giroOptions.length
      ? d.giroOptions
      : ["resto", "tienda", "hotel", "otros"];
  }, [d.giroOptions]);

  const btnSend = d.primaryCtaText || "Enviar";
  const btnClear = d.secondaryCtaText || "Limpiar";

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [giroNegocio, setGiroNegocio] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit() {
    setMsg(null);
    const payload = {
      nombreCompleto: nombreCompleto.trim(),
      telefono: telefono.trim(),
      nombreNegocio: nombreNegocio.trim(),
      giroNegocio: giroNegocio.trim(),
    };

    if (!payload.nombreCompleto || !payload.telefono || !payload.nombreNegocio || !payload.giroNegocio) {
      setMsg({ type: "err", text: "Completa todos los campos." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        setMsg({ type: "err", text: json?.message || "Error enviando el formulario." });
        return;
      }

      setMsg({ type: "ok", text: "¡Listo! Te contactaremos pronto." });
      setNombreCompleto("");
      setTelefono("");
      setNombreNegocio("");
      setGiroNegocio("");
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Error inesperado." });
    } finally {
      setLoading(false);
    }
  }

  function onClear() {
    setMsg(null);
    setNombreCompleto("");
    setTelefono("");
    setNombreNegocio("");
    setGiroNegocio("");
  }

  const titleWords = title.split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-root">
        <div className="cf-blob-tl" />
        <div className="cf-blob-br" />
        <div className="cf-dotgrid" />

        <div className="cf-inner">
          <div className="cf-grid">

            {/* LEFT */}
            <div className="cf-left">
              <div className="cf-eyebrow">
                <div className="cf-eyebrow-dot">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
                  </svg>
                </div>
                <span className="cf-eyebrow-text">Habla con nosotros</span>
              </div>

              <h2 className="cf-title">
                {titleEnd ? (
                  <>
                    <span className="cf-title-plain">{titleStart} </span>
                    <span className="cf-title-accent">{titleEnd}</span>
                  </>
                ) : (
                  <span className="cf-title-accent">{titleStart}</span>
                )}
              </h2>

              <p className="cf-subtitle">{subtitle}</p>

              {bullets.length > 0 && (
                <ul className="cf-bullets">
                  {bullets.map((b, i) => (
                    <li key={i} className="cf-bullet">
                      <div className="cf-bullet-icon">
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="cf-trust">
                <div className="cf-trust-avatars">
                  {["A", "B", "C"].map((l, i) => (
                    <div key={i} className="cf-av">{l}</div>
                  ))}
                </div>
                <div>
                  <div className="cf-stars">★★★★★</div>
                  <div className="cf-trust-copy"><strong>+2,400</strong> negocios activos</div>
                </div>
              </div>
            </div>

            {/* RIGHT — Form card */}
            <div className="cf-right">
              <div className="cf-tray" />
              <div className="cf-card">

                {/* Topbar */}
                <div className="cf-topbar">
                  <div className="cf-dots">
                    <span className="cf-dot cf-dot-r" />
                    <span className="cf-dot cf-dot-y" />
                    <span className="cf-dot cf-dot-g" />
                  </div>
                  <span className="cf-topbar-lbl">{formTitle}</span>
                  <div className="cf-live">
                    <span className="cf-live-dot" />
                    En línea
                  </div>
                </div>

                <div className="cf-form-body">
                  {msg && (
                    <div className={`cf-alert${msg.type === "ok" ? " cf-alert--ok" : " cf-alert--err"}`}>
                      <div className={`cf-alert-dot cf-alert-dot--${msg.type}`} />
                      {msg.text}
                    </div>
                  )}

                  <div className="cf-field">
                    <label className="cf-label">Nombre completo</label>
                    <input
                      className="cf-input"
                      value={nombreCompleto}
                      onChange={(e) => setNombreCompleto(e.target.value)}
                      placeholder="¿Cómo te llamas?"
                      autoComplete="name"
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label">WhatsApp</label>
                    <div className="cf-input-wrap">
                      <span className="cf-input-prefix">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <input
                        className="cf-input cf-input--prefixed"
                        value={telefono}
                        onChange={(e) => setTelefono(onlyDigits(e.target.value))}
                        placeholder="Solo dígitos"
                        inputMode="numeric"
                        autoComplete="tel"
                      />
                    </div>
                    <span className="cf-hint">Solo dígitos, sin espacios</span>
                  </div>

                  <div className="cf-field">
                    <label className="cf-label">Nombre del negocio</label>
                    <input
                      className="cf-input"
                      value={nombreNegocio}
                      onChange={(e) => setNombreNegocio(e.target.value)}
                      placeholder="Nombre comercial"
                      autoComplete="organization"
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label">Giro del negocio</label>
                    <div className="cf-select-wrap">
                      <select
                        className="cf-select"
                        value={giroNegocio}
                        onChange={(e) => setGiroNegocio(e.target.value)}
                      >
                        <option value="">Seleccionar...</option>
                        {giroOptions.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      <span className="cf-select-arrow">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="cf-actions">
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={loading}
                      className="cf-btn-p"
                    >
                      {loading ? (
                        <>
                          <span className="cf-spinner" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          {btnSend}
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onClear}
                      disabled={loading}
                      className="cf-btn-s"
                    >
                      {btnClear}
                    </button>
                  </div>
                </div>

                <div className="cf-bar" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --cf-green: #50B36D;
    --cf-green-hover: #149C3D;
    --cf-lime: #8BCB2E;
    --cf-dark: #222322;
    --cf-mid: #5F6661;
    --cf-bg: #FFFFFF;
    --cf-soft: #F5FBF6;
    --cf-border: #DCEEDF;
  }

  .cf-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--cf-bg);
    color: var(--cf-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .cf-blob-tl {
    position: absolute;
    top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: cf-morph 16s ease-in-out infinite alternate;
  }
  .cf-blob-br {
    position: absolute;
    bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: cf-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes cf-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .cf-dotgrid {
    position: absolute; inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .cf-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .cf-inner { padding: 0 20px; } }

  .cf-grid {
    display: grid;
    gap: 64px;
    align-items: start;
  }
  @media (min-width: 1024px) { .cf-grid { grid-template-columns: 1fr 1fr; } }

  /* LEFT */
  .cf-left { display: flex; flex-direction: column; }

  .cf-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--cf-soft);
    border: 1px solid var(--cf-border);
    width: fit-content;
    margin-bottom: 24px;
  }
  .cf-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--cf-green), var(--cf-lime));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cf-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--cf-green); }

  .cf-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--cf-dark);
    margin: 0 0 18px;
  }
  .cf-title-plain { color: var(--cf-dark); }
  .cf-title-accent {
    font-style: italic; color: var(--cf-green);
    position: relative; display: inline;
  }
  .cf-title-accent::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0; right: 0;
    height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: 60px 6px;
    opacity: 0.75;
  }

  .cf-subtitle {
    font-size: 1.0625rem; line-height: 1.75;
    color: var(--cf-mid); margin: 0 0 28px;
    max-width: 460px;
  }

  .cf-bullets { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 12px; }
  .cf-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--cf-dark); line-height: 1.5; }
  .cf-bullet-icon {
    width: 20px; height: 20px; border-radius: 50%;
    background: linear-gradient(135deg, var(--cf-green), var(--cf-lime));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
    box-shadow: 0 2px 8px rgba(80,179,109,0.3);
  }

  .cf-trust { display: flex; align-items: center; gap: 12px; }
  .cf-trust-avatars { display: flex; }
  .cf-av {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid var(--cf-bg);
    background: var(--cf-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; color: var(--cf-green);
    margin-left: -7px;
  }
  .cf-av:first-child { margin-left: 0; }
  .cf-stars { color: var(--cf-lime); font-size: 11px; margin-bottom: 2px; }
  .cf-trust-copy { font-size: 12px; font-weight: 500; color: var(--cf-mid); }
  .cf-trust-copy strong { color: var(--cf-dark); font-weight: 800; }

  /* RIGHT */
  .cf-right { position: relative; }
  .cf-tray {
    position: absolute;
    bottom: -12px; left: 12px; right: -12px;
    height: 100%; border-radius: 24px;
    background: var(--cf-border); z-index: 0;
  }
  .cf-card {
    position: relative; z-index: 1;
    border-radius: 22px; overflow: hidden;
    background: var(--cf-bg);
    border: 1.5px solid var(--cf-border);
    box-shadow: 0 16px 48px rgba(34,35,34,0.08), 0 2px 8px rgba(34,35,34,0.05);
  }

  .cf-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 18px;
    background: var(--cf-soft);
    border-bottom: 1px solid var(--cf-border);
  }
  .cf-dots { display: flex; gap: 6px; }
  .cf-dot { width: 9px; height: 9px; border-radius: 50%; display: block; }
  .cf-dot-r { background: #f87171; }
  .cf-dot-y { background: #fbbf24; }
  .cf-dot-g { background: var(--cf-green); }
  .cf-topbar-lbl { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cf-mid); }
  .cf-live { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--cf-green); }
  .cf-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--cf-green);
    animation: cf-ping 2s ease-in-out infinite;
  }
  @keyframes cf-ping {
    0%, 100% { box-shadow: 0 0 0 0 rgba(80,179,109,0.5); }
    50% { box-shadow: 0 0 0 5px rgba(80,179,109,0); }
  }

  .cf-form-body { padding: 28px 26px 26px; display: flex; flex-direction: column; gap: 0; }

  .cf-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-radius: 12px;
    font-size: 13.5px; font-weight: 500;
    margin-bottom: 20px;
    border: 1.5px solid;
  }
  .cf-alert--ok {
    background: rgba(80,179,109,0.07);
    border-color: rgba(80,179,109,0.25);
    color: var(--cf-green-hover);
  }
  .cf-alert--err {
    background: rgba(239,68,68,0.06);
    border-color: rgba(239,68,68,0.2);
    color: #b91c1c;
  }
  .cf-alert-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .cf-alert-dot--ok { background: var(--cf-green); }
  .cf-alert-dot--err { background: #ef4444; }

  .cf-field { margin-bottom: 18px; }
  .cf-field:last-of-type { margin-bottom: 0; }

  .cf-label {
    display: block;
    font-size: 12.5px; font-weight: 600;
    color: var(--cf-dark);
    margin-bottom: 7px;
    letter-spacing: 0.01em;
  }

  .cf-input {
    width: 100%;
    padding: 11px 14px;
    border-radius: 12px;
    border: 1.5px solid var(--cf-border);
    background: var(--cf-soft);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; color: var(--cf-dark);
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
  }
  .cf-input::placeholder { color: #aab5ad; }
  .cf-input:focus {
    border-color: var(--cf-green);
    box-shadow: 0 0 0 3px rgba(80,179,109,0.12);
    background: var(--cf-bg);
  }

  .cf-input-wrap { position: relative; }
  .cf-input-prefix {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--cf-mid); display: flex; align-items: center;
    pointer-events: none;
  }
  .cf-input--prefixed { padding-left: 36px; }

  .cf-hint { display: block; font-size: 11.5px; color: var(--cf-mid); margin-top: 5px; }

  .cf-select-wrap { position: relative; }
  .cf-select {
    width: 100%;
    padding: 11px 36px 11px 14px;
    border-radius: 12px;
    border: 1.5px solid var(--cf-border);
    background: var(--cf-soft);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; color: var(--cf-dark);
    appearance: none; -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .cf-select:focus {
    border-color: var(--cf-green);
    box-shadow: 0 0 0 3px rgba(80,179,109,0.12);
    background: var(--cf-bg);
  }
  .cf-select-arrow {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: var(--cf-mid); pointer-events: none; display: flex; align-items: center;
  }

  .cf-actions { display: flex; gap: 12px; margin-top: 24px; }

  .cf-btn-p {
    flex: 1;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 20px;
    border-radius: 13px;
    background: var(--cf-green);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700; color: #fff;
    border: none; cursor: pointer;
    box-shadow: 0 6px 24px rgba(80,179,109,0.38);
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .cf-btn-p:hover:not(:disabled) {
    background: var(--cf-green-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(80,179,109,0.48);
  }
  .cf-btn-p:disabled { opacity: 0.55; cursor: not-allowed; }

  .cf-btn-s {
    flex: 1;
    display: inline-flex; align-items: center; justify-content: center;
    padding: 13px 20px;
    border-radius: 13px;
    background: var(--cf-soft);
    border: 1.5px solid var(--cf-border);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 700; color: var(--cf-dark);
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, transform 0.18s;
  }
  .cf-btn-s:hover:not(:disabled) {
    border-color: var(--cf-green);
    background: rgba(80,179,109,0.05);
    transform: translateY(-2px);
  }
  .cf-btn-s:disabled { opacity: 0.55; cursor: not-allowed; }

  .cf-spinner {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: cf-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes cf-spin { to { transform: rotate(360deg); } }

  .cf-bar {
    height: 3px;
    background: linear-gradient(to right, var(--cf-green), var(--cf-lime));
  }
`;