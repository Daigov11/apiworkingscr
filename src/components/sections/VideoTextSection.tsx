export default function VideoTextSection({ data }: { data: { title?: string; text: string; videoUrl: string; reverse?: boolean } }) {
  const cols = data.reverse ? "1fr 1.2fr" : "1.2fr 1fr";
  const orderVid = data.reverse ? 2 : 1;
  const orderText = data.reverse ? 1 : 2;

  return (
    <section style={{ padding: 24, display: "grid", gap: 16, gridTemplateColumns: cols, alignItems: "center" }}>
      <div style={{ order: orderText }}>
        {data.title ? <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{data.title}</h2> : null}
        <p style={{ color: "#d4d4d4" }}>{data.text}</p>
      </div>

      <div style={{ order: orderVid }}>
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", border: "1px solid #1f1f1f" }}>
          <iframe
            src={data.videoUrl}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}