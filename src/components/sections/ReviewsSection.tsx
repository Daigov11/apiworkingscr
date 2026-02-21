import type { PageSection } from "@/lib/types/cms";

export default function ReviewsSection({ title, items }: Extract<PageSection, { type: "reviews" }>["data"]) {
  return (
    <section style={{ padding: 24 }}>
      {title ? <h2>{title}</h2> : null}
      <ul>
        {items.map((r, idx) => (
          <li key={idx}>
            <strong>{r.name}:</strong> {r.text}
          </li>
        ))}
      </ul>
    </section>
  );
}