export default function FeaturesSection({
  data,
}: {
  data: { title?: string; subtitle?: string; items: Array<{ title: string; text: string; icon?: string }> };
}) {
  return (
    <section className="py-10">
      {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}
      {data.subtitle ? <p className="mt-2 text-neutral-300">{data.subtitle}</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {data.items.map((it, idx) => (
          <div key={idx} className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6">
            <div className="flex items-center gap-3">
              {it.icon ? <div className="text-xl">{it.icon}</div> : null}
              <div className="text-lg font-extrabold">{it.title}</div>
            </div>
            <p className="mt-3 text-sm text-neutral-300">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}