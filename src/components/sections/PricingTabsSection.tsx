"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BillingOption = {
  key: string;
  label: string;
  unit?: string;
};

type PlanPricing = {
  normal: number;
  promo?: number;
};

type PricingPlan = {
  name: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
  ctaText?: string;
  ctaHref?: string;
  pricing: Record<string, PlanPricing>;
};

type PricingTabsData = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  infoCta?: { text: string; href: string };
  currency?: string;
  billingOptions: BillingOption[];
  defaultBilling?: string;
  plans: PricingPlan[];
  note?: string;
};

function fmt(currency: string, n: number) {
  try {
    return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(n);
  } catch {
    if (currency === "PEN") return `S/ ${Number(n).toFixed(2)}`;
    return `${currency} ${Number(n).toFixed(2)}`;
  }
}

function getPrice(plan: PricingPlan, billingKey: string) {
  const p = (plan.pricing || {})[billingKey];
  if (!p) return null;
  const normal = Number(p.normal);
  const promo = p.promo === undefined || p.promo === null ? undefined : Number(p.promo);
  return { normal, promo };
}

export default function PricingTabsSection({ data }: { data: any }) {
  const d = (data || {}) as PricingTabsData;

  const eyebrow = d.eyebrow || "";
  const title = d.title || "Planes";
  const subtitle = d.subtitle || "";
  const currency = d.currency || "PEN";

  const billingOptions = Array.isArray(d.billingOptions) ? d.billingOptions : [];
  const plans = Array.isArray(d.plans) ? d.plans : [];

  const initialBilling = useMemo(() => {
    const keys = billingOptions.map((b) => b.key);
    if (d.defaultBilling && keys.includes(d.defaultBilling)) return d.defaultBilling;
    return billingOptions[0]?.key || "";
  }, [billingOptions, d.defaultBilling]);

  const [active, setActive] = useState(initialBilling);
  const activeOpt = billingOptions.find((b) => b.key === active) || billingOptions[0];

  const titleWords = title.split(" ");
  const half = Math.ceil(titleWords.length / 2);
  const titleStart = titleWords.slice(0, half).join(" ");
  const titleEnd = titleWords.slice(half).join(" ");

  const colClass =
    plans.length === 1 ? "pt-cols-1" :
    plans.length === 2 ? "pt-cols-2" :
    plans.length === 3 ? "pt-cols-3" :
    "pt-cols-4";

  return (
    <>
      <style>{STYLES}</style>
      <section className="pt-root">
        <div className="pt-blob-tl" />
        <div className="pt-blob-br" />
        <div className="pt-dotgrid" />

        <div className="pt-inner">
          {/* Header */}
          <div className="pt-header">
            {eyebrow && (
              <div className="pt-eyebrow-wrap">
                <div className="pt-eyebrow">
                  <div className="pt-eyebrow-dot">
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="pt-eyebrow-text">{eyebrow}</span>
                </div>
              </div>
            )}

            <h2 className="pt-title">
              {titleEnd ? (
                <>
                  <span className="pt-title-plain">{titleStart} </span>
                  <span className="pt-title-accent">{titleEnd}</span>
                </>
              ) : (
                <span className="pt-title-accent">{titleStart}</span>
              )}
            </h2>

            {subtitle && <p className="pt-subtitle">{subtitle}</p>}

            {d.infoCta?.text && d.infoCta?.href && (
              <a href={d.infoCta.href} className="pt-info-cta">
                {d.infoCta.text}
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            )}
          </div>

          {/* Billing tabs */}
          {billingOptions.length > 0 && (
            <div className="pt-tabs-wrap">
              <div className="pt-tabs">
                {billingOptions.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setActive(b.key)}
                    className={`pt-tab${b.key === active ? " pt-tab--active" : ""}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Plans grid */}
          <div className={`pt-grid ${colClass}`}>
            {plans.map((plan, i) => {
              const price = active ? getPrice(plan, active) : null;
              const hasPromo =
                price?.promo !== undefined &&
                !Number.isNaN(price.promo) &&
                price.promo !== price.normal;

              return (
                <div key={i} className={`pt-card${plan.highlighted ? " pt-card--hl" : ""}`}>
                  {plan.highlighted && (
                    <div className="pt-hl-banner">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Más popular
                    </div>
                  )}

                  <div className="pt-card-head">
                    <div>
                      <div className="pt-plan-name">{plan.name}</div>
                      {plan.badge && <div className="pt-plan-badge">{plan.badge}</div>}
                    </div>
                  </div>

                  <div className="pt-price-block">
                    {price ? (
                      <>
                        {hasPromo && (
                          <div className="pt-price-original">
                            <span className="pt-price-strikethrough">{fmt(currency, price.normal)}</span>
                            <span className="pt-offer-chip">Oferta</span>
                          </div>
                        )}
                        <div className="pt-price-main">
                          {fmt(currency, hasPromo ? (price.promo as number) : price.normal)}
                        </div>
                        <div className="pt-price-unit">
                          {activeOpt?.unit || activeOpt?.label || ""}
                        </div>
                      </>
                    ) : (
                      <div className="pt-no-price">Sin precio configurado para este periodo.</div>
                    )}
                  </div>

                  <ul className="pt-features">
                    {(Array.isArray(plan.features) ? plan.features : []).slice(0, 12).map((f, fi) => (
                      <li key={fi} className="pt-feature">
                        <div className="pt-feature-icon">
                          <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.ctaHref && (
                    <Link
                      href={plan.ctaHref}
                      className={`pt-cta${plan.highlighted ? " pt-cta--hl" : ""}`}
                    >
                      {plan.ctaText || "Comenzar ahora"}
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}

                  <div className="pt-card-bar" />
                </div>
              );
            })}
          </div>

          {d.note && <p className="pt-note">{d.note}</p>}
        </div>
      </section>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap');

  :root {
    --pt-green: #50B36D;
    --pt-green-hover: #149C3D;
    --pt-lime: #8BCB2E;
    --pt-dark: #222322;
    --pt-mid: #5F6661;
    --pt-bg: #FFFFFF;
    --pt-soft: #F5FBF6;
    --pt-border: #DCEEDF;
  }

  .pt-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--pt-bg);
    color: var(--pt-dark);
    position: relative;
    overflow: hidden;
    padding: 88px 0 104px;
  }

  .pt-blob-tl {
    position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    background: radial-gradient(ellipse at 40% 40%, rgba(80,179,109,0.10) 0%, rgba(139,203,46,0.06) 50%, transparent 75%);
    pointer-events: none;
    animation: pt-morph 16s ease-in-out infinite alternate;
  }
  .pt-blob-br {
    position: absolute; bottom: -80px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at 60% 60%, rgba(139,203,46,0.09) 0%, rgba(80,179,109,0.05) 55%, transparent 80%);
    pointer-events: none;
    animation: pt-morph 20s ease-in-out infinite alternate-reverse;
  }
  @keyframes pt-morph {
    0%   { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
    50%  { border-radius: 40% 60% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 50% 50% 60% 40% / 70% 40% 60% 30%; }
  }
  .pt-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(80,179,109,0.18) 1px, transparent 1px);
    background-size: 30px 30px;
    -webkit-mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 100%);
    opacity: 0.4;
  }

  .pt-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px;
  }
  @media (max-width: 640px) { .pt-inner { padding: 0 20px; } }

  /* Header */
  .pt-header { text-align: center; margin-bottom: 48px; }

  .pt-eyebrow-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
  .pt-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    background: var(--pt-soft); border: 1px solid var(--pt-border);
  }
  .pt-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: linear-gradient(135deg, var(--pt-green), var(--pt-lime));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .pt-eyebrow-text { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--pt-green); }

  .pt-title {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    font-size: clamp(2rem, 4.5vw, 3.4rem);
    line-height: 1.07; letter-spacing: -0.022em;
    color: var(--pt-dark); margin: 0 0 16px;
  }
  .pt-title-plain { color: var(--pt-dark); }
  .pt-title-accent {
    font-style: italic; color: var(--pt-green);
    position: relative; display: inline;
  }
  .pt-title-accent::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0; height: 6px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8'%3E%3Cpath d='M0 4 Q10 0 20 4 Q30 8 40 4 Q50 0 60 4 Q70 8 80 4 Q90 0 100 4 Q110 8 120 4' stroke='%238BCB2E' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x; background-size: 60px 6px; opacity: 0.75;
  }

  .pt-subtitle {
    font-size: 1.0625rem; line-height: 1.75; color: var(--pt-mid);
    max-width: 600px; margin: 0 auto 20px;
  }

  .pt-info-cta {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 12px;
    background: var(--pt-soft); border: 1.5px solid var(--pt-border);
    font-size: 13.5px; font-weight: 700; color: var(--pt-green);
    text-decoration: none;
    transition: border-color 0.18s, background 0.18s, transform 0.18s;
  }
  .pt-info-cta:hover { border-color: var(--pt-green); background: rgba(80,179,109,0.06); transform: translateY(-1px); }

  /* Tabs */
  .pt-tabs-wrap { display: flex; justify-content: center; margin-bottom: 44px; }
  .pt-tabs {
    display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 6px;
    padding: 6px;
    border-radius: 18px;
    background: var(--pt-soft);
    border: 1.5px solid var(--pt-border);
  }
  .pt-tab {
    padding: 9px 20px; border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 700; cursor: pointer;
    border: 1.5px solid transparent;
    background: transparent; color: var(--pt-mid);
    transition: background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s;
    white-space: nowrap;
  }
  .pt-tab:hover:not(.pt-tab--active) { color: var(--pt-dark); background: rgba(80,179,109,0.06); border-color: var(--pt-border); }
  .pt-tab--active {
    background: var(--pt-green); color: #fff;
    border-color: var(--pt-green);
    box-shadow: 0 4px 16px rgba(80,179,109,0.35);
  }

  /* Grid — responsive columns */
  .pt-grid { display: grid; gap: 20px; }
  .pt-cols-1 { grid-template-columns: 1fr; max-width: 380px; margin: 0 auto; }
  .pt-cols-2 { grid-template-columns: 1fr; }
  .pt-cols-3 { grid-template-columns: 1fr; }
  .pt-cols-4 { grid-template-columns: 1fr; }

  @media (min-width: 640px) {
    .pt-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .pt-cols-3 { grid-template-columns: repeat(2, 1fr); }
    .pt-cols-4 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .pt-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .pt-cols-4 { grid-template-columns: repeat(4, 1fr); }
  }

  /* Card */
  .pt-card {
    position: relative;
    display: flex; flex-direction: column;
    padding: 28px 24px 32px;
    border-radius: 22px;
    background: var(--pt-bg);
    border: 1.5px solid var(--pt-border);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(34,35,34,0.05), 0 1px 4px rgba(34,35,34,0.04);
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .pt-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 44px rgba(80,179,109,0.11), 0 4px 14px rgba(34,35,34,0.07);
    border-color: rgba(80,179,109,0.35);
  }
  .pt-card--hl {
    background: var(--pt-soft);
    border-color: var(--pt-green);
    box-shadow: 0 8px 40px rgba(80,179,109,0.18), 0 2px 8px rgba(34,35,34,0.06);
  }
  .pt-card--hl:hover {
    box-shadow: 0 18px 56px rgba(80,179,109,0.26), 0 4px 14px rgba(34,35,34,0.07);
  }
  .pt-card:hover .pt-card-bar { opacity: 1; }

  /* Popular banner */
  .pt-hl-banner {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 999px;
    background: linear-gradient(135deg, var(--pt-green), var(--pt-lime));
    font-size: 11px; font-weight: 800; color: #fff;
    letter-spacing: 0.04em;
    margin-bottom: 14px;
    width: fit-content;
    box-shadow: 0 3px 12px rgba(80,179,109,0.35);
  }

  .pt-card-head { margin-bottom: 20px; }
  .pt-plan-name {
    font-family: 'Fraunces', serif;
    font-weight: 700; font-size: 1.25rem;
    color: var(--pt-dark); line-height: 1.2;
  }
  .pt-plan-badge {
    display: inline-flex; margin-top: 8px;
    padding: 4px 12px; border-radius: 999px;
    background: rgba(80,179,109,0.1);
    border: 1px solid rgba(80,179,109,0.2);
    font-size: 11.5px; font-weight: 600; color: var(--pt-green);
  }

  /* Price */
  .pt-price-block { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--pt-border); }
  .pt-price-original { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .pt-price-strikethrough { font-size: 13.5px; color: var(--pt-mid); text-decoration: line-through; }
  .pt-offer-chip {
    padding: 2px 9px; border-radius: 999px;
    background: rgba(139,203,46,0.12); border: 1px solid rgba(139,203,46,0.25);
    font-size: 10.5px; font-weight: 700; color: #4a7c10;
  }
  .pt-price-main {
    font-family: 'Fraunces', serif;
    font-weight: 900; font-size: 2.4rem;
    line-height: 1; color: var(--pt-dark);
    letter-spacing: -0.02em;
  }
  .pt-price-unit { font-size: 12.5px; color: var(--pt-mid); margin-top: 4px; font-weight: 500; }
  .pt-no-price {
    padding: 12px 14px; border-radius: 11px;
    background: var(--pt-soft); border: 1px solid var(--pt-border);
    font-size: 13px; color: var(--pt-mid);
  }

  /* Features */
  .pt-features { list-style: none; padding: 0; margin: 0 0 auto; display: flex; flex-direction: column; gap: 10px; }
  .pt-feature { display: flex; align-items: flex-start; gap: 9px; font-size: 13.5px; color: var(--pt-dark); line-height: 1.5; }
  .pt-feature-icon {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
    background: linear-gradient(135deg, var(--pt-green), var(--pt-lime));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(80,179,109,0.28);
  }

  /* CTA */
  .pt-cta {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    margin-top: 22px;
    padding: 13px 20px; border-radius: 13px;
    background: var(--pt-soft); border: 1.5px solid var(--pt-border);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px; font-weight: 700; color: var(--pt-green);
    text-decoration: none;
    transition: background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .pt-cta:hover {
    background: var(--pt-green); border-color: var(--pt-green); color: #fff;
    transform: translateY(-1px); box-shadow: 0 5px 18px rgba(80,179,109,0.38);
  }
  .pt-cta--hl {
    background: var(--pt-green); border-color: var(--pt-green); color: #fff;
    box-shadow: 0 5px 18px rgba(80,179,109,0.38);
  }
  .pt-cta--hl:hover { background: var(--pt-green-hover); border-color: var(--pt-green-hover); box-shadow: 0 8px 28px rgba(80,179,109,0.48); }

  /* Bottom accent */
  .pt-card-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(to right, var(--pt-green), var(--pt-lime));
    opacity: 0; transition: opacity 0.22s;
  }
  .pt-card--hl .pt-card-bar { opacity: 1; }

  /* Note */
  .pt-note { text-align: center; font-size: 12px; color: var(--pt-mid); margin-top: 28px; }
`;