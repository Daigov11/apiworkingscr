import Link from "next/link";

type CardsGridData = {
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  cards: Array<{
    imageUrl: string;
    imageAlt?: string;
    title: string;
    text?: string;
    ctaText?: string;
    ctaHref?: string;
  }>;
};

function colsClass(cols?: number) {
  if (cols === 2) return "sm:grid-cols-2";
  if (cols === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

export default function CardsGridSection({ data }: { data: any }) {
  const d = (data || {}) as CardsGridData;

  const title = d.title || "Soluciones especializadas por sector";
  const subtitle = d.subtitle || "";
  const columns = d.columns || 3;
  const cards = Array.isArray(d.cards) ? d.cards : [];

  if (!cards.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 text-white">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-6">
          <div className="text-lg font-extrabold">{title}</div>
          <div className="mt-2 text-sm text-neutral-300">No hay tarjetas configuradas.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-white">
      <div>
        <h2 className="text-2xl font-extrabold">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-neutral-300">{subtitle}</p> : null}
      </div>

      <div className={`mt-6 grid gap-4 ${colsClass(columns)}`}>
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.imageUrl || "https://picsum.photos/seed/card/800/600"}
              alt={c.imageAlt || c.title || "Card"}
              className="h-40 w-full rounded-xl object-cover"
            />

            <div className="mt-3 text-lg font-extrabold">{c.title}</div>
            {c.text ? <div className="mt-1 text-sm text-neutral-300">{c.text}</div> : null}

            {c.ctaHref ? (
              <div className="mt-3">
                <Link
                  href={c.ctaHref}
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-800 bg-black/10 px-4 py-2 text-sm font-extrabold text-white hover:bg-neutral-900/40"
                >
                  {c.ctaText || "Ver más"}
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}