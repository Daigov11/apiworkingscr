import type { PageSection } from "@/libs/types/cms";

export default function ImageTextSection({ data }: Extract<PageSection, { type: "imageText" }>["data"]) {
  return (
    <section style={{ padding: 24, display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
      <img src={data.imageUrl} alt={data.imageAlt ?? ""} style={{ width: "100%", height: "auto" }} />
      <div>
        {data.title ? <h2>{data.title}</h2> : null}
        <p>{data.text}</p>
      </div>
    </section>
  );
}