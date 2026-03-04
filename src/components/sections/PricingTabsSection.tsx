"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BillingOption = {
  key: string;      // "monthly" | "semiannual" | "annual" | ...
  label: string;    // "Mensuales" | "Semestrales" | "Anuales"
  unit?: string;    // "/mes" | "/semestral" | "/anual" (opcional)
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

  // pricing dinámico por billing key
  pricing: Record<string, PlanPricing>;
};

type PricingTabsData = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;

  infoCta?: { text: string; href: string };

  currency?: string; // "PEN"
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

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 text-white">
      <div className="text-center">
        {eyebrow ? (
          <div className="mx-auto inline-flex items-center rounded-full border border-neutral-800 bg-black/10 px-3 py-1 text-xs font-bold text-neutral-200">
            {eyebrow}
          </div>
        ) : null}

        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{title}</h2>
        {subtitle ? <p className="mx-auto mt-2 max-w-3xl text-sm text-neutral-300 md:text-base">{subtitle}</p> : null}

        {d.infoCta?.text && d.infoCta?.href ? (
          <div className="mt-4">
            <a
              href={d.infoCta.href}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-800 bg-black/10 px-4 py-2 text-sm font-extrabold text-white hover:bg-neutral-900/40"
            >
              {d.infoCta.text}
            </a>
          </div>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-950/30 p-2">
          {billingOptions.map((b) => {
            const isActive = b.key === active;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => setActive(b.key)}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-extrabold",
                  isActive ? "bg-white text-black" : "border border-neutral-800 bg-black/10 text-white hover:bg-neutral-900/40",
                ].join(" ")}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plans */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, i) => {
          const price = active ? getPrice(plan, active) : null;

          const hasPromo =
            price && price.promo !== undefined && !Number.isNaN(price.promo) && price.promo !== price.normal;

          const cardClass = plan.highlighted
            ? "border-emerald-500/50 bg-emerald-950/20"
            : "border-neutral-800 bg-neutral-950/30";

          return (
            <div key={i} className={`rounded-3xl border p-5 ${cardClass}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold">{plan.name}</div>
                  {plan.badge ? (
                    <div className="mt-2 inline-flex rounded-full border border-neutral-800 bg-black/10 px-3 py-1 text-xs font-bold text-neutral-200">
                      {plan.badge}
                    </div>
                  ) : null}
                </div>

                {plan.highlighted ? (
                  <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-black">
                    Más popular
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                {price ? (
                  <>
                    <div className="text-3xl font-extrabold">
                      {hasPromo ? fmt(currency, price.promo as number) : fmt(currency, price.normal)}
                    </div>

                    <div className="mt-1 text-sm text-neutral-300">
                      {activeOpt?.unit ? activeOpt.unit : activeOpt?.label ? activeOpt.label : ""}
                    </div>

                    {hasPromo ? (
                      <div className="mt-2 text-sm text-neutral-400">
                        <span className="line-through">{fmt(currency, price.normal)}</span>
                        <span className="ml-2 rounded-full border border-neutral-800 bg-black/10 px-2 py-1 text-xs text-neutral-200">
                          Oferta
                        </span>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="rounded-xl border border-neutral-800 bg-black/10 p-3 text-sm text-neutral-300">
                    Sin precio configurado para este periodo.
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="mt-5 space-y-2 text-sm text-neutral-200">
                {(Array.isArray(plan.features) ? plan.features : []).slice(0, 12).map((f, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.ctaHref ? (
                <div className="mt-5">
                  <Link
                    href={plan.ctaHref}
                    className={[
                      "block w-full rounded-xl px-4 py-3 text-center text-sm font-extrabold",
                      plan.highlighted ? "bg-emerald-500 text-black" : "bg-white text-black",
                    ].join(" ")}
                  >
                    {plan.ctaText || "Comenzar ahora"}
                  </Link>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {d.note ? (
        <div className="mt-6 text-center text-xs text-neutral-400">{d.note}</div>
      ) : null}
    </section>
  );
}