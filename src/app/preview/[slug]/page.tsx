import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";

export const dynamic = "force-dynamic";

async function getPreview(slug: string) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const res = await fetch(`${site}/api/preview/page-by-slug?slug=${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (res.status === 401) {
    return { unauthorized: true as const };
  }
  if (!res.ok) return null;

  return res.json();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const data: any = await getPreview(slug);
  if (!data || (data as any).unauthorized) return { title: "Preview" };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
  };
}

export default async function PreviewPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data: any = await getPreview(slug);

  if (!data) notFound();

  if (data.unauthorized) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Preview requiere login</h1>
        <p>Inicia sesión en <a href="/admin/login">/admin/login</a> y vuelve a intentar.</p>
      </main>
    );
  }

  return (
    <main>
      {data.sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}