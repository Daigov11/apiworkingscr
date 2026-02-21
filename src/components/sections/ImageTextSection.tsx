export default function ImageTextSection({
  data,
}: {
  data: { title?: string; text: string; imageUrl: string; imageAlt?: string; reverse?: boolean };
}) {
  const reverse = !!data.reverse;

  return (
    <section className="py-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className={reverse ? "md:order-2" : ""}>
          <img src={data.imageUrl} alt={data.imageAlt ?? ""} className="h-auto w-full rounded-3xl border border-neutral-800" />
        </div>

        <div className={reverse ? "md:order-1" : ""}>
          {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}
          <p className="mt-3 text-neutral-300">{data.text}</p>
        </div>
      </div>
    </section>
  );
}