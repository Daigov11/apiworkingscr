"use client";

import { useEffect, useMemo, useState } from "react";

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

function safeParse(json: string) {
  try {
    const v = JSON.parse(json || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return null;
  }
}

function stringify(obj: any) {
  return JSON.stringify(obj ?? {}, null, 2);
}

function genKey(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

type Props = {
  type: string;
  dataJson: string;
  onChangeDataJson: (next: string) => void;
};

type SortableListProps = {
  title: string;
  items: any[];
  onItemsChange: (next: any[]) => void;
  createItem: () => any;
  renderFields: (item: any, patch: (p: any) => void) => React.ReactNode;
};

function SortableRow({
  id,
  children,
  onRemove,
  onUp,
  onDown,
}: {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
}) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id });

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
        "mt-3 rounded-2xl border border-neutral-800 bg-black/20 p-4",
        isDragging ? "ring-2 ring-white/20" : "",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-neutral-400">Item</div>
        <div className="flex gap-2">
          {/* ✅ handle */}
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            type="button"
            className="cursor-grab active:cursor-grabbing rounded-lg border border-neutral-800 px-2 py-1 text-xs hover:bg-neutral-900/40"
            title="Arrastrar"
            aria-label="Arrastrar"
          >
            ⠿
          </button>

          {/* fallback */}
          <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={onUp}>
            ↑
          </button>
          <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={onDown}>
            ↓
          </button>

          <button
            type="button"
            className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200"
            onClick={onRemove}
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function SortableList({ title, items, onItemsChange, createItem, renderFields }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ✅ 1) IDs seguros (fallback si no hay __key todavía)
  const ids = items.map((it, idx) => {
    const k = it && typeof it === "object" ? (it as any).__key : null;
    return String(k || `tmp_${idx}`);
  });

  // ✅ 2) Auto-normalizar: si algún item no tiene __key, se lo ponemos
  useEffect(() => {
    if (!items || !items.length) return;

    const needsKey = items.some((it) => !(it && typeof it === "object" && (it as any).__key));
    if (!needsKey) return;

    const next = items.map((it) => {
      if (it && typeof it === "object") {
        const obj: any = it;
        return obj.__key ? obj : { ...obj, __key: genKey("item") };
      }
      // si por error vino algo no-objeto, lo convertimos
      return { __key: genKey("item"), value: it };
    });

    onItemsChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function onDragEnd(e: DragEndEvent) {
    const a = String(e.active.id);
    const o = e.over ? String(e.over.id) : null;
    if (!o || a === o) return;

    // ✅ 3) Usar ids[] para encontrar índices (no dependemos de __key)
    const oldIndex = ids.indexOf(a);
    const newIndex = ids.indexOf(o);
    if (oldIndex === -1 || newIndex === -1) return;

    onItemsChange(arrayMove(items, oldIndex, newIndex));
  }

  function add() {
    onItemsChange([...items, createItem()]);
  }

  function removeAt(idx: number) {
    onItemsChange(items.filter((_, i) => i !== idx));
  }

  function moveAt(idx: number, dir: -1 | 1) {
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    const next = items.slice();
    const tmp = next[idx];
    next[idx] = next[t];
    next[t] = tmp;
    onItemsChange(next);
  }

  function patchAt(idx: number, patch: any) {
    const next = items.slice();
    const prev: any = next[idx] || {};
    // ✅ conservar __key siempre
    const keepKey = prev && typeof prev === "object" ? prev.__key : undefined;
    const merged = { ...(prev || {}), ...patch };
    if (keepKey && !merged.__key) merged.__key = keepKey;
    if (!merged.__key) merged.__key = genKey("item");
    next[idx] = merged;
    onItemsChange(next);
  }

  return (
    <div className="mt-2">
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-sm font-extrabold text-neutral-200">{title}</div>
        <button
          type="button"
          className="rounded-xl border border-neutral-800 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900/40"
          onClick={add}
        >
          + Agregar
        </button>
      </div>

      {!items.length ? (
        <div className="mt-3 rounded-xl border border-neutral-800 bg-black/10 p-3 text-xs text-neutral-400">
          No hay items. Usa “Agregar”.
        </div>
      ) : (
        <div className="mt-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              {items.map((it, idx) => {
                const rowId = ids[idx]; // ✅ id estable para este render
                return (
                  <SortableRow
                    key={rowId}
                    id={rowId}
                    onRemove={() => removeAt(idx)}
                    onUp={() => moveAt(idx, -1)}
                    onDown={() => moveAt(idx, 1)}
                  >
                    {renderFields(it, (p) => patchAt(idx, p))}
                  </SortableRow>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
export default function SectionForm({ type, dataJson, onChangeDataJson }: Props) {
  const t = (type || "").trim().toLowerCase();
  const parsed = useMemo(() => safeParse(dataJson), [dataJson]);
  const [showJson, setShowJson] = useState(false);

  const supported = [
    "hero",
    "text",
    "cta",
    "spacer",
    "divider",
    "imagetext",
    "videotext",
    "features",
    "stats",
    "faq",
    "testimonials",
    "logos",
    "carousel",
    "pricing",
    "productsgrid",
    "heromedia",
    "cardsgrid",
"ctasplit",
"pricingtabs",
"contactform",
"contactformsplit",
  ].includes(t);

  const forceJson = parsed === null;

  function setField(key: string, value: any) {
    const base = parsed ?? {};
    const next = { ...base, [key]: value };
    onChangeDataJson(stringify(next));
  }

  function getArray(key: string) {
    const base = parsed ?? {};
    const v = (base as any)[key];
    return Array.isArray(v) ? v : [];
  }

  function setArray(key: string, arr: any[]) {
    setField(key, arr);
  }

  // ✅ normaliza __key para DnD (una sola vez cuando hace falta)
useEffect(() => {
  if (!parsed) return;

  const base: any = parsed;

  function normalizeArrayField(field: string, prefix: string) {
    const arr = Array.isArray(base[field]) ? base[field] : [];
    let changed = false;

    const nextArr = arr.map((it: any) => {
      if (!it || typeof it !== "object") {
        changed = true;
        return { __key: genKey(prefix), value: it };
      }
      if (!it.__key) {
        changed = true;
        return { ...it, __key: genKey(prefix) };
      }
      return it;
    });

    return { changed, nextArr };
  }

  // ✅ Caso especial: pricingTabs tiene 2 arrays DnD
  if (t === "pricingtabs") {
    const a = normalizeArrayField("billingOptions", "billingOptions");
    const b = normalizeArrayField("plans", "plans");

    if (!a.changed && !b.changed) return;

    const nextObj = { ...base, billingOptions: a.nextArr, plans: b.nextArr };
    const nextJson = stringify(nextObj);
    if (nextJson !== dataJson) onChangeDataJson(nextJson);
    return;
  }

  // resto igual que tenías
  let keyName: string | null = null;
  if (["features", "stats", "faq", "testimonials", "carousel"].includes(t)) keyName = "items";
  if (t === "logos") keyName = "logos";
  if (t === "pricing") keyName = "plans";

  if (!keyName) return;

  const arr = Array.isArray(base[keyName]) ? base[keyName] : [];
  let changed = false;

  const nextArr = arr.map((it: any) => {
    if (!it || typeof it !== "object") {
      changed = true;
      return { __key: genKey(keyName!), value: it };
    }
    if (!it.__key) {
      changed = true;
      return { ...it, __key: genKey(keyName!) };
    }
    return it;
  });

  if (!changed) return;

  const nextObj = { ...base, [keyName]: nextArr };
  const nextJson = stringify(nextObj);
  if (nextJson !== dataJson) onChangeDataJson(nextJson);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [t]);

  if (!supported) {
    return (
      <div className="mt-2 rounded-xl border border-neutral-800 bg-black/20 p-3">
        <div className="text-xs text-neutral-400">
          Este módulo aún no tiene formulario. Usa <strong>dataJson</strong>.
        </div>

        <label className="mt-3 block text-xs text-neutral-400">dataJson</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
          rows={7}
          value={dataJson}
          onChange={(e) => onChangeDataJson(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-neutral-800 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-neutral-300">Modo formulario</div>

        <button
          type="button"
          className="rounded-lg border border-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-900/40"
          onClick={() => setShowJson((v) => !v)}
        >
          {showJson || forceJson ? "Ocultar JSON" : "Ver JSON"}
        </button>
      </div>

      {forceJson ? (
        <div className="mt-2 rounded-lg border border-red-900/40 bg-red-950/20 p-2 text-xs text-red-200">
          JSON inválido. Corrígelo manualmente en “Ver JSON”.
        </div>
      ) : null}

      {!forceJson ? (
        <div className="mt-3 grid gap-3">
          {/* HERO */}
          {t === "hero" ? (
            <>
              <FieldText label="Título" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Subtítulo" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />
              <div className="grid gap-3 md:grid-cols-2">
                <FieldText label="Texto botón (CTA)" value={(parsed as any)?.ctaText ?? ""} onChange={(v) => setField("ctaText", v)} />
                <FieldText label="Link botón (CTA)" value={(parsed as any)?.ctaHref ?? ""} onChange={(v) => setField("ctaHref", v)} />
              </div>
            </>
          ) : null}
{/* HEROMEDIA */}
{t === "heromedia" ? (
  <>
    <FieldText
      label="Eyebrow (texto pequeño arriba)"
      value={(parsed as any)?.eyebrow ?? ""}
      onChange={(v) => setField("eyebrow", v)}
    />

    <FieldText
      label="Título"
      value={(parsed as any)?.title ?? ""}
      onChange={(v) => setField("title", v)}
    />

    <FieldTextarea
      label="Subtítulo"
      value={(parsed as any)?.subtitle ?? ""}
      onChange={(v) => setField("subtitle", v)}
    />

    {/* Badges (chips) */}
    <div>
      <label className="text-xs text-neutral-400">Badges (1 por línea)</label>
      <textarea
        className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
        rows={4}
        value={Array.isArray((parsed as any)?.badges) ? (parsed as any).badges.join("\n") : ""}
        onChange={(e) => {
          const lines = e.target.value
            .split(/\r?\n/)
            .map((x) => x.trim())
            .filter(Boolean);
          setField("badges", lines);
        }}
        placeholder={["Tiendas", "Hoteles", "Restaurantes"].join("\n")}
      />
    </div>

    {/* CTAs */}
    <div className="rounded-2xl border border-neutral-800 bg-black/10 p-3">
      <div className="text-sm font-extrabold text-neutral-200">Botones (CTA)</div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <FieldText
          label="CTA principal - Texto"
          value={(parsed as any)?.primaryCta?.text ?? ""}
          onChange={(v) => setField("primaryCta", { ...(parsed as any)?.primaryCta, text: v, href: (parsed as any)?.primaryCta?.href ?? "" })}
        />
        <FieldText
          label="CTA principal - Link"
          value={(parsed as any)?.primaryCta?.href ?? ""}
          onChange={(v) => setField("primaryCta", { ...(parsed as any)?.primaryCta, href: v, text: (parsed as any)?.primaryCta?.text ?? "" })}
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <FieldText
          label="CTA secundario - Texto"
          value={(parsed as any)?.secondaryCta?.text ?? ""}
          onChange={(v) => setField("secondaryCta", { ...(parsed as any)?.secondaryCta, text: v, href: (parsed as any)?.secondaryCta?.href ?? "" })}
        />
        <FieldText
          label="CTA secundario - Link"
          value={(parsed as any)?.secondaryCta?.href ?? ""}
          onChange={(v) => setField("secondaryCta", { ...(parsed as any)?.secondaryCta, href: v, text: (parsed as any)?.secondaryCta?.text ?? "" })}
        />
      </div>

      <div className="mt-2 text-xs text-neutral-500">
        Tip: si dejas vacío el CTA secundario, puedes ocultarlo luego (si quieres lo agregamos).
      </div>
    </div>

    {/* Media */}
    <div className="rounded-2xl border border-neutral-800 bg-black/10 p-3">
      <div className="text-sm font-extrabold text-neutral-200">Media (derecha)</div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs text-neutral-400">Tipo de media</label>
          <select
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
            value={(parsed as any)?.mediaType ?? "image"}
            onChange={(e) => setField("mediaType", e.target.value)}
          >
            <option value="image">Imagen</option>
            <option value="video">Video (embed)</option>
          </select>
        </div>

        <FieldText
          label="Media URL (imagen o embed)"
          value={(parsed as any)?.mediaUrl ?? ""}
          onChange={(v) => setField("mediaUrl", v)}
        />
      </div>

      <FieldText
        label="Media Alt (opcional)"
        value={(parsed as any)?.mediaAlt ?? ""}
        onChange={(v) => setField("mediaAlt", v)}
      />

      <div className="mt-2 text-xs text-neutral-500">
        Video: usa URL embed (ej: https://www.youtube.com/embed/XXXX). Imagen: URL directa.
      </div>
    </div>

    {/* Includes */}
    <div className="rounded-2xl border border-neutral-800 bg-black/10 p-3">
      <div className="text-sm font-extrabold text-neutral-200">Bloque “Tu sistema incluye”</div>

      <FieldText
        label="Título del bloque (opcional)"
        value={(parsed as any)?.includesTitle ?? ""}
        onChange={(v) => setField("includesTitle", v)}
      />

      <FieldTextarea
        label="Texto del bloque"
        value={(parsed as any)?.includesText ?? ""}
        onChange={(v) => setField("includesText", v)}
      />

      <div>
        <label className="text-xs text-neutral-400">Imágenes (1 URL por línea)</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
          rows={5}
          value={
            Array.isArray((parsed as any)?.includesImages)
              ? (parsed as any).includesImages.map((x: any) => x?.imageUrl || "").filter(Boolean).join("\n")
              : ""
          }
          onChange={(e) => {
            const lines = e.target.value
              .split(/\r?\n/)
              .map((x) => x.trim())
              .filter(Boolean);

            const arr = lines.map((url) => ({ imageUrl: url }));
            setField("includesImages", arr);
          }}
          placeholder={[
            "https://picsum.photos/seed/inc1/400/300",
            "https://picsum.photos/seed/inc2/400/300",
            "https://picsum.photos/seed/inc3/400/300",
          ].join("\n")}
        />
      </div>
    </div>
  </>
) : null}
          {/* TEXT */}
          {t === "text" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Texto" value={(parsed as any)?.text ?? ""} onChange={(v) => setField("text", v)} />
            </>
          ) : null}

          {/* CTA */}
          {t === "cta" ? (
            <>
              <FieldText label="Título" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Texto (opcional)" value={(parsed as any)?.text ?? ""} onChange={(v) => setField("text", v)} />
              <div className="grid gap-3 md:grid-cols-2">
                <FieldText label="Texto botón" value={(parsed as any)?.ctaText ?? ""} onChange={(v) => setField("ctaText", v)} />
                <FieldText label="Link botón" value={(parsed as any)?.ctaHref ?? ""} onChange={(v) => setField("ctaHref", v)} />
              </div>
            </>
          ) : null}

          {/* SPACER */}
          {t === "spacer" ? (
            <FieldNumber
              label="Tamaño (px)"
              value={String((parsed as any)?.size ?? 24)}
              onChange={(v) => setField("size", Number(v))}
            />
          ) : null}

          {/* DIVIDER */}
          {t === "divider" ? (
            <FieldText label="Etiqueta (opcional)" value={(parsed as any)?.label ?? ""} onChange={(v) => setField("label", v)} />
          ) : null}

          {/* IMAGETEXT */}
          {t === "imagetext" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Texto" value={(parsed as any)?.text ?? ""} onChange={(v) => setField("text", v)} />
              <div className="grid gap-3 md:grid-cols-2">
                <FieldText label="URL imagen" value={(parsed as any)?.imageUrl ?? ""} onChange={(v) => setField("imageUrl", v)} />
                <FieldText label="Alt (opcional)" value={(parsed as any)?.imageAlt ?? ""} onChange={(v) => setField("imageAlt", v)} />
              </div>
              <FieldSwitch label="Invertir columnas (reverse)" checked={!!(parsed as any)?.reverse} onChange={(v) => setField("reverse", v)} />
            </>
          ) : null}

{/* VIDEOTEXT */}
{t === "videotext" ? (
  <>
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <label className="text-xs text-neutral-400">Layout</label>
        <select
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
          value={String((parsed as any)?.layout ?? "split")}
          onChange={(e) => setField("layout", e.target.value)}
        >
          <option value="split">split</option>
          <option value="stacked">stacked</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-neutral-400">Alineación de texto</label>
        <select
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
          value={String((parsed as any)?.textAlign ?? "left")}
          onChange={(e) => setField("textAlign", e.target.value)}
        >
          <option value="left">left</option>
          <option value="center">center</option>
        </select>
      </div>
    </div>

    <FieldText label="Badge / Eyebrow (opcional)" value={(parsed as any)?.badge ?? ""} onChange={(v) => setField("badge", v)} />
    <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
    <FieldTextarea label="Subtítulo (opcional)" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />
    <FieldTextarea label="Texto adicional (opcional)" value={(parsed as any)?.text ?? ""} onChange={(v) => setField("text", v)} />
    <FieldText
      label="Video de YouTube (ID, embed o URL)"
      value={(parsed as any)?.videoUrl ?? ""}
      onChange={(v) => setField("videoUrl", v)}
    />

    {String((parsed as any)?.layout ?? "split") === "split" ? (
      <FieldSwitch
        label="Invertir columnas (reverse)"
        checked={!!(parsed as any)?.reverse}
        onChange={(v) => setField("reverse", v)}
      />
    ) : null}

    <div className="grid gap-3 md:grid-cols-2">
      <FieldText label="Texto botón (opcional)" value={(parsed as any)?.ctaText ?? ""} onChange={(v) => setField("ctaText", v)} />
      <FieldText label="Link botón (opcional)" value={(parsed as any)?.ctaHref ?? ""} onChange={(v) => setField("ctaHref", v)} />
    </div>
  </>
) : null}
{/* PRODUCTSGRID */}
{t === "productsgrid" ? (
  <>
    <FieldText
      label="Título (opcional)"
      value={(parsed as any)?.title ?? ""}
      onChange={(v) => setField("title", v)}
    />

    <FieldTextarea
      label="Subtítulo (opcional)"
      value={(parsed as any)?.subtitle ?? ""}
      onChange={(v) => setField("subtitle", v)}
    />

    {/* ✅ NUEVO: Fuente */}
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <label className="text-xs text-neutral-400">Fuente de productos</label>
        <select
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
          value={String((parsed as any)?.source ?? "slugs")}
          onChange={(e) => setField("source", e.target.value)}
        >
          <option value="slugs">Manual (por slugs)</option>
          <option value="featured">Destacados (featured)</option>
        </select>
        <div className="mt-1 text-xs text-neutral-500">
          Manual: pegas slugs. / Destacados: trae productos marcados como featured.
        </div>
      </div>

      {/* ✅ NUEVO: Límite */}
      {String((parsed as any)?.source ?? "slugs") === "featured" ? (
        <div>
          <label className="text-xs text-neutral-400">Límite (cantidad)</label>
          <input
            type="number"
            min={1}
            max={48}
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
            value={String((parsed as any)?.featuredLimit ?? 8)}
            onChange={(e) => setField("featuredLimit", Number(e.target.value))}
          />
          <div className="mt-1 text-xs text-neutral-500">
            Recomendado: 8 o 12. Depende del layout y columnas.
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>

    {/* ✅ Solo mostrar slugs si source = slugs */}
    {String((parsed as any)?.source ?? "slugs") !== "featured" ? (
      <div>
        <label className="text-xs text-neutral-400">
          Productos (slugs) — 1 por línea
        </label>

        <textarea
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
          rows={6}
          value={
            Array.isArray((parsed as any)?.productSlugs)
              ? (parsed as any).productSlugs.join("\n")
              : ""
          }
          onChange={(e) => {
            const lines = e.target.value
              .split(/\r?\n/)
              .map((x) => x.trim())
              .filter(Boolean);

            setField("productSlugs", lines);
          }}
          placeholder={[
            "ticketera-termica-80mm",
            "rollo-termico-80mm",
            "sistema-apiworking-pos",
            "pack-ticketera-rollos",
          ].join("\n")}
        />

        <div className="mt-1 text-xs text-neutral-500">
          Tip: pega slugs tal cual están en el catálogo. Luego lo haremos con selector visual.
        </div>
      </div>
    ) : null}

    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <label className="text-xs text-neutral-400">Columnas</label>
        <select
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
          value={String((parsed as any)?.columns ?? 4)}
          onChange={(e) => setField("columns", Number(e.target.value))}
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <div className="grid gap-3">
        <FieldSwitch
          label="Mostrar precio"
          checked={(parsed as any)?.showPrice !== false}
          onChange={(v) => setField("showPrice", v)}
        />
        <FieldSwitch
          label="Mostrar botón (Agregar al carrito)"
          checked={(parsed as any)?.showAddToCart !== false}
          onChange={(v) => setField("showAddToCart", v)}
        />
      </div>
    </div>
  </>
) : null}
{/* CARDSGRID */}
{t === "cardsgrid" ? (
  <>
    <FieldText label="Título" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
    <FieldTextarea label="Subtítulo (opcional)" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />

    <div>
      <label className="text-xs text-neutral-400">Columnas</label>
      <select
        className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
        value={String((parsed as any)?.columns ?? 3)}
        onChange={(e) => setField("columns", Number(e.target.value))}
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <div className="mt-1 text-xs text-neutral-500">En desktop se verá como 2/3/4 columnas; en móvil baja automático.</div>
    </div>

    <SortableList
      title="Tarjetas"
      items={getArray("cards")}
      onItemsChange={(next) => setArray("cards", next)}
      createItem={() => ({ __key: genKey("cards"), imageUrl: "", imageAlt: "", title: "", text: "", ctaText: "Ver más", ctaHref: "" })}
      renderFields={(c, patch) => (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <FieldText label="Image URL" value={c?.imageUrl ?? ""} onChange={(v) => patch({ imageUrl: v })} />
            <FieldText label="Alt (opcional)" value={c?.imageAlt ?? ""} onChange={(v) => patch({ imageAlt: v })} />
          </div>
          <FieldText label="Título" value={c?.title ?? ""} onChange={(v) => patch({ title: v })} />
          <FieldTextarea label="Texto (opcional)" value={c?.text ?? ""} onChange={(v) => patch({ text: v })} />
          <div className="grid gap-3 md:grid-cols-2">
            <FieldText label="Botón texto (opcional)" value={c?.ctaText ?? ""} onChange={(v) => patch({ ctaText: v })} />
            <FieldText label="Botón link (opcional)" value={c?.ctaHref ?? ""} onChange={(v) => patch({ ctaHref: v })} />
          </div>
        </>
      )}
    />
  </>
) : null}
{/* CTASPLIT */}
{t === "ctasplit" ? (
  <>
    <FieldText label="Título" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
    <FieldTextarea label="Subtítulo" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />

    <div className="rounded-2xl border border-neutral-800 bg-black/10 p-3">
      <div className="text-sm font-extrabold text-neutral-200">Botones (CTA)</div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <FieldText
          label="CTA principal - Texto"
          value={(parsed as any)?.primaryCta?.text ?? ""}
          onChange={(v) => setField("primaryCta", { ...(parsed as any)?.primaryCta, text: v, href: (parsed as any)?.primaryCta?.href ?? "" })}
        />
        <FieldText
          label="CTA principal - Link"
          value={(parsed as any)?.primaryCta?.href ?? ""}
          onChange={(v) => setField("primaryCta", { ...(parsed as any)?.primaryCta, href: v, text: (parsed as any)?.primaryCta?.text ?? "" })}
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <FieldText
          label="CTA secundario - Texto (opcional)"
          value={(parsed as any)?.secondaryCta?.text ?? ""}
          onChange={(v) => setField("secondaryCta", { ...(parsed as any)?.secondaryCta, text: v, href: (parsed as any)?.secondaryCta?.href ?? "" })}
        />
        <FieldText
          label="CTA secundario - Link (opcional)"
          value={(parsed as any)?.secondaryCta?.href ?? ""}
          onChange={(v) => setField("secondaryCta", { ...(parsed as any)?.secondaryCta, href: v, text: (parsed as any)?.secondaryCta?.text ?? "" })}
        />
      </div>
    </div>

    <SortableList
      title="Slides (slider)"
      items={getArray("slides")}
      onItemsChange={(next) => setArray("slides", next)}
      createItem={() => ({ __key: genKey("slides"), imageUrl: "", alt: "", caption: "", href: "" })}
      renderFields={(s, patch) => (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <FieldText label="Image URL" value={s?.imageUrl ?? ""} onChange={(v) => patch({ imageUrl: v })} />
            <FieldText label="Alt (opcional)" value={s?.alt ?? ""} onChange={(v) => patch({ alt: v })} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <FieldText label="Caption (opcional)" value={s?.caption ?? ""} onChange={(v) => patch({ caption: v })} />
            <FieldText label="Href (opcional)" value={s?.href ?? ""} onChange={(v) => patch({ href: v })} />
          </div>
        </>
      )}
    />
  </>
) : null}
          {/* FEATURES (DnD) */}
          {t === "features" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Subtítulo (opcional)" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />

              <SortableList
                title="Items (tarjetas)"
                items={getArray("items")}
                onItemsChange={(next) => setArray("items", next)}
                createItem={() => ({ __key: genKey("items"), title: "", text: "", icon: "" })}
                renderFields={(it, patch) => (
                  <>
                    <div className="grid gap-3 md:grid-cols-3">
                      <FieldText label="Título" value={it?.title ?? ""} onChange={(v) => patch({ title: v })} />
                      <FieldText label="Icon (emoji opcional)" value={it?.icon ?? ""} onChange={(v) => patch({ icon: v })} />
                      <div className="md:col-span-3">
                        <FieldTextarea label="Texto" value={it?.text ?? ""} onChange={(v) => patch({ text: v })} />
                      </div>
                    </div>
                  </>
                )}
              />
            </>
          ) : null}

          {/* STATS (DnD) */}
          {t === "stats" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <SortableList
                title="Items (números)"
                items={getArray("items")}
                onItemsChange={(next) => setArray("items", next)}
                createItem={() => ({ __key: genKey("items"), value: "", label: "" })}
                renderFields={(it, patch) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldText label="Valor" value={it?.value ?? ""} onChange={(v) => patch({ value: v })} />
                    <FieldText label="Etiqueta" value={it?.label ?? ""} onChange={(v) => patch({ label: v })} />
                  </div>
                )}
              />
            </>
          ) : null}

          {/* FAQ (DnD) */}
          {t === "faq" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <SortableList
                title="Preguntas"
                items={getArray("items")}
                onItemsChange={(next) => setArray("items", next)}
                createItem={() => ({ __key: genKey("items"), question: "", answer: "" })}
                renderFields={(it, patch) => (
                  <>
                    <FieldText label="Pregunta" value={it?.question ?? ""} onChange={(v) => patch({ question: v })} />
                    <FieldTextarea label="Respuesta" value={it?.answer ?? ""} onChange={(v) => patch({ answer: v })} />
                  </>
                )}
              />
            </>
          ) : null}

          {/* TESTIMONIALS (DnD) */}
          {t === "testimonials" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <SortableList
                title="Testimonios"
                items={getArray("items")}
                onItemsChange={(next) => setArray("items", next)}
                createItem={() => ({ __key: genKey("items"), name: "", role: "", text: "", avatarUrl: "" })}
                renderFields={(it, patch) => (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldText label="Nombre" value={it?.name ?? ""} onChange={(v) => patch({ name: v })} />
                      <FieldText label="Rol/Empresa (opcional)" value={it?.role ?? ""} onChange={(v) => patch({ role: v })} />
                    </div>
                    <FieldTextarea label="Texto" value={it?.text ?? ""} onChange={(v) => patch({ text: v })} />
                    <FieldText label="Avatar URL (opcional)" value={it?.avatarUrl ?? ""} onChange={(v) => patch({ avatarUrl: v })} />
                  </>
                )}
              />
            </>
          ) : null}

          {/* LOGOS (DnD) */}
          {t === "logos" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <SortableList
                title="Logos"
                items={getArray("logos")}
                onItemsChange={(next) => setArray("logos", next)}
                createItem={() => ({ __key: genKey("logos"), imageUrl: "", alt: "", href: "" })}
                renderFields={(it, patch) => (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldText label="Image URL" value={it?.imageUrl ?? ""} onChange={(v) => patch({ imageUrl: v })} />
                      <FieldText label="Alt (opcional)" value={it?.alt ?? ""} onChange={(v) => patch({ alt: v })} />
                    </div>
                    <FieldText label="Href (opcional)" value={it?.href ?? ""} onChange={(v) => patch({ href: v })} />
                  </>
                )}
              />
            </>
          ) : null}

          {/* CAROUSEL (DnD) */}
          {t === "carousel" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <SortableList
                title="Slides"
                items={getArray("items")}
                onItemsChange={(next) => setArray("items", next)}
                createItem={() => ({ __key: genKey("items"), imageUrl: "", alt: "", caption: "", href: "" })}
                renderFields={(it, patch) => (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldText label="Image URL" value={it?.imageUrl ?? ""} onChange={(v) => patch({ imageUrl: v })} />
                      <FieldText label="Alt (opcional)" value={it?.alt ?? ""} onChange={(v) => patch({ alt: v })} />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldText label="Caption (opcional)" value={it?.caption ?? ""} onChange={(v) => patch({ caption: v })} />
                      <FieldText label="Href (opcional)" value={it?.href ?? ""} onChange={(v) => patch({ href: v })} />
                    </div>
                  </>
                )}
              />
            </>
          ) : null}

          {/* PRICING (DnD planes) */}
          {t === "pricing" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Subtítulo (opcional)" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />

              <SortableList
                title="Planes"
                items={getArray("plans")}
                onItemsChange={(next) => setArray("plans", next)}
                createItem={() => ({
                  __key: genKey("plans"),
                  name: "",
                  price: "",
                  period: "",
                  highlighted: false,
                  ctaText: "",
                  ctaHref: "",
                  features: [],
                })}
                renderFields={(p, patch) => (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldText label="Nombre" value={p?.name ?? ""} onChange={(v) => patch({ name: v })} />
                      <FieldText label="Precio" value={p?.price ?? ""} onChange={(v) => patch({ price: v })} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldText label="Periodo (opcional)" value={p?.period ?? ""} onChange={(v) => patch({ period: v })} />
                      <FieldSwitch label="Destacado" checked={!!p?.highlighted} onChange={(v) => patch({ highlighted: v })} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <FieldText label="CTA Text (opcional)" value={p?.ctaText ?? ""} onChange={(v) => patch({ ctaText: v })} />
                      <FieldText label="CTA Href (opcional)" value={p?.ctaHref ?? ""} onChange={(v) => patch({ ctaHref: v })} />
                    </div>

                    <div className="rounded-xl border border-neutral-800 bg-black/10 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold text-neutral-200">Features</div>
                        <button
                          type="button"
                          className="rounded-xl border border-neutral-800 px-3 py-2 text-xs hover:bg-neutral-900/40"
                          onClick={() => patch({ features: [...(Array.isArray(p?.features) ? p.features : []), ""] })}
                        >
                          + Agregar
                        </button>
                      </div>

                      {(Array.isArray(p?.features) ? p.features : []).map((f: string, i: number) => (
                        <div key={i} className="mt-2 flex items-center gap-2">
                          <input
                            className="w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
                            value={f}
                            onChange={(e) => {
                              const next = (Array.isArray(p?.features) ? p.features : []).slice();
                              next[i] = e.target.value;
                              patch({ features: next });
                            }}
                          />
                          <button
                            type="button"
                            className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200"
                            onClick={() => {
                              const next = (Array.isArray(p?.features) ? p.features : []).slice().filter((_: any, idx: number) => idx !== i);
                              patch({ features: next });
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              />
            </>
          ) : null}
          {/* PRICINGTABS */}
{t === "pricingtabs" ? (
  <>
    <FieldText label="Eyebrow (opcional)" value={(parsed as any)?.eyebrow ?? ""} onChange={(v) => setField("eyebrow", v)} />
    <FieldText label="Título" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
    <FieldTextarea label="Subtítulo" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />

    <div className="grid gap-3 md:grid-cols-2">
      <FieldText
        label="Botón info (opcional) - Texto"
        value={(parsed as any)?.infoCta?.text ?? ""}
        onChange={(v) => setField("infoCta", { ...(parsed as any)?.infoCta, text: v, href: (parsed as any)?.infoCta?.href ?? "" })}
      />
      <FieldText
        label="Botón info (opcional) - Link"
        value={(parsed as any)?.infoCta?.href ?? ""}
        onChange={(v) => setField("infoCta", { ...(parsed as any)?.infoCta, href: v, text: (parsed as any)?.infoCta?.text ?? "" })}
      />
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <FieldText label="Currency (PEN)" value={(parsed as any)?.currency ?? "PEN"} onChange={(v) => setField("currency", v)} />

      <div>
        <label className="text-xs text-neutral-400">Default tab</label>
        <select
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
          value={(parsed as any)?.defaultBilling ?? ""}
          onChange={(e) => setField("defaultBilling", e.target.value)}
        >
          <option value="">(Primero)</option>
          {getArray("billingOptions").map((b: any) => (
            <option key={b?.__key || b?.key} value={b?.key || ""}>
              {b?.label || b?.key || "tab"}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Tabs editor */}
    <SortableList
      title="Tabs (Mensuales / Semestrales / Anuales...)"
      items={getArray("billingOptions")}
      onItemsChange={(next) => setArray("billingOptions", next)}
      createItem={() => ({ __key: genKey("billingOptions"), key: "", label: "", unit: "" })}
      renderFields={(b, patch) => (
        <div className="grid gap-3 md:grid-cols-3">
          <FieldText label="Key (ej: monthly)" value={b?.key ?? ""} onChange={(v) => patch({ key: v })} />
          <FieldText label="Label (ej: Mensuales)" value={b?.label ?? ""} onChange={(v) => patch({ label: v })} />
          <FieldText label="Unit (opcional) ej: /mes" value={b?.unit ?? ""} onChange={(v) => patch({ unit: v })} />
        </div>
      )}
    />

    {/* Plans editor */}
    <SortableList
      title="Planes"
      items={getArray("plans")}
      onItemsChange={(next) => setArray("plans", next)}
      createItem={() => ({
        __key: genKey("plans"),
        name: "",
        badge: "",
        highlighted: false,
        ctaText: "Comenzar ahora",
        ctaHref: "/contacto",
        features: [],
        pricing: {},
      })}
      renderFields={(p, patch) => {
        const billing = getArray("billingOptions");
        const pricing = p?.pricing && typeof p.pricing === "object" ? p.pricing : {};
        const featuresArr = Array.isArray(p?.features) ? p.features : [];

        function setPrice(billingKey: string, key: "normal" | "promo", value: string) {
          const num = Number(value);
          const prevForKey = pricing[billingKey] && typeof pricing[billingKey] === "object" ? pricing[billingKey] : {};
          const nextForKey: any = { ...prevForKey };

          if (value === "") {
            delete nextForKey[key];
          } else {
            nextForKey[key] = Number.isNaN(num) ? 0 : num;
          }

          const nextPricing: any = { ...pricing, [billingKey]: nextForKey };
          patch({ pricing: nextPricing });
        }

        return (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <FieldText label="Nombre" value={p?.name ?? ""} onChange={(v) => patch({ name: v })} />
              <FieldText label="Badge (opcional)" value={p?.badge ?? ""} onChange={(v) => patch({ badge: v })} />
            </div>

            <FieldSwitch label="Destacado (Más popular)" checked={!!p?.highlighted} onChange={(v) => patch({ highlighted: v })} />

            <div className="grid gap-3 md:grid-cols-2">
              <FieldText label="CTA Text" value={p?.ctaText ?? ""} onChange={(v) => patch({ ctaText: v })} />
              <FieldText label="CTA Href" value={p?.ctaHref ?? ""} onChange={(v) => patch({ ctaHref: v })} />
            </div>

            {/* Tabla de precios por tab */}
            <div className="rounded-2xl border border-neutral-800 bg-black/10 p-3">
              <div className="text-sm font-extrabold text-neutral-200">Precios por periodo</div>

              {!billing.length ? (
                <div className="mt-2 text-xs text-neutral-400">Primero agrega Tabs (billingOptions).</div>
              ) : (
                <div className="mt-3 grid gap-3">
                  {billing.map((b: any) => {
                    const k = String(b?.key || "");
                    if (!k) return null;
                    const row = pricing[k] || {};
                    return (
                      <div key={b?.__key || k} className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-xl border border-neutral-800 bg-black/20 px-3 py-2 text-sm text-neutral-200">
                          {b?.label || k}
                        </div>

                        <div>
                          <label className="text-xs text-neutral-400">Normal</label>
                          <input
                            type="number"
                            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
                            value={row?.normal ?? ""}
                            onChange={(e) => setPrice(k, "normal", e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-neutral-400">Promo (opcional)</label>
                          <input
                            type="number"
                            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
                            value={row?.promo ?? ""}
                            onChange={(e) => setPrice(k, "promo", e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Features (lista simple) */}
            <div className="rounded-2xl border border-neutral-800 bg-black/10 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-neutral-200">Beneficios (features)</div>
                <button
                  type="button"
                  className="rounded-xl border border-neutral-800 px-3 py-2 text-xs hover:bg-neutral-900/40"
                  onClick={() => patch({ features: [...featuresArr, ""] })}
                >
                  + Agregar
                </button>
              </div>

              {featuresArr.length ? (
                featuresArr.map((f: string, i: number) => (
                  <div key={i} className="mt-2 flex items-center gap-2">
                    <input
                      className="w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
                      value={f}
                      onChange={(e) => {
                        const next = featuresArr.slice();
                        next[i] = e.target.value;
                        patch({ features: next });
                      }}
                    />
                    <button
                      type="button"
                      className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200"
                      onClick={() => {
                        const next = featuresArr.slice().filter((_: any, idx: number) => idx !== i);
                        patch({ features: next });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="mt-2 text-xs text-neutral-400">Agrega beneficios para este plan.</div>
              )}
            </div>
          </>
        );
      }}
    />

    <FieldTextarea label="Nota (opcional)" value={(parsed as any)?.note ?? ""} onChange={(v) => setField("note", v)} />
  </>
) : null}
{/* CONTACTFORM / CONTACTFORMSPLIT */}
{t === "contactform" || t === "contactformsplit" ? (
  <>
    <FieldText
      label="Título"
      value={(parsed as any)?.title ?? ""}
      onChange={(v) => setField("title", v)}
    />

    <FieldTextarea
      label="Subtítulo"
      value={(parsed as any)?.subtitle ?? ""}
      onChange={(v) => setField("subtitle", v)}
    />

    {/* Bullets */}
    <div>
      <label className="text-xs text-neutral-400">Beneficios (bullets) — 1 por línea</label>
      <textarea
        className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
        rows={5}
        value={
          Array.isArray((parsed as any)?.bullets)
            ? (parsed as any).bullets.map((x: any) => String(x ?? "")).filter((x: string) => x.trim()).join("\n")
            : ""
        }
        onChange={(e) => {
          const lines = e.target.value
            .split(/\r?\n/)
            .map((x) => x.trim())
            .filter(Boolean);
          setField("bullets", lines);
        }}
        placeholder={[
          "Integración con SUNAT y reporte contable",
          "Inventario con unidades, lotes y vencimientos",
          "Catálogo QR y cotización por WhatsApp",
          "Soporte rápido por WhatsApp y video",
        ].join("\n")}
      />
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <FieldText
        label="Título del formulario (formTitle)"
        value={(parsed as any)?.formTitle ?? ""}
        onChange={(v) => setField("formTitle", v)}
      />

      <div>
        <label className="text-xs text-neutral-400">Opciones giro negocio — 1 por línea</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
          rows={4}
          value={
            Array.isArray((parsed as any)?.giroOptions)
              ? (parsed as any).giroOptions.map((x: any) => String(x ?? "")).filter((x: string) => x.trim()).join("\n")
              : ""
          }
          onChange={(e) => {
            const lines = e.target.value
              .split(/\r?\n/)
              .map((x) => x.trim())
              .filter(Boolean);
            setField("giroOptions", lines);
          }}
          placeholder={["resto", "tienda", "hotel", "otros"].join("\n")}
        />
      </div>
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <FieldText
        label="Texto botón Enviar"
        value={(parsed as any)?.primaryCtaText ?? ""}
        onChange={(v) => setField("primaryCtaText", v)}
      />
      <FieldText
        label="Texto botón Limpiar"
        value={(parsed as any)?.secondaryCtaText ?? ""}
        onChange={(v) => setField("secondaryCtaText", v)}
      />
    </div>

    {/* Extras solo para split */}
    {t === "contactformsplit" ? (
      <div className="rounded-2xl border border-neutral-800 bg-black/10 p-3">
        <div className="text-sm font-extrabold text-neutral-200">Imagen (solo split)</div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <FieldText
            label="Image URL"
            value={(parsed as any)?.imageUrl ?? ""}
            onChange={(v) => setField("imageUrl", v)}
          />
          <FieldText
            label="Image Alt (opcional)"
            value={(parsed as any)?.imageAlt ?? ""}
            onChange={(v) => setField("imageAlt", v)}
          />
        </div>
      </div>
    ) : null}
  </>
) : null}
        </div>
      ) : null}

      {showJson || forceJson ? (
        <div className="mt-4">
          <label className="text-xs text-neutral-400">dataJson (avanzado)</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
            rows={10}
            value={dataJson}
            onChange={(e) => onChangeDataJson(e.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}

/* ===== mini fields ===== */

function FieldText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-neutral-400">{label}</label>
      <input
        className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-neutral-400">{label}</label>
      <textarea
        className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FieldNumber({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-neutral-400">{label}</label>
      <input
        type="number"
        className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FieldSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-black/20 p-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-neutral-200">{label}</span>
    </label>
  );
}