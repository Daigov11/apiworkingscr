export default function TestimonialsSection({
  data,
}: {
  data: { title?: string; items: Array<{ name: string; role?: string; text: string; avatarUrl?: string }> };
}) {
  return (
    <section className="py-10">
      {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {data.items.map((t, idx) => (
          <div key={idx} className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6">
            <p className="text-sm text-neutral-200">“{t.text}”</p>
            <div className="mt-5 flex items-center gap-3">
              {t.avatarUrl ? (
                <img src={t.avatarUrl} alt={t.name} className="h-9 w-9 rounded-full border border-neutral-800" />
              ) : (
                <div className="h-9 w-9 rounded-full border border-neutral-800 bg-neutral-900" />
              )}
              <div>
                <div className="text-sm font-extrabold">{t.name}</div>
                {t.role ? <div className="text-xs text-neutral-400">{t.role}</div> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}