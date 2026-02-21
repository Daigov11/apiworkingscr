export default function LogosSection({
  data,
}: {
  data: { title?: string; logos: Array<{ imageUrl: string; alt?: string; href?: string }> };
}) {
  return (
    <section className="py-10">
      {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}

      <div className="mt-6 flex flex-wrap items-center gap-6">
        {data.logos.map((l, idx) => {
          const img = (
            <img
              src={l.imageUrl}
              alt={l.alt ?? ""}
              className="h-10 w-auto opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
            />
          );

          return l.href ? (
            <a key={idx} href={l.href} className="rounded-xl border border-neutral-800 bg-neutral-950/20 px-4 py-3">
              {img}
            </a>
          ) : (
            <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950/20 px-4 py-3">
              {img}
            </div>
          );
        })}
      </div>
    </section>
  );
}