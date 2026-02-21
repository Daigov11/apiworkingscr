export default function StatsSection({
  data,
}: {
  data: { title?: string; items: Array<{ value: string; label: string }> };
}) {
  return (
    <section className="py-10">
      {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {data.items.map((it, idx) => (
          <div key={idx} className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6">
            <div className="text-3xl font-extrabold">{it.value}</div>
            <div className="mt-1 text-sm text-neutral-300">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}