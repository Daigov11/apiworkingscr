import type { MetadataRoute } from "next";

function siteUrl() {
  let url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "preview"], // ✅ no indexar panel ni endpoints
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}