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
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Texto" value={(parsed as any)?.text ?? ""} onChange={(v) => setField("text", v)} />
              <FieldText label="URL embed del video" value={(parsed as any)?.videoUrl ?? ""} onChange={(v) => setField("videoUrl", v)} />
              <FieldSwitch label="Invertir columnas (reverse)" checked={!!(parsed as any)?.reverse} onChange={(v) => setField("reverse", v)} />
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