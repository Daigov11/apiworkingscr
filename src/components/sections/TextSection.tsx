export default function TextSection({ data }: { data: { title?: string; text: string } }) {
  return (
    <section className="py-8">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-7">
        {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}
        <p className="mt-3 text-neutral-300">{data.text}</p>
      </div>
    </section>
  );
}