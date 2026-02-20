export default function HeroSection({ data }: { data: { title: string; subtitle?: string; ctaText?: string; ctaHref?: string } }) {
  return (
    <section style={{ padding: 24 }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>{data.title}</h1>
      {data.subtitle ? <p style={{ color: "#bdbdbd", marginBottom: 14 }}>{data.subtitle}</p> : null}
      {data.ctaText && data.ctaHref ? (
        <a href={data.ctaHref} style={{ display: "inline-block", background: "#fff", color: "#000", padding: "10px 12px", borderRadius: 10, fontWeight: 800, textDecoration: "none" }}>
          {data.ctaText}
        </a>
      ) : null}
    </section>
  );
}