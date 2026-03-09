import type { MetadataRoute } from "next";
import { listPublishedProductSlugs } from "@/lib/catalog/client";

function siteUrl() {
  let url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  // ✅ Páginas estáticas (las que ya tenías)
  const pages = [
    { path: "/", changeFreq: "weekly" as const, priority: 1.0 },
    { path: "/resto", changeFreq: "weekly" as const, priority: 0.9 },
    { path: "/sistema-para-hoteles", changeFreq: "weekly" as const, priority: 0.9 },
    { path: "/contacto", changeFreq: "monthly" as const, priority: 0.7 },
    { path: "/demo", changeFreq: "monthly" as const, priority: 0.7 },
    { path: "/nosotros", changeFreq: "monthly" as const, priority: 0.6 },
    { path: "/productos", changeFreq: "weekly" as const, priority: 0.9 },
  ];

  const now = new Date();

  // ✅ Productos publicados (desde API)
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await listPublishedProductSlugs();

    productEntries = slugs.map((x) => ({
      url: `${base}/productos/${x.slug}`,
      lastModified: x.updatedAt ? new Date(x.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Si falla el API, no rompas build/sitemap.
    productEntries = [];
  }

  return [
    ...pages.map((p) => ({
      url: `${base}${p.path}`,
      lastModified: now,
      changeFrequency: p.changeFreq,
      priority: p.priority,
    })),
    ...productEntries,
  ];
}