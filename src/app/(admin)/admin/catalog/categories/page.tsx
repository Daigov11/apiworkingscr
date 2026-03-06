"use client";

import { useEffect, useState } from "react";
import type { CatalogCategory } from "@/lib/catalog/types";
import {
  adminCatalogCreateCategory,
  adminCatalogDeleteCategory,
  adminCatalogListCategories,
  adminCatalogUpdateCategory,
} from "@/lib/catalog/client";

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

export default function AdminCatalogCategoriesPage() {
  var [items, setItems] = useState<CatalogCategory[]>([]);
  var [loading, setLoading] = useState(false);
  var [err, setErr] = useState<string | null>(null);

  var [open, setOpen] = useState(false);
  var [saving, setSaving] = useState(false);
  var [formErr, setFormErr] = useState<string | null>(null);

  var [editId, setEditId] = useState<number | null>(null);
  var [name, setName] = useState("");
  var [slug, setSlug] = useState("");
  var [imageUrl, setImageUrl] = useState("");
  var [status, setStatus] = useState<"draft" | "published">("published");

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      var data = await adminCatalogListCategories();
      setItems(data || []);
    } catch (e: any) {
      setErr(e.message || "Error cargando categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setOpen(true);
    setFormErr(null);
    setEditId(null);
    setName("");
    setSlug("");
    setImageUrl("");
    setStatus("published");
  }

  function openEdit(c: CatalogCategory) {
    setOpen(true);
    setFormErr(null);
    setEditId(c.id);
    setName(c.name || "");
    setSlug(c.slug || "");
    setImageUrl(c.imageUrl || "");
    setStatus(c.status || "published");
  }

  function closeModal() {
    setOpen(false);
  }

  async function save() {
    try {
      setSaving(true);
      setFormErr(null);

      var n = name.trim();
      if (!n) throw new Error("Nombre es obligatorio");
      var s = slugify(slug || n);
      if (!s) throw new Error("Slug es obligatorio");

      var payload = {
        name: n,
        slug: s,
        imageUrl: imageUrl.trim(),
        status: status,
        sortOrder: 0,
      };

      if (editId) await adminCatalogUpdateCategory(editId, payload);
      else await adminCatalogCreateCategory(payload);

      closeModal();
      await load();
    } catch (e: any) {
      setFormErr(e.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: number) {
    var ok = confirm(`¿Eliminar categoría #${id}?`);
    if (!ok) return;

    try {
      setErr(null);
      await adminCatalogDeleteCategory(id);
      await load();
    } catch (e: any) {
      setErr(e.message || "Error eliminando");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Catálogo · Categorías</h1>
          <p className="mt-2 text-sm text-slate-500">Total: {items.length}</p>
        </div>

        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
          onClick={openCreate}
          type="button"
        >
          + Nueva categoría
        </button>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-t border-slate-200">
                <td colSpan={5} className="p-4 text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : null}

            {!loading &&
              items.map((c) => (
                <tr key={c.id} className="border-t border-slate-200">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3 font-semibold">{c.name}</td>
                  <td className="p-3 text-slate-600">{c.slug}</td>
                  <td className="p-3">{c.status}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
                        onClick={() => openEdit(c)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                        onClick={() => del(c.id)}
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

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="text-lg font-extrabold">
                {editId ? `Editar categoría #${editId}` : "Nueva categoría"}
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

            <div className="mt-4 grid gap-3">
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
                <label className="text-xs text-slate-500">Image URL (opcional)</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Status</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={closeModal}
                disabled={saving}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-50"
                onClick={save}
                disabled={saving}
                type="button"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}