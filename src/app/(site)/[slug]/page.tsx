import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SectionRenderer from "@/components/SectionRenderer";
import { getPageBySlug } from "@/lib/api/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params; // ✅ FIX
  const page = await getPageBySlug(slug);
  if (!page) return { title: "No encontrado" };

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${page.slug}`,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: page.ogImage ? "summary_large_image" : "summary",
      title: page.metaTitle,
      description: page.metaDescription,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}

export default async function SlugPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // ✅ FIX
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <main>
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}