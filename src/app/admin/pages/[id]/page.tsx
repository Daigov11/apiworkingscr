"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionForm from "@/components/admin/SectionForm";
import { adminDeletePage, adminGetPage, adminUpdatePage } from "@/lib/api/cmsAdmin";

type UiSection = {
  sectionKey: string;
  type: string;
  sortOrder: number;
  dataJson: string; // JSON string
};

function safeJson(json: string) {
  try {
    const v = JSON.parse(json || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return null;
  }
}

function isNonEmptyString(v: any) {
  return typeof v === "string" && v.trim().length > 0;
}

function validateSection(typeRaw: string, dataJson: string): string[] {
  const type = (typeRaw || "").trim().toLowerCase();
  const obj = safeJson(dataJson);
  if (obj === null) return ["JSON inválido"];

  // helper arrays
  const arr = (v: any) => (Array.isArray(v) ? v : []);
  const errs: string[] = [];

  // Validaciones “mínimas” (MVP)
  if (type === "hero") {
    if (!isNonEmptyString((obj as any).title)) errs.push("Falta title");
  }

  if (type === "text") {
    if (!isNonEmptyString((obj as any).text)) errs.push("Falta text");
  }

  if (type === "cta") {
    if (!isNonEmptyString((obj as any).title)) errs.push("Falta title");
    if (!isNonEmptyString((obj as any).ctaText)) errs.push("Falta ctaText");
    if (!isNonEmptyString((obj as any).ctaHref)) errs.push("Falta ctaHref");
  }

  if (type === "imagetext") {
    if (!isNonEmptyString((obj as any).text)) errs.push("Falta text");
    if (!isNonEmptyString((obj as any).imageUrl)) errs.push("Falta imageUrl");
  }

  if (type === "videotext") {
    if (!isNonEmptyString((obj as any).text)) errs.push("Falta text");
    if (!isNonEmptyString((obj as any).videoUrl)) errs.push("Falta videoUrl");
  }

  if (type === "features") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.title)) errs.push(`items[${i}].title falta`);
      if (!isNonEmptyString(it?.text)) errs.push(`items[${i}].text falta`);
    });
  }

  if (type === "stats") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.value)) errs.push(`items[${i}].value falta`);
      if (!isNonEmptyString(it?.label)) errs.push(`items[${i}].label falta`);
    });
  }

  if (type === "faq") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.question)) errs.push(`items[${i}].question falta`);
      if (!isNonEmptyString(it?.answer)) errs.push(`items[${i}].answer falta`);
    });
  }

  if (type === "testimonials") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.name)) errs.push(`items[${i}].name falta`);
      if (!isNonEmptyString(it?.text)) errs.push(`items[${i}].text falta`);
    });
  }

  if (type === "logos") {
    const logos = arr((obj as any).logos);
    if (!logos.length) errs.push("logos[] vacío");
    logos.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.imageUrl)) errs.push(`logos[${i}].imageUrl falta`);
    });
  }

  if (type === "carousel") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.imageUrl)) errs.push(`items[${i}].imageUrl falta`);
    });
  }

  if (type === "pricing") {
    const plans = arr((obj as any).plans);
    if (!plans.length) errs.push("plans[] vacío");
    plans.forEach((p: any, i: number) => {
      if (!isNonEmptyString(p?.name)) errs.push(`plans[${i}].name falta`);
      if (!isNonEmptyString(p?.price)) errs.push(`plans[${i}].price falta`);
      // features puede estar vacío, no es obligatorio
    });
  }

  if (type === "spacer") {
    const size = (obj as any).size;
    if (typeof size !== "number") errs.push("size debe ser número");
  }

  // divider no requiere nada

  return errs;
}

export default function AdminPageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // meta
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [status, setStatus] = useState("draft");

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

        const sorted = [...(data.sections || [])].sort((a, b) => a.sortOrder - b.sortOrder);
        setSections(sorted);
      } catch (e: any) {
        setErr(e.message || "Error cargando página");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function reindex(next: UiSection[]) {
    return next.map((s, i) => ({ ...s, sortOrder: i + 1 }));
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    setSections(reindex(next));
  }

  function uniqueSectionKey(base: string) {
    const clean = (base || "sec").toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const short = String(Date.now()).slice(-6);
    return `${clean}_${short}`;
  }

  function addSection(type: string) {
    const newKey = uniqueSectionKey(type);
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

  function duplicateSection(idx: number) {
    const current = sections[idx];
    if (!current) return;

    const newKey = uniqueSectionKey(current.sectionKey + "_copy");
    const copy: UiSection = {
      sectionKey: newKey,
      type: current.type,
      sortOrder: current.sortOrder + 1,
      dataJson: current.dataJson || "{}",
    };

    // insertar justo después
    const next = [...sections.slice(0, idx + 1), copy, ...sections.slice(idx + 1)];
    setSections(reindex(next));
  }

  function removeSection(idx: number) {
    const next = sections.filter((_, i) => i !== idx);
    setSections(reindex(next));
  }

  function updateSection(idx: number, patch: Partial<UiSection>) {
    const next = [...sections];
    next[idx] = { ...next[idx], ...patch };
    setSections(next);
  }

  async function onSave() {
    try {
      setSaving(true);
      setErr(null);

      // Validar JSON + reglas por módulo
      const allErrors: Array<{ idx: number; key: string; type: string; errors: string[] }> = [];
      sections.forEach((s, i) => {
        const errors = validateSection(s.type, s.dataJson);
        if (errors.length) allErrors.push({ idx: i, key: s.sectionKey, type: s.type, errors });
      });

      if (allErrors.length) {
        const first = allErrors[0];
        throw new Error(
          `No se puede guardar. Errores en sección #${first.idx + 1} (${first.type} / ${first.key}): ${first.errors.join(
            ", "
          )}`
        );
      }

      await adminUpdatePage(id, {
        slug,
        metaTitle,
        metaDescription,
        ogImage,
        status,
        sections: reindex(sections),
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
          <p className="mt-2 text-sm text-neutral-300">Ahora con validación + duplicar secciones.</p>
        </div>

        <div className="flex gap-2">
          <a className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40" href="/admin/pages">
            Volver
          </a>

          <a
            className={`rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40 ${
              slug.trim() ? "" : "pointer-events-none opacity-50"
            }`}
            href={`/${slug.trim()}`}
            target="_blank"
            rel="noreferrer"
            title={slug.trim() ? "Ver página pública" : "Primero define un slug"}
          >
            Ver
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
        <div className="mt-4 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">{err}</div>
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
          <p className="mt-2 text-sm text-neutral-300">Se agrega al final (luego puedes reordenar).</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {sectionTypes.map((t) => (
              <button
                key={t}
                className="rounded-xl border border-neutral-800 px-3 py-2 text-left text-sm hover:bg-neutral-900/40"
                onClick={() => addSection(t)}
                type="button"
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
            const errors = validateSection(s.type, s.dataJson);
            const ok = errors.length === 0;

            return (
              <div key={s.sectionKey} className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-extrabold">
                    #{idx + 1} — {s.sectionKey} — {s.type}{" "}
                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-xs ${
                        ok ? "bg-green-900/40 text-green-200" : "bg-red-900/40 text-red-200"
                      }`}
                    >
                      {ok ? "OK" : `Errores: ${errors.length}`}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => move(idx, -1)} type="button">
                      ↑
                    </button>
                    <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => move(idx, 1)} type="button">
                      ↓
                    </button>

                    <button
                      className="rounded-lg border border-neutral-800 px-2 py-1 text-xs hover:bg-neutral-900/40"
                      onClick={() => duplicateSection(idx)}
                      type="button"
                      title="Duplicar sección"
                    >
                      Duplicar
                    </button>

                    <button
                      className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200"
                      onClick={() => removeSection(idx)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                {!ok ? (
                  <div className="mt-2 rounded-xl border border-red-900/40 bg-red-950/10 p-3 text-xs text-red-200">
                    <div className="font-bold">Errores:</div>
                    <ul className="mt-1 list-disc pl-5">
                      {errors.slice(0, 6).map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                    {errors.length > 6 ? <div className="mt-1 text-red-300">… y {errors.length - 6} más</div> : null}
                  </div>
                ) : null}

                {/* Type + Form */}
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
                    <SectionForm
                      type={s.type}
                      dataJson={s.dataJson}
                      onChangeDataJson={(next) => updateSection(idx, { dataJson: next })}
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