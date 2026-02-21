export default function PricingSection({
  data,
}: {
  data: {
    title?: string;
    subtitle?: string;
    plans: Array<{
      name: string;
      price: string;
      period?: string;
      features: string[];
      ctaText?: string;
      ctaHref?: string;
      highlighted?: boolean;
    }>;
  };
}) {
  return (
    <section className="py-10">
      {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}
      {data.subtitle ? <p className="mt-2 text-neutral-300">{data.subtitle}</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {data.plans.map((p, idx) => (
          <div
            key={idx}
            className={[
              "rounded-3xl border p-6",
              p.highlighted ? "border-white/40 bg-white/10" : "border-neutral-800 bg-neutral-950/30",
            ].join(" ")}
          >
            <div className="text-sm font-extrabold text-neutral-200">{p.name}</div>
            <div className="mt-3 text-3xl font-extrabold">
              {p.price} {p.period ? <span className="text-sm font-bold text-neutral-300">/{p.period}</span> : null}
            </div>

            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {p.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            {p.ctaText && p.ctaHref ? (
              <a href={p.ctaHref} className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black">
                {p.ctaText}
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}