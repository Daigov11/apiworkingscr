import type { PageSection } from "@/libs/types/cms";

export default function TextSection({ data }: Extract<PageSection, { type: "text" }>["data"]) {
  return (
    <section style={{ padding: 24 }}>
      {data.title ? <h2>{data.title}</h2> : null}
      <p>{data.text}</p>
    </section>
  );
}