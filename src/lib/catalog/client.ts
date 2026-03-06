import type { CatalogCategory, CatalogPlan, CatalogProduct, ListProductsArgs, ListProductsResult } from "@/lib/catalog/types";
import { mockGetProductBySlug, mockListCategories, mockListProducts } from "@/lib/mock/catalogMock";

type AuthMode = "none" | "auto" | "required";

type PublishedProductSlug = { slug: string; updatedAt: string };
type WhatsAppConfig = { phone: string; defaultMessagePrefix?: string | null };

type AdminListProductsArgs = {
  search?: string;
  categoryId?: number;
  status?: string;
  page?: number;
  pageSize?: number;
};

type AdminListResult<T> = { items: T[]; total: number };

var API_BASE = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "https://api-centralizador.apiworking.pe";
var USE_MOCK = process.env.NEXT_PUBLIC_USE_CATALOG_MOCK === "1";

/**
 * Lee token en:
 * - SERVER: env CATALOG_API_TOKEN (si algún día protegen públicos y quieres SSR con token)
 * - BROWSER: localStorage awcmr_token (mismo key que usas en cmsAdmin.ts)
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return process.env.CATALOG_API_TOKEN || process.env.AW_CMS_TOKEN || null;
  }
  try {
    return localStorage.getItem("awcmr_token");
  } catch {
    return null;
  }
}

function buildHeaders(initHeaders?: HeadersInit, authMode: AuthMode = "auto"): Headers {
  var h = new Headers(initHeaders);
  if (!h.has("accept")) h.set("accept", "*/*");

  if (authMode !== "none") {
    var token = getAuthToken();
    if (authMode === "required" && !token) {
      throw new Error("No hay token. Inicia sesión para usar endpoints admin/protegidos.");
    }
    if (token) h.set("Authorization", "Bearer " + token);
  }

  return h;
}

async function fetchRaw(url: string, init?: RequestInit, authMode: AuthMode = "auto"): Promise<Response> {
  var headers = buildHeaders(init?.headers, authMode);

  return fetch(url, {
    ...init,
    headers,
  });
}

async function fetchJson<T>(url: string, init?: RequestInit, authMode: AuthMode = "auto"): Promise<T> {
  var res = await fetchRaw(url, init, authMode);

  if (!res.ok) {
    // intenta leer mensaje JSON si existe
    var text = "";
    try {
      var j = await res.json();
      text = j?.message || JSON.stringify(j);
    } catch {
      try {
        text = await res.text();
      } catch {
        text = "";
      }
    }
    throw new Error(text || ("HTTP " + res.status));
  }

  return (await res.json()) as T;
}

/* =========================
   Normalizadores (API → UI)
========================= */

function normalizeCategory(raw: any): CatalogCategory {
  return {
    id: Number(raw.id),
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? null,
    imageUrl: raw.imageUrl ?? raw.image_url ?? null,
    status: (raw.status ?? "published") as "draft" | "published",
  };
}

function safeParseFeatures(v: any): string[] | undefined {
  if (!v) return undefined;
  if (Array.isArray(v)) return v.map(String);

  if (typeof v === "string") {
    try {
      var parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // ignore
    }
  }
  return undefined;
}

function normalizePlan(raw: any): CatalogPlan {
  return {
    id: Number(raw.id),
    productId: Number(raw.productId ?? raw.product_id ?? 0),
    name: raw.name,
    price: Number(raw.price ?? 0),
    currency: raw.currency ?? "PEN",
    features: safeParseFeatures(raw.features ?? raw.features_json),
    isDefault: raw.isDefault ?? (typeof raw.is_default !== "undefined" ? Boolean(raw.is_default) : undefined),
    sortOrder: raw.sortOrder ?? raw.sort_order ?? undefined,
    status: raw.status ?? undefined,
  };
}

function normalizeProduct(raw: any): CatalogProduct {
  var categorySlug =
    raw.categorySlug ??
    raw.category_slug ??
    raw.category?.slug ??
    "";

  var category =
    raw.category && raw.category.slug
      ? { name: raw.category.name, slug: raw.category.slug }
      : undefined;

  var plans =
    Array.isArray(raw.plans) ? raw.plans.map(normalizePlan) : undefined;

  return {
    id: Number(raw.id),
    categorySlug: String(categorySlug),

    name: raw.name,
    slug: raw.slug,
    type: (raw.type ?? "physical") as "physical" | "service",
    status: (raw.status ?? "published") as "draft" | "published",

    shortDescription: raw.shortDescription ?? raw.short_description ?? null,
    description: raw.description ?? null,

    currency: raw.currency ?? "PEN",
    price: typeof raw.price === "number" ? raw.price : (raw.price != null ? Number(raw.price) : null),
    compareAtPrice:
      raw.compareAtPrice ?? raw.compare_at_price ?? null,

    mainImageUrl: raw.mainImageUrl ?? raw.main_image_url ?? null,
    ogImage: raw.ogImage ?? raw.og_image ?? null,

    metaTitle: raw.metaTitle ?? raw.meta_title ?? null,
    metaDescription: raw.metaDescription ?? raw.meta_description ?? null,

    isFeatured:
      raw.isFeatured ??
      (typeof raw.is_featured !== "undefined" ? Boolean(raw.is_featured) : undefined),

    images: Array.isArray(raw.images) ? raw.images.map(String) : undefined,
    category,
    plans,
  };
}

/* =========================
   Public (Site SSR)
========================= */

export async function listCategories(): Promise<CatalogCategory[]> {
  if (USE_MOCK) return mockListCategories();

  var raw = await fetchJson<any[]>(API_BASE + "/catalog/categories", { method: "GET" }, "auto");
  return raw.map(normalizeCategory);
}

export async function listProducts(args: ListProductsArgs): Promise<ListProductsResult> {
  if (USE_MOCK) return mockListProducts(args);

  var q = new URLSearchParams();
  if (args.categorySlug) q.set("categorySlug", args.categorySlug);
  if (args.search) q.set("search", args.search);
  if (typeof args.featured === "boolean") q.set("featured", String(args.featured));
  q.set("page", String(args.page ?? 1));
  q.set("pageSize", String(args.pageSize ?? 20));
  if (args.sort) q.set("sort", args.sort);

  var raw = await fetchJson<{ items: any[]; total: number }>(
    API_BASE + "/catalog/products?" + q.toString(),
    { method: "GET" },
    "auto"
  );

  return {
    items: (raw.items ?? []).map(normalizeProduct),
    total: Number(raw.total ?? 0),
  };
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  if (USE_MOCK) return mockGetProductBySlug(slug);

  var url = API_BASE + "/catalog/products/" + encodeURIComponent(slug);

  // devolvemos null si 404
  var res = await fetchRaw(url, { method: "GET" }, "auto");
  if (res.status === 404) return null;

  if (!res.ok) {
    var t = "";
    try {
      t = await res.text();
    } catch {
      t = "";
    }
    throw new Error(t || ("HTTP " + res.status));
  }

  var raw = (await res.json()) as any;
  return normalizeProduct(raw);
}

export async function listFeaturedProducts(limit: number = 8): Promise<CatalogProduct[]> {
  var q = new URLSearchParams();
  q.set("limit", String(limit));

  var raw = await fetchJson<any[]>(API_BASE + "/catalog/products/featured?" + q.toString(), { method: "GET" }, "auto");
  return raw.map(normalizeProduct);
}

export async function listPublishedProductSlugs(): Promise<PublishedProductSlug[]> {
  return fetchJson<PublishedProductSlug[]>(API_BASE + "/catalog/products/published/slugs", { method: "GET" }, "auto");
}

/* =========================
   Admin (Bearer requerido)
========================= */

export async function adminCatalogListProducts(args: AdminListProductsArgs): Promise<AdminListResult<CatalogProduct>> {
  var q = new URLSearchParams();
  q.set("search", args.search ?? "");
  if (typeof args.categoryId === "number") q.set("categoryId", String(args.categoryId));
  if (args.status) q.set("status", args.status);
  q.set("page", String(args.page ?? 1));
  q.set("pageSize", String(args.pageSize ?? 20));

  var raw = await fetchJson<{ items: any[]; total: number }>(
    API_BASE + "/catalog/admin/products?" + q.toString(),
    { method: "GET" },
    "required"
  );

  return { items: (raw.items ?? []).map(normalizeProduct), total: Number(raw.total ?? 0) };
}

export async function adminCatalogCreateProduct(payload: any) {
  return fetchJson<any>(
    API_BASE + "/catalog/admin/products",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "required"
  );
}

export async function adminCatalogGetProductById(id: number) {
  var raw = await fetchJson<any>(API_BASE + "/catalog/admin/products/" + id, { method: "GET" }, "required");
  return normalizeProduct(raw);
}

export async function adminCatalogUpdateProduct(id: number, payload: any) {
  return fetchJson<any>(
    API_BASE + "/catalog/admin/products/" + id,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "required"
  );
}

export async function adminCatalogDeleteProduct(id: number) {
  return fetchJson<any>(API_BASE + "/catalog/admin/products/" + id, { method: "DELETE" }, "required");
}

export async function adminCatalogListCategories(): Promise<CatalogCategory[]> {
  var raw = await fetchJson<any[]>(API_BASE + "/catalog/admin/categories", { method: "GET" }, "required");
  return raw.map(normalizeCategory);
}

export async function adminCatalogCreateCategory(payload: any) {
  return fetchJson<any>(
    API_BASE + "/catalog/admin/categories",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    "required"
  );
}

export async function adminCatalogUpdateCategory(id: number, payload: any) {
  return fetchJson<any>(
    API_BASE + "/catalog/admin/categories/" + id,
    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    "required"
  );
}

export async function adminCatalogDeleteCategory(id: number) {
  return fetchJson<any>(API_BASE + "/catalog/admin/categories/" + id, { method: "DELETE" }, "required");
}

export async function adminCatalogListPlans(productId: number): Promise<CatalogPlan[]> {
  var raw = await fetchJson<any[]>(
    API_BASE + "/catalog/admin/products/" + productId + "/plans",
    { method: "GET" },
    "required"
  );
  return raw.map(normalizePlan);
}

export async function adminCatalogCreatePlan(productId: number, payload: any) {
  return fetchJson<any>(
    API_BASE + "/catalog/admin/products/" + productId + "/plans",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    "required"
  );
}

export async function adminCatalogUpdatePlan(planId: number, payload: any) {
  return fetchJson<any>(
    API_BASE + "/catalog/admin/plans/" + planId,
    { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    "required"
  );
}

export async function adminCatalogDeletePlan(planId: number) {
  return fetchJson<any>(API_BASE + "/catalog/admin/plans/" + planId, { method: "DELETE" }, "required");
}

export async function adminGetWhatsAppConfig(): Promise<WhatsAppConfig> {
  return fetchJson<WhatsAppConfig>(API_BASE + "/catalog/config/whatsapp", { method: "GET" }, "required");
}