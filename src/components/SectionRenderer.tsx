import type { SectionInstance } from "@/lib/builder/types";
import { schemaByType } from "@/lib/builder/registry";
import { componentByType } from "@/lib/builder/componentRegistry";

export default function SectionRenderer({ section }: { section: SectionInstance }) {
  const rawType = String((section as any)?.type ?? "").trim();
  const type = rawType; // exact
  const typeLower = rawType.toLowerCase();

  const schema = schemaByType[type] || schemaByType[typeLower];
  const Comp = componentByType[type] || componentByType[typeLower];

  if (!schema || !Comp) {
    return (
      <section className="py-6">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          <strong>Sección inválida:</strong> {rawType || "(sin type)"} (UNKNOWN_TYPE)
          <div className="mt-2 text-xs text-neutral-300">
            Types disponibles: {Object.keys(schemaByType).join(", ")}
          </div>
        </div>
      </section>
    );
  }

  const parsed = schema.safeParse((section as any).data);
  if (!parsed.success) {
    return (
      <section className="py-6">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          <strong>Data inválida:</strong> {rawType}
        </div>
      </section>
    );
  }

  return <Comp data={parsed.data} />;
}