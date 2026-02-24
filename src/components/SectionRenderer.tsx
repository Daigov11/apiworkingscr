import type { SectionInstance } from "@/lib/builder/types";
import { schemaByType } from "@/lib/builder/registry";
import { componentByType } from "@/lib/builder/componentRegistry";

export default function SectionRenderer({ section }: { section: SectionInstance }) {
  const schema = schemaByType[section.type];
  const Comp = componentByType[section.type];

  if (!schema || !Comp) {
    return (
      <section className="py-6">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          <strong>Sección inválida:</strong> {section.type} (UNKNOWN_TYPE)
        </div>
      </section>
    );
  }

  const parsed = schema.safeParse(section.data);
  if (!parsed.success) {
    return (
      <section className="py-6">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          <strong>Data inválida:</strong> {section.type}
        </div>
      </section>
    );
  }

  return <Comp data={parsed.data} />;
}