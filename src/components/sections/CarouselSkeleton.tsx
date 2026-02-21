export default function CarouselSkeleton() {
  return (
    <section className="py-10">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6">
        <div className="h-5 w-40 rounded bg-neutral-800/60" />
        <div className="mt-4 h-56 w-full rounded-2xl bg-neutral-900/60" />
      </div>
    </section>
  );
}