import { cache } from "react";
import type { PagePayload } from "@/lib/builder/types";

type ApiResponse<T> = {
  codResponse: string;
  message: string;
  data: T;
};

type DataPageResponse = {
  page: {
    id: number;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    status: string;
    updatedAt: string;
  };
  sections: any[];
};

function baseUrl() {
  let url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en .env.local");
  return url.replace(/\/+$/, "");
}

function parseMaybeJson(v: any) {
  if (v == null) return {};
  if (typeof v === "object") return v;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return {};
    try {
      return JSON.parse(s);
    } catch {
      return {};
    }
  }
  return {};
}

function mapSections(raw: any[]) {
  const list = Array.isArray(raw) ? raw : [];

  // orden (soporta sortOrder, sort_order, order)
  const sorted = list.slice().sort((a, b) => {
    const oa = Number(a?.sortOrder ?? a?.sort_order ?? a?.order ?? 0);
    const ob = Number(b?.sortOrder ?? b?.sort_order ?? b?.order ?? 0);
    return oa - ob;
  });

  return sorted.map((s, idx) => {
    const id =
      String(
        s?.id ??
          s?.sectionKey ??
          s?.section_key ??
          s?.section_key ??
          `sec_${idx + 1}`
      );

    const type = String(s?.type ?? "");

    // data puede venir como objeto o como string (dataJson / data_json)
    const data =
      s?.data != null
        ? parseMaybeJson(s.data)
        : parseMaybeJson(s?.dataJson ?? s?.data_json ?? s?.dataJSON);

    return { id, type, data };
  });
}

export const getPageBySlug = cache(async (slug: string): Promise<PagePayload | null> => {
  const url = `${baseUrl()}/Data/page?slug=${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: { accept: "*/*" },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as ApiResponse<DataPageResponse>;

  if (json.codResponse !== "1") return null;

  const page = json.data?.page;
  if (!page) return null;

  // Solo published para web pública
  if ((page.status || "").toLowerCase() !== "published") return null;

  return {
    slug: page.slug,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ogImage: page.ogImage || undefined,
    sections: mapSections(json.data?.sections || []),
  };
});