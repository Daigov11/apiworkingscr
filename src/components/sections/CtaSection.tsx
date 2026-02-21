export default function CtaSection({
  data,
}: {
  data: { title: string; text?: string; ctaText: string; ctaHref: string };
}) {
  return (
    <section className="py-10">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/50 p-7 md:p-10">
        <h2 className="text-2xl font-extrabold md:text-3xl">{data.title}</h2>
        {data.text ? <p className="mt-3 max-w-2xl text-neutral-300">{data.text}</p> : null}
        <a href={data.ctaHref} className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black">
          {data.ctaText}
        </a>
      </div>
    </section>
  );
}