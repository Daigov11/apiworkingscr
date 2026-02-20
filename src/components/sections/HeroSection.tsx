import type { PageSection } from "@/libs/types/cms";

export default function HeroSection({ data }: Extract<PageSection, { type: "hero" }>["data"]) {
  return (
    <section style={{ padding: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700 }}>{data.title}</h1>
      {data.subtitle ? <p>{data.subtitle}</p> : null}
      {data.ctaText && data.ctaHref ? (
        <a href={data.ctaHref} style={{ display: "inline-block", marginTop: 12 }}>
          {data.ctaText}
        </a>
      ) : null}
    </section>
  );
}