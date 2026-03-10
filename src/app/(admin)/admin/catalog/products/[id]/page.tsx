"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CatalogCategory, CatalogPlan, CatalogProduct } from "@/lib/catalog/types";
import {
  adminCatalogDeletePlan,
  adminCatalogDeleteProduct,
  adminCatalogGetProductById,
  adminCatalogListCategories,
  adminCatalogListPlans,
  adminCatalogCreatePlan,
  adminCatalogUpdatePlan,
  adminCatalogUpdateProduct,
} from "@/lib/catalog/client";

function toId(v: string) {
  var n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

// ✅ NUEVO: ordenar planes
function sortPlans(list: CatalogPlan[]) {
  return (list || []).slice().sort((a, b) => {
    var ao = Number(a.sortOrder ?? 0);
    var bo = Number(b.sortOrder ?? 0);
    if (ao !== bo) return ao - bo;
    return Number(a.id) - Number(b.id);
  });
}

export default function AdminCatalogProductEdit({ params }: { params: { id: string } }) {
  var router = useRouter();
  var id = toId(params.id);

  var [loading, setLoading] = useState(true);
  var [saving, setSaving] = useState(false);
  var [err, setErr] = useState<string | null>(null);

  var [cats, setCats] = useState<CatalogCategory[]>([]);
  var [product, setProduct] = useState<CatalogProduct | null>(null);

  // Form fields
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

  // Plans
  var [plans, setPlans] = useState<CatalogPlan[]>([]);
  var [plansLoading, setPlansLoading] = useState(false);
  var [plansErr, setPlansErr] = useState<string | null>(null);

  // Plan modal
  var [planOpen, setPlanOpen] = useState(false);
  var [planSaving, setPlanSaving] = useState(false);
  var [planEditId, setPlanEditId] = useState<number | null>(null);

  var [planName, setPlanName] = useState("");
  var [planPrice, setPlanPrice] = useState("0");
  var [planCurrency, setPlanCurrency] = useState("PEN");
  var [planIsDefault, setPlanIsDefault] = useState(false);
  var [planSortOrder, setPlanSortOrder] = useState("0");
  var [planFeaturesText, setPlanFeaturesText] = useState("");

  var isService = useMemo(() => type === "service", [type]);

  async function loadCategories() {
    try {
      var data = await adminCatalogListCategories();
      setCats(data || []);
    } catch (e: any) {
      setErr(e.message || "Error cargando categorías");
    }
  }

  async function loadProduct() {
    try {
      setLoading(true);
      setErr(null);

      var p = await adminCatalogGetProductById(id);
      setProduct(p);

      setName(p.name || "");
      setSlug(p.slug || "");
      setType(p.type || "physical");
      setStatus(p.status || "draft");
      setFeatured(!!p.isFeatured);

      setCurrency(p.currency || "PEN");
      setPrice(String(p.price ?? 0));
      setShortDescription(p.shortDescription || "");
      setDescription(p.description || "");
      setMainImageUrl(p.mainImageUrl || "");
      setMetaTitle(p.metaTitle || "");
      setMetaDescription(p.metaDescription || "");
      setOgImage(p.ogImage || "");
      setImagesText((p.images || []).join("\n"));
    } catch (e: any) {
      setErr(e.message || "Error cargando producto");
    } finally {
      setLoading(false);
    }
  }

  async function loadPlans() {
    if (!id) return;
    try {
      setPlansLoading(true);
      setPlansErr(null);
      var list = await adminCatalogListPlans(id);
      setPlans(sortPlans(list || [])); // ✅ ordenado
    } catch (e: any) {
      setPlansErr(e.message || "Error cargando planes");
    } finally {
      setPlansLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // cuando ya tengo categorías + product.categorySlug, intento setear categoryId
  useEffect(() => {
    if (!product || !cats.length) return;
    const p = product;
    var match = cats.find((c) => c.slug === p.categorySlug);
    if (match) setCategoryId(match.id);
    else setCategoryId(cats[0]?.id ?? null);
  }, [product, cats]);

  // cargar planes al entrar (si es service)
  useEffect(() => {
    if (isService) loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isService, id]);

  async function onSave() {
    try {
      setSaving(true);
      setErr(null);

      if (!name.trim()) throw new Error("Nombre es obligatorio");
      if (!slug.trim()) throw new Error("Slug es obligatorio");
      if (!categoryId) throw new Error("Selecciona categoría");

      var images = imagesText
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);

      var payload = {
        name: name.trim(),
        slug: slug.trim(),
        type: type,
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        price: Number(price || 0),
        currency: currency.trim() || "PEN",
        mainImageUrl: mainImageUrl.trim(),
        metaTitle: metaTitle.trim() || name.trim(),
        metaDescription: metaDescription.trim(),
        ogImage: ogImage.trim(),
        status: status,
        featured: !!featured,
        categoryId: Number(categoryId),
        images: images.length ? images : [],
      };

      await adminCatalogUpdateProduct(id, payload);
      await loadProduct();
      alert("Guardado ✅");
    } catch (e: any) {
      setErr(e.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    var ok = confirm("¿Seguro que deseas eliminar este producto?");
    if (!ok) return;

    try {
      setErr(null);
      await adminCatalogDeleteProduct(id);
      router.push("/admin/catalog/products");
      router.refresh();
    } catch (e: any) {
      setErr(e.message || "Error eliminando");
    }
  }

  function openPlanCreate() {
    setPlanOpen(true);
    setPlanEditId(null);
    setPlanName("");
    setPlanPrice("0");
    setPlanCurrency("PEN");
    setPlanIsDefault(false);
    setPlanSortOrder("0");
    setPlanFeaturesText("");
  }

  function openPlanEdit(p: CatalogPlan) {
    setPlanOpen(true);
    setPlanEditId(p.id);
    setPlanName(p.name || "");
    setPlanPrice(String(p.price ?? 0));
    setPlanCurrency(p.currency || "PEN");
    setPlanIsDefault(!!p.isDefault);
    setPlanSortOrder(String(p.sortOrder ?? 0));
    setPlanFeaturesText((p.features || []).join("\n"));
  }

  function closePlanModal() {
    setPlanOpen(false);
  }

  // ✅ NUEVO: apagar otros defaults si este queda default
  async function enforceSingleDefault(targetId: number) {
    try {
      var list = await adminCatalogListPlans(id);
      var sorted = sortPlans(list || []);

      for (var i = 0; i < sorted.length; i++) {
        var p = sorted[i];
        if (p.id !== targetId && p.isDefault) {
          await adminCatalogUpdatePlan(p.id, {
            name: p.name,
            price: Number(p.price || 0),
            currency: p.currency || "PEN",
            features: p.features || [],
            isDefault: false,
            sortOrder: Number(p.sortOrder || 0),
          });
        }
      }

      // refrescar
      var list2 = await adminCatalogListPlans(id);
      setPlans(sortPlans(list2 || []));
    } catch (e: any) {
      // no bloqueamos el guardado, pero avisamos
      setPlansErr(e.message || "No se pudo asegurar único default");
    }
  }

  async function savePlan() {
    try {
      setPlanSaving(true);
      setPlansErr(null);

      if (!planName.trim()) throw new Error("Nombre del plan es obligatorio");

      var features = planFeaturesText
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);

      var payload = {
        name: planName.trim(),
        price: Number(planPrice || 0),
        currency: planCurrency.trim() || "PEN",
        features: features,
        isDefault: !!planIsDefault,
        sortOrder: Number(planSortOrder || 0),
      };

      // 1) Guardar
      if (planEditId) {
        await adminCatalogUpdatePlan(planEditId, payload);
      } else {
        await adminCatalogCreatePlan(id, payload);
      }

      // 2) Refrescar lista ordenada
      var refreshed = await adminCatalogListPlans(id);
      var sorted = sortPlans(refreshed || []);
      setPlans(sorted);

      // 3) Si es default, apagar otros defaults
      if (payload.isDefault) {
        var targetId = planEditId;

        // si fue creación, intentamos identificar el plan recién creado
        if (!targetId) {
          var candidates = sorted.filter((p) => {
            return (
              String(p.name || "").trim() === payload.name &&
              Number(p.price || 0) === Number(payload.price || 0) &&
              String(p.currency || "PEN") === payload.currency
            );
          });

          candidates.sort((a, b) => Number(b.id) - Number(a.id));
          targetId = candidates[0]?.id ?? null;
        }

        if (targetId) {
          await enforceSingleDefault(targetId);
        }
      }

      closePlanModal();
    } catch (e: any) {
      setPlansErr(e.message || "Error guardando plan");
    } finally {
      setPlanSaving(false);
    }
  }

  async function deletePlan(planId: number) {
    var ok = confirm("¿Eliminar este plan?");
    if (!ok) return;

    try {
      setPlansErr(null);
      await adminCatalogDeletePlan(planId);
      await loadPlans(); // ya ordena
    } catch (e: any) {
      setPlansErr(e.message || "Error eliminando plan");
    }
  }

  if (loading) return <div className="text-slate-500">Cargando...</div>;

  if (!product) {
    return (
      <div>
        <div className="text-lg font-extrabold">Producto no encontrado</div>
        {err ? <div className="mt-3 text-red-700">{err}</div> : null}
        <Link className="mt-4 inline-block underline" href="/admin/catalog/products">
          ← Volver
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Editar producto #{id}</h1>
          <p className="mt-1 text-sm text-slate-500">{product.name}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            href="/admin/catalog/products"
          >
            ← Volver
          </Link>

          <button
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
            onClick={onDelete}
            type="button"
          >
            Eliminar
          </button>

          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-50"
            onClick={onSave}
            disabled={saving}
            type="button"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      ) : null}

      {/* Form */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-extrabold">Datos</div>

          <label className="mt-4 block text-xs text-slate-500">Nombre</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="mt-4 block text-xs text-slate-500">Slug</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-500">Tipo</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="physical">physical</option>
                <option value="service">service</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500">Estado</label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>
          </div>

          <label className="mt-4 block text-xs text-slate-500">Categoría</label>
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

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span className="text-sm">Featured</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-500">Precio</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500">Moneda</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-extrabold">SEO + Media</div>

          <label className="mt-4 block text-xs text-slate-500">Short Description</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />

          <label className="mt-4 block text-xs text-slate-500">Description</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="mt-4 block text-xs text-slate-500">Main Image URL</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={mainImageUrl}
            onChange={(e) => setMainImageUrl(e.target.value)}
          />

          <label className="mt-4 block text-xs text-slate-500">OG Image URL</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
          />

          <label className="mt-4 block text-xs text-slate-500">Meta Title</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />

          <label className="mt-4 block text-xs text-slate-500">Meta Description</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />

          <label className="mt-4 block text-xs text-slate-500">Images (1 por línea)</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs"
            rows={3}
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
          />
        </div>
      </div>

      {/* Plans */}
      <div id="planes" className="mt-8 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-extrabold">Planes</div>
            <div className="mt-1 text-xs text-slate-500">
              Solo aplica para productos tipo <b>service</b>.
            </div>
          </div>

          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-50"
            onClick={openPlanCreate}
            type="button"
            disabled={!isService}
            title={!isService ? "Cambia el tipo a service y guarda" : ""}
          >
            + Nuevo plan
          </button>
        </div>

        {!isService ? (
          <div className="mt-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Este producto no es <b>service</b>. Cambia el tipo a <b>service</b>, guarda, y recién podrás administrar planes.
          </div>
        ) : null}

        {plansErr ? (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {plansErr}
          </div>
        ) : null}

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Precio</th>
                <th className="p-3 text-left">Default</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {plansLoading ? (
                <tr className="border-t border-slate-200">
                  <td colSpan={5} className="p-4 text-slate-500">
                    Cargando...
                  </td>
                </tr>
              ) : null}

              {!plansLoading && !plans.length ? (
                <tr className="border-t border-slate-200">
                  <td colSpan={5} className="p-4 text-slate-500">
                    Sin planes todavía.
                  </td>
                </tr>
              ) : null}

              {!plansLoading &&
                plans.map((pl) => (
                  <tr key={pl.id} className="border-t border-slate-200">
                    <td className="p-3">{pl.id}</td>
                    <td className="p-3 font-semibold">{pl.name}</td>
                    <td className="p-3">
                      {pl.currency} {Number(pl.price || 0).toFixed(2)}
                    </td>
                    <td className="p-3">{pl.isDefault ? "✅" : "—"}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
                          type="button"
                          onClick={() => openPlanEdit(pl)}
                        >
                          Editar
                        </button>
                        <button
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                          type="button"
                          onClick={() => deletePlan(pl.id)}
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

        {/* Plan modal */}
        {planOpen ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold">
                    {planEditId ? `Editar plan #${planEditId}` : "Nuevo plan"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">features: 1 por línea</div>
                </div>
                <button
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                  onClick={closePlanModal}
                  type="button"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-500">Nombre</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Moneda</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={planCurrency}
                    onChange={(e) => setPlanCurrency(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Precio</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Sort order</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={planSortOrder}
                    onChange={(e) => setPlanSortOrder(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={planIsDefault}
                  onChange={(e) => setPlanIsDefault(e.target.checked)}
                />
                <span className="text-sm">Is Default</span>
              </div>

              <div className="mt-3">
                <label className="text-xs text-slate-500">Features</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs"
                  rows={5}
                  value={planFeaturesText}
                  onChange={(e) => setPlanFeaturesText(e.target.value)}
                />
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={closePlanModal}
                  type="button"
                  disabled={planSaving}
                >
                  Cancelar
                </button>

                <button
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-50"
                  onClick={savePlan}
                  type="button"
                  disabled={planSaving}
                >
                  {planSaving ? "Guardando..." : "Guardar plan"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}