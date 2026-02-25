"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  adminDeletePage,
  adminGetPage,
  adminUpdatePage,
} from "@/lib/api/cmsAdmin";

type UiSection = {
  sectionKey: string;
  type: string;
  sortOrder: number;
  dataJson: string;
};

export default function AdminPageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // page meta
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [status, setStatus] = useState("draft");

  // sections
  const [sections, setSections] = useState<UiSection[]>([]);

  const sectionTypes = useMemo(
    () => [
      "hero",
      "text",
      "imageText",
      "videoText",
      "features",
      "stats",
      "logos",
      "faq",
      "testimonials",
      "pricing",
      "carousel",
      "divider",
      "spacer",
      "cta",
    ],
    []
  );

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setErr("ID inválido.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const data = await adminGetPage(id);

        setSlug(data.page.slug || "");
        setMetaTitle(data.page.metaTitle || "");
        setMetaDescription(data.page.metaDescription || "");
        setOgImage(data.page.ogImage || "");
        setStatus(data.page.status || "draft");

        const sorted = [...(data.sections || [])].sort(
          (a, b) => a.sortOrder - b.sortOrder
        );
        setSections(sorted);
      } catch (e: any) {
        setErr(e.message || "Error cargando página");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;

    const next = [...sections];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;

    // reindex sortOrder
    const re = next.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    setSections(re);
  }

  function addSection(type: string) {
    const newKey = `sec_${Date.now()}`;
    const next = [
      ...sections,
      {
        sectionKey: newKey,
        type,
        sortOrder: sections.length + 1,
        dataJson: "{}",
      },
    ];
    setSections(next);
  }

  function removeSection(idx: number) {
    const next = sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sortOrder: i + 1 }));
    setSections(next);
  }

  function updateSection(idx: number, patch: Partial<UiSection>) {
    const next = [...sections];
    next[idx] = { ...next[idx], ...patch };
    setSections(next);
  }

  function isValidJson(s: string) {
    try {
      JSON.parse(s || "{}");
      return true;
    } catch {
      return false;
    }
  }

  async function onSave() {
    try {
      setSaving(true);
      setErr(null);

      // valida JSON de todas las secciones antes de mandar
      for (let i = 0; i < sections.length; i++) {
        if (!isValidJson(sections[i].dataJson)) {
          throw new Error(`JSON inválido en sección #${i + 1} (${sections[i].sectionKey})`);
        }
      }

      await adminUpdatePage(id, {
        slug,
        metaTitle,
        metaDescription,
        ogImage,
        status,
        sections,
      });

      alert("Guardado OK");
      router.refresh();
    } catch (e: any) {
      setErr(e.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const ok = confirm("¿Seguro que deseas eliminar esta página?");
    if (!ok) return;

    try {
      setErr(null);
      await adminDeletePage(id);
      alert("Eliminada");
      router.replace("/admin/pages");
    } catch (e: any) {
      setErr(e.message || "Error eliminando");
    }
  }

  if (loading) return <div className="text-neutral-300">Cargando…</div>;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Editar página (ID: {id})</h1>
          <p className="mt-2 text-sm text-neutral-300">
            Edita meta y secciones. Guarda con PUT.
          </p>
        </div>

        <div className="flex gap-2">
          <a
            className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40"
            href="/admin/pages"
          >
            Volver
          </a>
          <button
            className="rounded-xl border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-200 hover:bg-red-950/30"
            onClick={onDelete}
          >
            Eliminar
          </button>
          <button
            className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-black disabled:opacity-50"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      {/* Meta */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-5">
          <div className="text-sm font-extrabold text-neutral-200">Meta</div>

          <label className="mt-4 block text-xs text-neutral-400">Slug</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <label className="mt-4 block text-xs text-neutral-400">Meta Title</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />

          <label className="mt-4 block text-xs text-neutral-400">Meta Description</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            rows={4}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />

          <label className="mt-4 block text-xs text-neutral-400">OG Image (url)</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
          />

          <label className="mt-4 block text-xs text-neutral-400">Status</label>
          <select
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>

        {/* Add section */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-5">
          <div className="text-sm font-extrabold text-neutral-200">Agregar sección</div>
          <p className="mt-2 text-sm text-neutral-300">
            Se agrega al final. Luego puedes reordenar.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {sectionTypes.map((t) => (
              <button
                key={t}
                className="rounded-xl border border-neutral-800 px-3 py-2 text-left text-sm hover:bg-neutral-900/40"
                onClick={() => addSection(t)}
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-950/30 p-5">
        <div className="text-sm font-extrabold text-neutral-200">Secciones</div>

        <div className="mt-4 space-y-4">
          {sections.map((s, idx) => {
            const okJson = isValidJson(s.dataJson);

            return (
              <div key={s.sectionKey} className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-extrabold">
                    #{idx + 1} — {s.sectionKey}{" "}
                    <span className={`ml-2 rounded-full px-2 py-1 text-xs ${okJson ? "bg-green-900/40 text-green-200" : "bg-red-900/40 text-red-200"}`}>
                      {okJson ? "JSON OK" : "JSON inválido"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => move(idx, -1)}>
                      ↑
                    </button>
                    <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => move(idx, 1)}>
                      ↓
                    </button>
                    <button
                      className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200"
                      onClick={() => removeSection(idx)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="text-xs text-neutral-400">Type</label>
                    <select
                      className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                      value={s.type}
                      onChange={(e) => updateSection(idx, { type: e.target.value })}
                    >
                      {sectionTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-neutral-400">dataJson (string JSON)</label>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
                      rows={7}
                      value={s.dataJson}
                      onChange={(e) => updateSection(idx, { dataJson: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {!sections.length ? (
            <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4 text-sm text-neutral-300">
              No hay secciones aún. Agrega una desde el panel de la derecha.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}