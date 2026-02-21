export default function FaqSection({
  data,
}: {
  data: { title?: string; items: Array<{ question: string; answer: string }> };
}) {
  return (
    <section className="py-10">
      {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}

      <div className="mt-6 space-y-3">
        {data.items.map((it, idx) => (
          <details key={idx} className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-5">
            <summary className="cursor-pointer list-none text-sm font-extrabold">{it.question}</summary>
            <p className="mt-3 text-sm text-neutral-300">{it.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}