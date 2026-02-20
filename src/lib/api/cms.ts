import { cache } from "react";
import type { PagePayload } from "@/lib/types/cms";

export const getPageBySlug = cache(async (slug: string): Promise<PagePayload | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en .env.local");

  const res = await fetch(`${baseUrl}/pages/${encodeURIComponent(slug)}`, {
    cache: "no-store", // SSR fresco
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error API pages/:slug -> ${res.status}`);

  return res.json();
});