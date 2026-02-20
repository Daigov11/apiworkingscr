import type { PageSection } from "@/libs/types/cms";

export default function ReviewsSection({ data }: Extract<PageSection, { type: "reviews" }>["data"]) {
  return (
    <section style={{ padding: 24 }}>
      {data.title ? <h2>{data.title}</h2> : null}
      <ul>
        {data.items.map((r, idx) => (
          <li key={idx}>
            <strong>{r.name}:</strong> {r.text}
          </li>
        ))}
      </ul>
    </section>
  );
}