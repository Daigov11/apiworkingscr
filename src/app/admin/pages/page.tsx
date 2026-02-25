"use client";

import { useEffect, useState } from "react";
import {
  adminListPages,
  adminCreatePage,
  AdminPageListItem,
} from "@/lib/api/cmsAdmin";

export default function AdminPages() {
  const [items, setItems] = useState<AdminPageListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  // modal state
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // form state
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [formErr, setFormErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const data = await adminListPages({ page: 1, pageSize: 20 });
      setItems(data.items);
      setTotal(data.total);
    } catch (e: any) {
      setErr(e.message || "Error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setSlug("");
    setMetaTitle("");
    setMetaDescription("");
    setOgImage("");
    setStatus("draft");
    setFormErr(null);
  }

  function openModal() {
    resetForm();
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }

  async function onCreate() {
    try {
      setCreating(true);
      setFormErr(null);

      const s = slugify(slug);
      if (!s) throw new Error("Slug es obligatorio");
      if (!metaTitle.trim()) throw new Error("Meta Title es obligatorio");
      if (!metaDescription.trim()) throw new Error("Meta Description es obligatorio");

      const payload = {
        slug: s,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        ogImage: ogImage.trim() ? ogImage.trim() : "",
        status,
        sections: [], // empieza vacío, luego lo editas en /admin/pages/{id}
      };

      const created = await adminCreatePage(payload);

      closeModal();
      await load();

      // ir al editor
      window.location.href = `/admin/pages/${created.id}`;
    } catch (e: any) {
      setFormErr(e.message || "Error creando");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Páginas</h1>
          <p className="mt-2 text-sm text-neutral-300">Total: {total}</p>
        </div>

        <button
          className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-black"
          onClick={openModal}
        >
          + Nueva página
        </button>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-red-200">
          {err}
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/40 text-neutral-300">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-neutral-800">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.slug}</td>
                <td className="p-3">{p.metaTitle}</td>
                <td className="p-3">{p.status || "draft"}</td>
                <td className="p-3 text-right">
                  <a
                    className="rounded-xl border border-neutral-800 px-3 py-2 hover:bg-neutral-900/40"
                    href={`/admin/pages/${p.id}`}
                  >
                    Editar
                  </a>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td className="p-4 text-neutral-400" colSpan={5}>
                  No hay páginas aún.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/70"
            aria-label="Cerrar"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">Nueva página</div>
              <button
                className="rounded-lg border border-neutral-800 px-3 py-1 text-sm text-neutral-300 hover:text-white"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>

            {formErr ? (
              <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-200">
                {formErr}
              </div>
            ) : null}

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-neutral-400">Slug</label>
                <input
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ej: sistema-de-restaurantes"
                />
                <div className="mt-1 text-xs text-neutral-500">
                  Se convertirá a: <span className="text-neutral-300">{slugify(slug) || "—"}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400">Meta Title</label>
                <input
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Ej: Sistema de Restaurantes | ApiWorking"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400">Meta Description</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Descripción para Google..."
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400">OG Image (opcional)</label>
                <input
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400">Status</label>
                <select
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  className="w-full rounded-xl border border-neutral-800 px-4 py-3 text-sm font-extrabold text-neutral-200 hover:bg-neutral-900/40"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black disabled:opacity-50"
                  onClick={onCreate}
                  disabled={creating}
                >
                  {creating ? "Creando..." : "Crear"}
                </button>
              </div>

              <div className="text-xs text-neutral-500">
                Nota: se crea sin secciones. Luego agregas módulos en el editor.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}