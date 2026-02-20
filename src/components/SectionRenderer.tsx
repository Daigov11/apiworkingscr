import type { SectionInstance } from "@/lib/builder/types";
import { validateSection } from "@/lib/builder/registry";

export default function SectionRenderer({ section }: { section: SectionInstance }) {
  const result = validateSection(section);

  if (!result.ok) {
    // En producción podrías ocultarlo; en dev conviene verlo
    return (
      <section style={{ padding: 16, border: "1px solid #331", margin: 16, borderRadius: 12 }}>
        <strong>Sección inválida:</strong> {section.type} ({result.error})
      </section>
    );
  }

  const Comp = result.def.Component;
  return <Comp data={result.data} />;
}