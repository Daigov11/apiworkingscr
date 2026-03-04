"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionForm from "@/components/admin/SectionForm";
import { adminDeletePage, adminGetPage, adminUpdatePage } from "@/lib/api/cmsAdmin";

// ✅ DnD Kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
type SeoLevel = "good" | "warn" | "bad";

function seoPill(level: SeoLevel) {
  if (level === "good") return "bg-green-900/40 text-green-200 border-green-900/40";
  if (level === "warn") return "bg-yellow-900/40 text-yellow-200 border-yellow-900/40";
  return "bg-red-900/40 text-red-200 border-red-900/40";
}

function SeoBadge({ level, text }: { level: SeoLevel; text: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs ${seoPill(level)}`}>
      <span className="text-base leading-none">●</span>
      <span>{text}</span>
    </span>
  );
}

function normalizeSlugHint(slug: string) {
  const s = (slug || "").trim();
  const lower = s.toLowerCase();
  const clean = lower
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean;
}

function titleSeo(metaTitle: string) {
  const len = (metaTitle || "").trim().length;

  if (len === 0) return { level: "bad" as SeoLevel, msg: "Falta metaTitle" };
  if (len > 70) return { level: "bad" as SeoLevel, msg: `Muy largo (${len}) — ideal 45–60` };
  if (len < 30) return { level: "bad" as SeoLevel, msg: `Muy corto (${len}) — ideal 45–60` };
  if (len < 45) return { level: "warn" as SeoLevel, msg: `Aceptable (${len}) — ideal 45–60` };
  if (len > 60) return { level: "warn" as SeoLevel, msg: `Un poco largo (${len}) — ideal 45–60` };
  return { level: "good" as SeoLevel, msg: `Perfecto (${len})` };
}

function descSeo(metaDescription: string) {
  const len = (metaDescription || "").trim().length;

  if (len === 0) return { level: "bad" as SeoLevel, msg: "Falta metaDescription" };
  if (len > 200) return { level: "bad" as SeoLevel, msg: `Muy larga (${len}) — ideal 140–160` };
  if (len < 110) return { level: "bad" as SeoLevel, msg: `Muy corta (${len}) — ideal 140–160` };
  if (len < 140) return { level: "warn" as SeoLevel, msg: `Aceptable (${len}) — ideal 140–160` };
  if (len > 160) return { level: "warn" as SeoLevel, msg: `Un poco larga (${len}) — ideal 140–160` };
  return { level: "good" as SeoLevel, msg: `Perfecta (${len})` };
}

function slugSeo(slug: string) {
  const raw = (slug || "").trim();
  const clean = normalizeSlugHint(raw);

  if (!raw) return { level: "bad" as SeoLevel, msg: "Falta slug" };

  const invalidChars = /[^a-zA-Z0-9-_ ]/.test(raw);
  const hasSpaces = /\s/.test(raw);
  const hasUpper = /[A-Z]/.test(raw);
  const hasUnderscore = /_/.test(raw);
  const hasDoubleDash = /--/.test(raw);
  const startsEndsDash = /^-|-$/g.test(raw);
  const len = clean.length;

  // regla final “ideal”: solo a-z0-9 y guiones
  const okRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean);

  if (invalidChars) return { level: "bad" as SeoLevel, msg: "Tiene caracteres raros" };
  if (hasSpaces) return { level: "bad" as SeoLevel, msg: "Tiene espacios (usa guiones)" };

  if (!okRegex) return { level: "warn" as SeoLevel, msg: `Se normalizará a: ${clean || "—"}` };
  if (len < 3) return { level: "warn" as SeoLevel, msg: `Muy corto (${len})` };
  if (len > 80) return { level: "warn" as SeoLevel, msg: `Muy largo (${len})` };

  if (hasUpper || hasUnderscore || hasDoubleDash || startsEndsDash) {
    return { level: "warn" as SeoLevel, msg: `Recomendado: ${clean}` };
  }

  return { level: "good" as SeoLevel, msg: `OK (${len})` };
}

function ogSeo(ogImage: string) {
  const v = (ogImage || "").trim();
  if (!v) return { level: "warn" as SeoLevel, msg: "Opcional, pero recomendado (1200×630)" };
  if (!/^https?:\/\//i.test(v)) return { level: "bad" as SeoLevel, msg: "Debe iniciar con http(s)://" };
  return { level: "good" as SeoLevel, msg: "OK (ideal 1200×630)" };
}

function seoOverall(levels: SeoLevel[]) {
  if (levels.includes("bad")) return "bad" as SeoLevel;
  if (levels.includes("warn")) return "warn" as SeoLevel;
  return "good" as SeoLevel;
}
type UiSection = {
  sectionKey: string;
  type: string;
  sortOrder: number;
  dataJson: string;
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

  const arr = (v: any) => (Array.isArray(v) ? v : []);
  const errs: string[] = [];

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
    });
  }

  if (type === "spacer") {
    const size = (obj as any).size;
    if (typeof size !== "number") errs.push("size debe ser número");
  }

  return errs;
}

function uniqueSectionKey(base: string) {
  const clean = (base || "sec").toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const short = String(Date.now()).slice(-6);
  return `${clean}_${short}`;
}

function reindex(next: UiSection[]) {
  return next.map((s, i) => ({ ...s, sortOrder: i + 1 }));
}

/** ===========================
 *  AUTOSAVE helpers
 *  =========================== */
function draftKey(pageId: number) {
  return `awcmr_draft_page_${pageId}`;
}

function makeSnapshot(input: {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  status: string;
  sections: UiSection[];
}) {
  // Canonical: reindex + solo campos relevantes
  const canonSections = reindex(input.sections).map((s) => ({
    sectionKey: s.sectionKey,
    type: s.type,
    dataJson: s.dataJson ?? "{}",
  }));

  return JSON.stringify({
    slug: input.slug || "",
    metaTitle: input.metaTitle || "",
    metaDescription: input.metaDescription || "",
    ogImage: input.ogImage || "",
    status: input.status || "draft",
    sections: canonSections,
  });
}

/** ===========================
 *  Sortable Card (DnD)
 *  =========================== */
function SortableSectionCard(props: {
  section: UiSection;
  index: number;
  errors: string[];
  sectionTypes: string[];
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onChangeType: (type: string) => void;
  onChangeDataJson: (dataJson: string) => void;
}) {
  const {
    section,
    index,
    errors,
    sectionTypes,
    onMoveUp,
    onMoveDown,
    onDuplicate,
    onRemove,
    onChangeType,
    onChangeDataJson,
  } = props;

  const ok = errors.length === 0;

  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.sectionKey });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-2xl border border-neutral-800 bg-black/20 p-4",
        isDragging ? "ring-2 ring-white/20" : "",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-extrabold">
          #{index + 1} — {section.sectionKey} — {section.type}{" "}
          <span
            className={`ml-2 rounded-full px-2 py-1 text-xs ${
              ok ? "bg-green-900/40 text-green-200" : "bg-red-900/40 text-red-200"
            }`}
          >
            {ok ? "OK" : `Errores: ${errors.length}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* ✅ Drag handle */}
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            type="button"
            className="cursor-grab active:cursor-grabbing rounded-lg border border-neutral-800 px-2 py-1 text-xs hover:bg-neutral-900/40"
            title="Arrastrar para reordenar"
            aria-label="Arrastrar"
          >
            ⠿
          </button>

          {/* fallback ↑↓ */}
          <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={onMoveUp} type="button">
            ↑
          </button>
          <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={onMoveDown} type="button">
            ↓
          </button>

          <button
            className="rounded-lg border border-neutral-800 px-2 py-1 text-xs hover:bg-neutral-900/40"
            onClick={onDuplicate}
            type="button"
            title="Duplicar sección"
          >
            Duplicar
          </button>

          <button
            className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200"
            onClick={onRemove}
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

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs text-neutral-400">Type</label>
          <select
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={section.type}
            onChange={(e) => onChangeType(e.target.value)}
          >
            {sectionTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <SectionForm type={section.type} dataJson={section.dataJson} onChangeDataJson={onChangeDataJson} />
        </div>
      </div>
    </div>
  );
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

  // ✅ Autosave/dirty
  const [hasLocalDraft, setHasLocalDraft] = useState(false);
  const [localDraftTs, setLocalDraftTs] = useState<number | null>(null);
  const [lastAutosaveTs, setLastAutosaveTs] = useState<number | null>(null);

  const serverSnapshotRef = useRef<string>(""); // último guardado “oficial” (server)
  const [dirty, setDirty] = useState(false);

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
      "heroMedia",
      "productsGrid",
      "cardsGrid",
      "ctaSplit",
      "pricingTabs",
      "contactForm",
"contactFormSplit",
    ],
    []
  );

  // ✅ DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load
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

        // snapshot base (server)
        const snap = makeSnapshot({
          slug: data.page.slug || "",
          metaTitle: data.page.metaTitle || "",
          metaDescription: data.page.metaDescription || "",
          ogImage: data.page.ogImage || "",
          status: data.page.status || "draft",
          sections: sorted,
        });

        serverSnapshotRef.current = snap;
        setDirty(false);

        // verificar borrador local
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(draftKey(id));
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed?.ts && parsed?.state) {
                setHasLocalDraft(true);
                setLocalDraftTs(Number(parsed.ts));
              }
            } catch {}
          }
        }
      } catch (e: any) {
        setErr(e.message || "Error cargando página");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Dirty recalculation (cuando cambia algo)
  useEffect(() => {
    if (loading) return;
    const current = makeSnapshot({ slug, metaTitle, metaDescription, ogImage, status, sections });
    setDirty(current !== serverSnapshotRef.current);
  }, [slug, metaTitle, metaDescription, ogImage, status, sections, loading]);

  // beforeunload (tab close/refresh)
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    if (dirty) window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Autosave localStorage cada 8s si hay cambios
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      if (!dirty) return;

      try {
        const state = {
          slug,
          metaTitle,
          metaDescription,
          ogImage,
          status,
          sections: reindex(sections),
        };

        localStorage.setItem(
          draftKey(id),
          JSON.stringify({ ts: Date.now(), state })
        );

        setHasLocalDraft(true);
        setLocalDraftTs(Date.now());
        setLastAutosaveTs(Date.now());
      } catch {
        // si localStorage falla, no rompemos
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [dirty, slug, metaTitle, metaDescription, ogImage, status, sections, id, loading]);

  function restoreLocalDraft() {
    try {
      const raw = localStorage.getItem(draftKey(id));
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const st = parsed?.state;
      if (!st) return;

      setSlug(st.slug || "");
      setMetaTitle(st.metaTitle || "");
      setMetaDescription(st.metaDescription || "");
      setOgImage(st.ogImage || "");
      setStatus(st.status || "draft");
      setSections(Array.isArray(st.sections) ? st.sections : []);

      setHasLocalDraft(true);
      setLocalDraftTs(Number(parsed.ts) || Date.now());
    } catch {}
  }

  function discardLocalDraft() {
    try {
      localStorage.removeItem(draftKey(id));
    } catch {}
    setHasLocalDraft(false);
    setLocalDraftTs(null);
  }

  function moveButtons(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    setSections(reindex(next));
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

  function onDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId || activeId === overId) return;

    const oldIndex = sections.findIndex((s) => s.sectionKey === activeId);
    const newIndex = sections.findIndex((s) => s.sectionKey === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const moved = arrayMove(sections, oldIndex, newIndex);
    setSections(reindex(moved));
  }

  async function onSave() {
    try {
      setSaving(true);
      setErr(null);

      const allErrors: Array<{ idx: number; key: string; type: string; errors: string[] }> = [];
      sections.forEach((s, i) => {
        const errors = validateSection(s.type, s.dataJson);
        if (errors.length) allErrors.push({ idx: i, key: s.sectionKey, type: s.type, errors });
      });

      if (allErrors.length) {
        const first = allErrors[0];
        throw new Error(
          `No se puede guardar. Errores en sección #${first.idx + 1} (${first.type} / ${first.key}): ${first.errors.join(", ")}`
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

      // actualizar snapshot oficial (server) y limpiar dirty
      serverSnapshotRef.current = makeSnapshot({ slug, metaTitle, metaDescription, ogImage, status, sections });
      setDirty(false);

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

  const sectionIds = sections.map((s) => s.sectionKey);

  const showDraftBanner = hasLocalDraft; // existe draft local

  function fmtTs(ts: number | null) {
    if (!ts) return "";
    const d = new Date(ts);
    return new Intl.DateTimeFormat("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Editar página (ID: {id})</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
            {dirty ? (
              <span className="rounded-full bg-yellow-900/40 px-2 py-1 text-xs text-yellow-200">
                ● Cambios sin guardar
              </span>
            ) : (
              <span className="rounded-full bg-green-900/40 px-2 py-1 text-xs text-green-200">
                Guardado
              </span>
            )}

            {lastAutosaveTs ? (
              <span className="text-xs text-neutral-400">
                Autosave: {fmtTs(lastAutosaveTs)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
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
            title={slug.trim() ? "Ver página pública (published)" : "Primero define un slug"}
          >
            Ver
          </a>

          <a
            className={`rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40 ${
              slug.trim() ? "" : "pointer-events-none opacity-50"
            }`}
            href={`/preview/${slug.trim()}`}
            target="_blank"
            rel="noreferrer"
            title={slug.trim() ? "Preview (draft) usando bridge" : "Primero define un slug"}
          >
            Preview
          </a>

          <button
            className="rounded-xl border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-200 hover:bg-red-950/30"
            onClick={onDelete}
            type="button"
          >
            Eliminar
          </button>

          <button
            className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-black disabled:opacity-50"
            onClick={onSave}
            disabled={saving}
            type="button"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Banner borrador local */}
      {showDraftBanner ? (
        <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
          <div className="text-sm text-neutral-200">
            Hay un <strong>borrador local</strong> guardado{" "}
            {localDraftTs ? <span className="text-neutral-400">(último: {fmtTs(localDraftTs)})</span> : null}.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40"
              type="button"
              onClick={restoreLocalDraft}
            >
              Restaurar borrador local
            </button>
            <button
              className="rounded-xl border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-200 hover:bg-red-950/30"
              type="button"
              onClick={discardLocalDraft}
            >
              Descartar borrador local
            </button>
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Nota: el borrador local es solo en este navegador/PC.
          </div>
        </div>
      ) : null}

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      {/* Meta */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-5">
          <div className="text-sm font-extrabold text-neutral-200">Meta</div>
          {/* ✅ SEO UI */}
{(() => {
  const t = titleSeo(metaTitle);
  const d = descSeo(metaDescription);
  const s = slugSeo(slug);
  const o = ogSeo(ogImage);

  const overall = seoOverall([t.level, d.level, s.level, o.level]);
  const cleanSlug = normalizeSlugHint(slug || "");

  // preview tipo Google
  const previewTitle = (metaTitle || "").trim() || "Título de la página";
  const previewDesc =
    (metaDescription || "").trim() || "Aquí aparecerá tu descripción en Google (meta description).";
  const previewUrl = `https://tu-dominio.pe/${cleanSlug || "slug"}`;

  return (
    <div className="mt-4 rounded-2xl border border-neutral-800 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-extrabold text-neutral-200">SEO</div>
        <SeoBadge
          level={overall}
          text={
            overall === "good"
              ? "Listo para publicar"
              : overall === "warn"
              ? "Publicable, pero mejorable"
              : "No recomendado publicar"
          }
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <SeoBadge level={t.level} text={`Title: ${t.msg}`} />
        <SeoBadge level={d.level} text={`Description: ${d.msg}`} />
        <SeoBadge level={s.level} text={`Slug: ${s.msg}`} />
        <SeoBadge level={o.level} text={`OG: ${o.msg}`} />
      </div>

      <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="text-xs text-neutral-500">Vista previa (Google)</div>
        <div className="mt-2 text-lg font-semibold text-blue-300">{previewTitle}</div>
        <div className="mt-1 text-xs text-green-300">{previewUrl}</div>
        <div className="mt-2 text-sm text-neutral-200">{previewDesc}</div>
      </div>

      {slug && cleanSlug !== slug.trim() ? (
        <div className="mt-3 text-xs text-yellow-200">
          Recomendación: usa slug normalizado: <span className="font-bold">{cleanSlug}</span>
        </div>
      ) : null}

      <div className="mt-2 text-xs text-neutral-500">
        Tips: Title ideal **45–60** caracteres. Description ideal **140–160**. OG ideal **1200×630**.
      </div>
    </div>
  );
})()}

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
          <p className="mt-2 text-sm text-neutral-300">Se agrega al final (luego puedes arrastrar para ordenar).</p>

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

        {!sections.length ? (
          <div className="mt-4 rounded-2xl border border-neutral-800 bg-black/20 p-4 text-sm text-neutral-300">
            No hay secciones aún. Agrega una desde el panel de la derecha.
          </div>
        ) : (
          <div className="mt-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {sections.map((s, idx) => {
                    const errors = validateSection(s.type, s.dataJson);

                    return (
                      <SortableSectionCard
                        key={s.sectionKey}
                        section={s}
                        index={idx}
                        errors={errors}
                        sectionTypes={sectionTypes}
                        onMoveUp={() => moveButtons(idx, -1)}
                        onMoveDown={() => moveButtons(idx, 1)}
                        onDuplicate={() => duplicateSection(idx)}
                        onRemove={() => removeSection(idx)}
                        onChangeType={(type) => updateSection(idx, { type })}
                        onChangeDataJson={(dataJson) => updateSection(idx, { dataJson })}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}