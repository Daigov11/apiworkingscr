"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog/types";
import {
  adminCatalogCreateProduct,
  adminCatalogDeleteProduct,
  adminCatalogListCategories,
  adminCatalogListProducts,
} from "@/lib/catalog/client";

function toInt(v: string | null, def: number) {
  var n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : def;
}

function slugify(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCatalogProductsPage() {
  var router = useRouter();
  var pathname = usePathname();
  var sp = useSearchParams();

  // URL -> state
  var urlSearch = sp.get("search") ?? "";
  var urlStatus = sp.get("status") ?? "all";
  var urlCategoryId = sp.get("categoryId") ?? "all";
  var urlPage = toInt(sp.get("page"), 1);
  var urlPageSize = toInt(sp.get("pageSize"), 20);

  // Inputs (debounce)
  var [searchInput, setSearchInput] = useState(urlSearch);
  var [statusInput, setStatusInput] = useState(urlStatus);
  var [categoryInput, setCategoryInput] = useState(urlCategoryId);
  var [pageSizeInput, setPageSizeInput] = useState(urlPageSize);

  // Data
  var [cats, setCats] = useState<CatalogCategory[]>([]);
  var [items, setItems] = useState<CatalogProduct[]>([]);
  var [total, setTotal] = useState(0);
  var [loading, setLoading] = useState(false);
  var [err, setErr] = useState<string | null>(null);

  var totalPages = useMemo(() => {
    var tp = Math.ceil((total || 0) / (urlPageSize || 20));
    return tp <= 0 ? 1 : tp;
  }, [total, urlPageSize]);

  function replaceQuery(next: {
    search?: string;
    status?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
  }) {
    var q = new URLSearchParams(sp.toString());

    if (typeof next.search === "string") q.set("search", next.search);
    if (typeof next.status === "string") q.set("status", next.status);
    if (typeof next.categoryId === "string") q.set("categoryId", next.categoryId);
    if (typeof next.page === "number") q.set("page", String(next.page));
    if (typeof next.pageSize === "number") q.set("pageSize", String(next.pageSize));

    if (!q.get("search")) q.delete("search");
    if (!q.get("status")) q.set("status", "all");
    if (!q.get("categoryId")) q.set("categoryId", "all");
    if (!q.get("page")) q.set("page", "1");
    if (!q.get("pageSize")) q.set("pageSize", "20");

    router.replace(`${pathname}?${q.toString()}`);
  }

  // sync inputs si URL cambia
  useEffect(() => {
    setSearchInput(urlSearch);
    setStatusInput(urlStatus);
    setCategoryInput(urlCategoryId);
    setPageSizeInput(urlPageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlStatus, urlCategoryId, urlPageSize]);

  // Debounce search
  useEffect(() => {
    var t = setTimeout(() => {
      if (searchInput !== urlSearch) replaceQuery({ search: searchInput.trim(), page: 1 });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // status change
  useEffect(() => {
    if (statusInput !== urlStatus) replaceQuery({ status: statusInput, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusInput]);

  // category change
  useEffect(() => {
    if (categoryInput !== urlCategoryId) replaceQuery({ categoryId: categoryInput, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryInput]);

  // page size change
  useEffect(() => {
    if (pageSizeInput !== urlPageSize) replaceQuery({ pageSize: pageSizeInput, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSizeInput]);

  async function loadCategories() {
    try {
      var data = await adminCatalogListCategories();
      setCats(data || []);
    } catch (e: any) {
      // No bloquea productos, pero lo mostramos
      setErr(e.message || "Error cargando categorías");
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);
      setErr(null);

      var statusParam = urlStatus === "all" ? "" : urlStatus; // draft/published
      var catId =
        urlCategoryId === "all" ? undefined : Number(urlCategoryId);

      var res = await adminCatalogListProducts({
        search: urlSearch,
        status: statusParam,
        categoryId: typeof catId === "number" && Number.isFinite(catId) ? catId : undefined,
        page: urlPage,
        pageSize: urlPageSize,
      });

      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (e: any) {
      setErr(e.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlStatus, urlCategoryId, urlPage, urlPageSize]);

  // ===== Modal create
  var [open, setOpen] = useState(false);
  var [creating, setCreating] = useState(false);
  var [formErr, setFormErr] = useState<string | null>(null);

  var [name, setName] = useState("");
  var [slug, setSlug] = useState("");
  var [type, setType] = useState<"physical" | "service">("physical");
  var [status, setStatus] = useState<"draft" | "published">("draft");
  var [featured, setFeatured] = useState(false);
  var [categoryId, setCategoryId] = useState<number | null>(null);

  var [price, setPrice] = useState("0");
  var [currency, setCurrency] = useState("PEN");
  var [shortDescription, setShortDescription] = useState("");
  var [description, setDescription] = useState("");
  var [mainImageUrl, setMainImageUrl] = useState("");
  var [metaTitle, setMetaTitle] = useState("");
  var [metaDescription, setMetaDescription] = useState("");
  var [ogImage, setOgImage] = useState("");
  var [imagesText, setImagesText] = useState("");

  function openModal() {
    setOpen(true);
    setFormErr(null);
    setName("");
    setSlug("");
    setType("physical");
    setStatus("draft");
    setFeatured(false);
    setCategoryId(cats?.[0]?.id ?? null);
    setPrice("0");
    setCurrency("PEN");
    setShortDescription("");
    setDescription("");
    setMainImageUrl("");
    setMetaTitle("");
    setMetaDescription("");
    setOgImage("");
    setImagesText("");
  }

  function closeModal() {
    setOpen(false);
    setFormErr(null);
  }

  async function onCreate() {
    try {
      setCreating(true);
      setFormErr(null);

      var n = name.trim();
      if (!n) throw new Error("Nombre es obligatorio");

      var s = slugify(slug || n);
      if (!s) throw new Error("Slug es obligatorio");

      var cat = categoryId ?? cats?.[0]?.id ?? null;
      if (!cat) throw new Error("Selecciona categoría");

      var images = imagesText
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);

      var payload = {
        name: n,
        slug: s,
        type: type,
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        price: Number(price || 0),
        currency: currency.trim() || "PEN",
        mainImageUrl: mainImageUrl.trim(),
        metaTitle: (metaTitle.trim() || n) + "",
        metaDescription: metaDescription.trim(),
        ogImage: ogImage.trim(),
        status: status, // "draft" | "published"
        featured: !!featured,
        categoryId: Number(cat),
        images: images.length ? images : [],
      };

var created = await adminCatalogCreateProduct(payload);

// intenta sacar el id de varias formas (según cómo responda el API)
var newId =
  created?.id ??
  created?.product?.id ??
  created?.data?.id ??
  created?.result?.id ??
  null;

closeModal();

// ✅ si el API devuelve id, te vas directo al edit
if (newId) {
  router.push(`/admin/catalog/products/${newId}`);
  return;
}

// ✅ fallback: buscar por slug recién creado y abrir el primero
try {
  var find = await adminCatalogListProducts({
    search: s,      // s = slug final (el que ya calculaste arriba)
    page: 1,
    pageSize: 1,
  });

  var first = find?.items?.[0];
  if (first?.id) {
    router.push(`/admin/catalog/products/${first.id}`);
    return;
  }
} catch {}

// último fallback: solo recargar lista
await loadProducts();
replaceQuery({ page: 1 });
    } catch (e: any) {
      setFormErr(e.message || "Error creando producto");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: number) {
    var ok = confirm(`¿Seguro que deseas eliminar el producto #${id}?`);
    if (!ok) return;

    try {
      setErr(null);
      await adminCatalogDeleteProduct(id);
      await loadProducts();
    } catch (e: any) {
      setErr(e.message || "Error eliminando producto");
    }
  }

  function goPrev() {
    if (urlPage <= 1) return;
    replaceQuery({ page: urlPage - 1 });
  }

  function goNext() {
    if (urlPage >= totalPages) return;
    replaceQuery({ page: urlPage + 1 });
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Catálogo · Productos</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Total: {total} · Página {urlPage} / {totalPages}
          </p>
        </div>

        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
          onClick={openModal}
          type="button"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Filters */}
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="text-xs text-slate-500">Buscar</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="nombre o slug"
          />
          <div className="mt-2 text-xs text-slate-400">Se aplica en ~0.4s</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="text-xs text-slate-500">Estado</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="text-xs text-slate-500">Categoría</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          >
            <option value="all">Todas</option>
            {cats.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name} (#{c.id})
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <label className="text-xs text-slate-500">Page size</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={String(pageSizeInput)}
            onChange={(e) => setPageSizeInput(Number(e.target.value))}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <div className="mt-3 flex items-center justify-between">
            <button
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
              onClick={goPrev}
              disabled={loading || urlPage <= 1}
              type="button"
            >
              ← Prev
            </button>

            <button
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
              onClick={goNext}
              disabled={loading || urlPage >= totalPages}
              type="button"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      ) : null}

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Featured</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr className="border-t border-slate-200">
                <td colSpan={7} className="p-4 text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : null}

            {!loading && !items.length ? (
              <tr className="border-t border-slate-200">
                <td colSpan={7} className="p-4 text-slate-500">
                  Sin resultados.
                </td>
              </tr>
            ) : null}

            {!loading &&
              items.map((p) => (
                <tr key={p.id} className="border-t border-slate-200">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                  <td className="p-3 text-slate-600">{p.slug}</td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3">
                    <span
                      className={[
                        "rounded-full px-2 py-1 text-xs",
                        p.status === "published"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-800 border border-yellow-200",
                      ].join(" ")}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">{p.isFeatured ? "✅" : "—"}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
                        href={`/admin/catalog/products/${p.id}`}
                      >
                        Editar
                      </Link>
                      <button
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                        onClick={() => onDelete(p.id)}
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Nuevo producto</div>
                <div className="mt-1 text-xs text-slate-500">
                  status recomendado: <b>draft</b> hasta que verifiques.
                </div>
              </div>
              <button
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                onClick={closeModal}
                type="button"
              >
                ✕
              </button>
            </div>

            {formErr ? (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formErr}
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">Nombre</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={name}
                  onChange={(e) => {
                    var v = e.target.value;
                    setName(v);
                    if (!slug.trim()) setSlug(slugify(v));
                  }}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Slug</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Tipo</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="physical">physical</option>
                  <option value="service">service (sistema)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500">Categoría</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={String(categoryId ?? "")}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                >
                  {cats.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name} (#{c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500">Estado</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className="text-sm">Featured</span>
              </div>

              <div>
                <label className="text-xs text-slate-500">Precio</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Moneda</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <label className="text-xs text-slate-500">Short Description</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Description</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-500">Main Image URL</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={mainImageUrl}
                    onChange={(e) => setMainImageUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">OG Image URL</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-500">Meta Title</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Meta Description</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500">Images (1 por línea)</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs"
                  rows={3}
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  placeholder="https://...\nhttps://..."
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={closeModal}
                type="button"
                disabled={creating}
              >
                Cancelar
              </button>

              <button
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-50"
                onClick={onCreate}
                type="button"
                disabled={creating}
              >
                {creating ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}