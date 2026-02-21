export default function DividerSection({ data }: { data: { label?: string } }) {
  return (
    <section className="py-6">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-neutral-800" />
        {data.label ? <div className="text-xs font-bold text-neutral-400">{data.label}</div> : null}
        <div className="h-px flex-1 bg-neutral-800" />
      </div>
    </section>
  );
}