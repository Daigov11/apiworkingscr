import type { MetadataRoute } from "next";

function siteUrl() {
  let url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  // ✅ Mock slugs (luego esto vendrá desde tu API CMS)
  const pages = [
    { path: "/", changeFreq: "weekly", priority: 1.0 },
    { path: "/sistema-de-restaurantes", changeFreq: "weekly", priority: 0.9 },
    { path: "/sistema-para-hoteles", changeFreq: "weekly", priority: 0.9 },
    { path: "/contacto", changeFreq: "monthly", priority: 0.7 },
    { path: "/demo", changeFreq: "monthly", priority: 0.7 },
    { path: "/nosotros", changeFreq: "monthly", priority: 0.6 },
  ] as const;

  const now = new Date();

  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));
}