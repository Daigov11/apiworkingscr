"use client";

import { useMemo, useState } from "react";

function safeParse(json: string) {
  try {
    const v = JSON.parse(json || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return null; // inválido
  }
}

function stringify(obj: any) {
  return JSON.stringify(obj ?? {}, null, 2);
}

type Props = {
  type: string;
  dataJson: string;
  onChangeDataJson: (next: string) => void;
};

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
    "faq",
    "testimonials",
    "stats",
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

  function moveItem(key: string, idx: number, dir: -1 | 1) {
    const arr = getArray(key).slice();
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    const tmp = arr[idx];
    arr[idx] = arr[target];
    arr[target] = tmp;
    setArray(key, arr);
  }

  function removeItem(key: string, idx: number) {
    const arr = getArray(key).slice().filter((_: any, i: number) => i !== idx);
    setArray(key, arr);
  }

  function updateItem(key: string, idx: number, patch: any) {
    const arr = getArray(key).slice();
    arr[idx] = { ...(arr[idx] || {}), ...patch };
    setArray(key, arr);
  }

  function addItem(key: string, item: any) {
    const arr = getArray(key).slice();
    arr.push(item);
    setArray(key, arr);
  }

  function setBool(key: string, value: boolean) {
    setField(key, value);
  }

  function setNumber(key: string, value: string) {
    const n = Number(value);
    setField(key, Number.isFinite(n) ? n : 0);
  }

  // ===== pricing nested helpers =====
  function getPlans() {
    return getArray("plans");
  }

  function setPlans(plans: any[]) {
    setArray("plans", plans);
  }

  function updatePlan(planIdx: number, patch: any) {
    const plans = getPlans().slice();
    plans[planIdx] = { ...(plans[planIdx] || {}), ...patch };
    setPlans(plans);
  }

  function removePlan(planIdx: number) {
    const plans = getPlans().slice().filter((_: any, i: number) => i !== planIdx);
    setPlans(plans);
  }

  function movePlan(planIdx: number, dir: -1 | 1) {
    const plans = getPlans().slice();
    const target = planIdx + dir;
    if (target < 0 || target >= plans.length) return;
    const tmp = plans[planIdx];
    plans[planIdx] = plans[target];
    plans[target] = tmp;
    setPlans(plans);
  }

  function addPlan() {
    const plans = getPlans().slice();
    plans.push({
      name: "",
      price: "",
      period: "",
      highlighted: false,
      ctaText: "",
      ctaHref: "",
      features: [],
    });
    setPlans(plans);
  }

  function getPlanFeatures(planIdx: number): string[] {
    const plans = getPlans();
    const f = plans?.[planIdx]?.features;
    return Array.isArray(f) ? f : [];
  }

  function setPlanFeatures(planIdx: number, features: string[]) {
    updatePlan(planIdx, { features });
  }

  function addPlanFeature(planIdx: number) {
    const f = getPlanFeatures(planIdx).slice();
    f.push("");
    setPlanFeatures(planIdx, f);
  }

  function removePlanFeature(planIdx: number, featIdx: number) {
    const f = getPlanFeatures(planIdx).slice().filter((_, i) => i !== featIdx);
    setPlanFeatures(planIdx, f);
  }

  function movePlanFeature(planIdx: number, featIdx: number, dir: -1 | 1) {
    const f = getPlanFeatures(planIdx).slice();
    const target = featIdx + dir;
    if (target < 0 || target >= f.length) return;
    const tmp = f[featIdx];
    f[featIdx] = f[target];
    f[target] = tmp;
    setPlanFeatures(planIdx, f);
  }

  function updatePlanFeature(planIdx: number, featIdx: number, value: string) {
    const f = getPlanFeatures(planIdx).slice();
    f[featIdx] = value;
    setPlanFeatures(planIdx, f);
  }

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
            <FieldNumber label="Tamaño (px)" value={String((parsed as any)?.size ?? 24)} onChange={(v) => setNumber("size", v)} />
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
              <FieldSwitch label="Invertir columnas (reverse)" checked={!!(parsed as any)?.reverse} onChange={(v) => setBool("reverse", v)} />
            </>
          ) : null}

          {/* VIDEOTEXT */}
          {t === "videotext" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Texto" value={(parsed as any)?.text ?? ""} onChange={(v) => setField("text", v)} />
              <FieldText label="URL embed del video" value={(parsed as any)?.videoUrl ?? ""} onChange={(v) => setField("videoUrl", v)} />
              <FieldSwitch label="Invertir columnas (reverse)" checked={!!(parsed as any)?.reverse} onChange={(v) => setBool("reverse", v)} />
            </>
          ) : null}

          {/* FEATURES list */}
          {t === "features" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Subtítulo (opcional)" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />

              <ListHeader title="Items (tarjetas)" onAdd={() => addItem("items", { title: "", text: "", icon: "" })} />

              {getArray("items").map((it: any, idx: number) => (
                <ListCard key={idx} index={idx} onUp={() => moveItem("items", idx, -1)} onDown={() => moveItem("items", idx, 1)} onRemove={() => removeItem("items", idx)}>
                  <div className="grid gap-3 md:grid-cols-3">
                    <FieldText label="Título" value={it?.title ?? ""} onChange={(v) => updateItem("items", idx, { title: v })} />
                    <FieldText label="Icon (emoji opcional)" value={it?.icon ?? ""} onChange={(v) => updateItem("items", idx, { icon: v })} />
                    <div className="md:col-span-3">
                      <FieldTextarea label="Texto" value={it?.text ?? ""} onChange={(v) => updateItem("items", idx, { text: v })} />
                    </div>
                  </div>
                </ListCard>
              ))}

              {!getArray("items").length ? <EmptyHint text='No hay items. Usa "Agregar".' /> : null}
            </>
          ) : null}

          {/* STATS list */}
          {t === "stats" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />

              <ListHeader title="Items (números)" onAdd={() => addItem("items", { value: "", label: "" })} />

              {getArray("items").map((it: any, idx: number) => (
                <ListCard key={idx} index={idx} onUp={() => moveItem("items", idx, -1)} onDown={() => moveItem("items", idx, 1)} onRemove={() => removeItem("items", idx)}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldText label="Valor (ej: 99.9%)" value={it?.value ?? ""} onChange={(v) => updateItem("items", idx, { value: v })} />
                    <FieldText label="Etiqueta" value={it?.label ?? ""} onChange={(v) => updateItem("items", idx, { label: v })} />
                  </div>
                </ListCard>
              ))}

              {!getArray("items").length ? <EmptyHint text='No hay números. Usa "Agregar".' /> : null}
            </>
          ) : null}

          {/* FAQ list */}
          {t === "faq" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />

              <ListHeader title="Preguntas" onAdd={() => addItem("items", { question: "", answer: "" })} />

              {getArray("items").map((it: any, idx: number) => (
                <ListCard key={idx} index={idx} onUp={() => moveItem("items", idx, -1)} onDown={() => moveItem("items", idx, 1)} onRemove={() => removeItem("items", idx)}>
                  <FieldText label="Pregunta" value={it?.question ?? ""} onChange={(v) => updateItem("items", idx, { question: v })} />
                  <FieldTextarea label="Respuesta" value={it?.answer ?? ""} onChange={(v) => updateItem("items", idx, { answer: v })} />
                </ListCard>
              ))}

              {!getArray("items").length ? <EmptyHint text='No hay preguntas. Usa "Agregar".' /> : null}
            </>
          ) : null}

          {/* TESTIMONIALS list */}
          {t === "testimonials" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />

              <ListHeader title="Testimonios" onAdd={() => addItem("items", { name: "", role: "", text: "", avatarUrl: "" })} />

              {getArray("items").map((it: any, idx: number) => (
                <ListCard key={idx} index={idx} onUp={() => moveItem("items", idx, -1)} onDown={() => moveItem("items", idx, 1)} onRemove={() => removeItem("items", idx)}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldText label="Nombre" value={it?.name ?? ""} onChange={(v) => updateItem("items", idx, { name: v })} />
                    <FieldText label="Rol/Empresa (opcional)" value={it?.role ?? ""} onChange={(v) => updateItem("items", idx, { role: v })} />
                  </div>
                  <FieldTextarea label="Texto" value={it?.text ?? ""} onChange={(v) => updateItem("items", idx, { text: v })} />
                  <FieldText label="Avatar URL (opcional)" value={it?.avatarUrl ?? ""} onChange={(v) => updateItem("items", idx, { avatarUrl: v })} />
                </ListCard>
              ))}

              {!getArray("items").length ? <EmptyHint text='No hay testimonios. Usa "Agregar".' /> : null}
            </>
          ) : null}

          {/* LOGOS list */}
          {t === "logos" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />

              <ListHeader title="Logos" onAdd={() => addItem("logos", { imageUrl: "", alt: "", href: "" })} />

              {getArray("logos").map((it: any, idx: number) => (
                <ListCard key={idx} index={idx} onUp={() => moveItem("logos", idx, -1)} onDown={() => moveItem("logos", idx, 1)} onRemove={() => removeItem("logos", idx)}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldText label="Image URL" value={it?.imageUrl ?? ""} onChange={(v) => updateItem("logos", idx, { imageUrl: v })} />
                    <FieldText label="Alt (opcional)" value={it?.alt ?? ""} onChange={(v) => updateItem("logos", idx, { alt: v })} />
                  </div>
                  <FieldText label="Href (opcional)" value={it?.href ?? ""} onChange={(v) => updateItem("logos", idx, { href: v })} />
                </ListCard>
              ))}

              {!getArray("logos").length ? <EmptyHint text='No hay logos. Usa "Agregar".' /> : null}
            </>
          ) : null}

          {/* CAROUSEL list */}
          {t === "carousel" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />

              <ListHeader title="Slides" onAdd={() => addItem("items", { imageUrl: "", alt: "", caption: "", href: "" })} />

              {getArray("items").map((it: any, idx: number) => (
                <ListCard key={idx} index={idx} onUp={() => moveItem("items", idx, -1)} onDown={() => moveItem("items", idx, 1)} onRemove={() => removeItem("items", idx)}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldText label="Image URL" value={it?.imageUrl ?? ""} onChange={(v) => updateItem("items", idx, { imageUrl: v })} />
                    <FieldText label="Alt (opcional)" value={it?.alt ?? ""} onChange={(v) => updateItem("items", idx, { alt: v })} />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldText label="Caption (opcional)" value={it?.caption ?? ""} onChange={(v) => updateItem("items", idx, { caption: v })} />
                    <FieldText label="Href (opcional)" value={it?.href ?? ""} onChange={(v) => updateItem("items", idx, { href: v })} />
                  </div>
                </ListCard>
              ))}

              {!getArray("items").length ? <EmptyHint text='No hay slides. Usa "Agregar".' /> : null}
            </>
          ) : null}

          {/* PRICING list + nested features */}
          {t === "pricing" ? (
            <>
              <FieldText label="Título (opcional)" value={(parsed as any)?.title ?? ""} onChange={(v) => setField("title", v)} />
              <FieldTextarea label="Subtítulo (opcional)" value={(parsed as any)?.subtitle ?? ""} onChange={(v) => setField("subtitle", v)} />

              <ListHeader title="Planes" onAdd={addPlan} />

              {getPlans().map((p: any, idx: number) => (
                <div key={idx} className="mt-3 rounded-2xl border border-neutral-800 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="text-xs font-bold text-neutral-400">Plan #{idx + 1}</div>
                    <div className="flex gap-2">
                      <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => movePlan(idx, -1)}>↑</button>
                      <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => movePlan(idx, 1)}>↓</button>
                      <button type="button" className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200" onClick={() => removePlan(idx)}>Eliminar</button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <FieldText label="Nombre" value={p?.name ?? ""} onChange={(v) => updatePlan(idx, { name: v })} />
                    <FieldText label="Precio" value={p?.price ?? ""} onChange={(v) => updatePlan(idx, { price: v })} />
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <FieldText label="Periodo (opcional, ej: mes)" value={p?.period ?? ""} onChange={(v) => updatePlan(idx, { period: v })} />
                    <FieldSwitch label="Destacado (highlighted)" checked={!!p?.highlighted} onChange={(v) => updatePlan(idx, { highlighted: v })} />
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <FieldText label="CTA Text (opcional)" value={p?.ctaText ?? ""} onChange={(v) => updatePlan(idx, { ctaText: v })} />
                    <FieldText label="CTA Href (opcional)" value={p?.ctaHref ?? ""} onChange={(v) => updatePlan(idx, { ctaHref: v })} />
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-extrabold text-neutral-200">Features</div>
                      <button type="button" className="rounded-xl border border-neutral-800 px-3 py-2 text-xs hover:bg-neutral-900/40" onClick={() => addPlanFeature(idx)}>
                        + Agregar feature
                      </button>
                    </div>

                    {getPlanFeatures(idx).map((f, fi) => (
                      <div key={fi} className="mt-2 flex items-center gap-2">
                        <input
                          className="w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200"
                          value={f}
                          onChange={(e) => updatePlanFeature(idx, fi, e.target.value)}
                          placeholder="Ej: Soporte 24/7"
                        />
                        <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => movePlanFeature(idx, fi, -1)}>↑</button>
                        <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => movePlanFeature(idx, fi, 1)}>↓</button>
                        <button type="button" className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200" onClick={() => removePlanFeature(idx, fi)}>
                          ✕
                        </button>
                      </div>
                    ))}

                    {!getPlanFeatures(idx).length ? <EmptyHint text='No hay features. Agrega al menos 1 si quieres.' /> : null}
                  </div>
                </div>
              ))}

              {!getPlans().length ? <EmptyHint text='No hay planes. Usa "Agregar".' /> : null}
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

/* ====== UI helpers ====== */

function ListHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      <div className="text-sm font-extrabold text-neutral-200">{title}</div>
      <button type="button" className="rounded-xl border border-neutral-800 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900/40" onClick={onAdd}>
        + Agregar
      </button>
    </div>
  );
}

function ListCard({
  index,
  onUp,
  onDown,
  onRemove,
  children,
}: {
  index: number;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-neutral-800 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-neutral-400">Item #{index + 1}</div>
        <div className="flex gap-2">
          <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={onUp}>↑</button>
          <button type="button" className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={onDown}>↓</button>
          <button type="button" className="rounded-lg border border-red-900/40 bg-red-950/20 px-2 py-1 text-xs text-red-200" onClick={onRemove}>
            Eliminar
          </button>
        </div>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-xl border border-neutral-800 bg-black/10 p-3 text-xs text-neutral-400">
      {text}
    </div>
  );
}

/* ====== mini fields ====== */

function FieldText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-neutral-400">{label}</label>
      <input className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-neutral-400">{label}</label>
      <textarea className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200" rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FieldNumber({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-neutral-400">{label}</label>
      <input type="number" className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm text-neutral-200" value={value} onChange={(e) => onChange(e.target.value)} />
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