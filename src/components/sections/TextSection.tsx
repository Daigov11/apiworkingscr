export default function TextSection({ data }: { data: { title?: string; text: string } }) {
  return (
    <section style={{ padding: 24 }}>
      {data.title ? <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{data.title}</h2> : null}
      <p style={{ color: "#d4d4d4" }}>{data.text}</p>
    </section>
  );
}