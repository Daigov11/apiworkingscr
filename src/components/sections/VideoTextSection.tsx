export default function VideoTextSection({
  data,
}: {
  data: { title?: string; text: string; videoUrl: string; reverse?: boolean };
}) {
  const reverse = !!data.reverse;

  return (
    <section className="py-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className={reverse ? "md:order-2" : ""}>
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 pt-[56.25%]">
            <iframe
              src={data.videoUrl}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>

        <div className={reverse ? "md:order-1" : ""}>
          {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}
          <p className="mt-3 text-neutral-300">{data.text}</p>
        </div>
      </div>
    </section>
  );
}