export default function HeroSection({ data }: { data: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string } }) {
  return (
    <section className="py-10">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/40 p-7 md:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{data.title}</h1>
        {data.subtitle ? <p className="mt-3 max-w-2xl text-neutral-300">{data.subtitle}</p> : null}

        {data.ctaText && data.ctaHref ? (
          <a href={data.ctaHref} className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black">
            {data.ctaText}
          </a>
        ) : null}
      </div>
    </section>
  );
}