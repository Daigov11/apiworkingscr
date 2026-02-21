export default function SpacerSection({ data }: { data: { size: number } }) {
  return <div style={{ height: data.size }} />;
}