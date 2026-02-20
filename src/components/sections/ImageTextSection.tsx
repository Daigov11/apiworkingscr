export default function ImageTextSection({ data }: { data: { title?: string; text: string; imageUrl: string; imageAlt?: string; reverse?: boolean } }) {
  const cols = data.reverse ? "1fr 1.2fr" : "1.2fr 1fr";
  const orderImg = data.reverse ? 2 : 1;
  const orderText = data.reverse ? 1 : 2;

  return (
    <section style={{ padding: 24, display: "grid", gap: 16, gridTemplateColumns: cols, alignItems: "center" }}>
      <div style={{ order: orderText }}>
        {data.title ? <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{data.title}</h2> : null}
        <p style={{ color: "#d4d4d4" }}>{data.text}</p>
      </div>

      <div style={{ order: orderImg }}>
        <img src={data.imageUrl} alt={data.imageAlt ?? ""} style={{ width: "100%", height: "auto", borderRadius: 16, border: "1px solid #1f1f1f" }} />
      </div>
    </section>
  );
}