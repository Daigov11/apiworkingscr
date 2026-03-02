import type { Metadata } from "next";
import SectionRenderer from "@/components/SectionRenderer";
import { getPageBySlug } from "@/lib/api/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("home");
  if (!page) return { title: "ApiWorking" };

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const page = await getPageBySlug("home");

  if (!page) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Home no encontrada</h1>
      </main>
    );
  }

  return (
    <main>
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}