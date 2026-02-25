import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type ApiResponse<T> = { codResponse: string; message: string; data: T };

function remoteBase() {
  const base = (process.env.CMS_REMOTE_BASE_URL || "").replace(/\/+$/, "");
  if (!base) throw new Error("Falta CMS_REMOTE_BASE_URL en .env.local");
  return base;
}

async function remoteFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${remoteBase()}${path}`, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  if (json.codResponse !== "1") throw new Error(json.message || "Error API");
  return json.data;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = (url.searchParams.get("slug") || "").trim();

  if (!slug) {
    return NextResponse.json({ ok: false, message: "Falta slug" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("awcmr_token")?.value;

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "No hay sesión (token). Inicia sesión en /admin/login." },
      { status: 401 }
    );
  }

  const list = await remoteFetch<{ items: Array<{ id: number; slug: string }>; total: number }>(
    `/cms/admin/pages?search=${encodeURIComponent(slug)}&status=&page=1&pageSize=50`,
    token
  );

  const hit = (list.items || []).find((p) => p.slug === slug);
  if (!hit) {
    return NextResponse.json({ ok: false, message: `No existe página con slug '${slug}'` }, { status: 404 });
  }

  const details = await remoteFetch<{
    page: {
      id: number;
      slug: string;
      metaTitle: string;
      metaDescription: string;
      ogImage: string | null;
      status: string;
      updatedAt: string;
    };
    sections: Array<{ sectionKey: string; type: string; sortOrder: number; dataJson: string }>;
  }>(`/cms/admin/pages/${hit.id}`, token);

  const sections = (details.sections || [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => {
      let parsed: any = {};
      try {
        parsed = s.dataJson ? JSON.parse(s.dataJson) : {};
      } catch {
        parsed = {};
      }
      return { id: s.sectionKey, type: s.type, data: parsed };
    });

  return NextResponse.json({
    slug: details.page.slug,
    metaTitle: details.page.metaTitle,
    metaDescription: details.page.metaDescription,
    ogImage: details.page.ogImage ?? undefined,
    status: details.page.status,
    updatedAt: details.page.updatedAt,
    sections,
  });
}