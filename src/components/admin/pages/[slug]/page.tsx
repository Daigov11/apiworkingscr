"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { PagePayload, SectionInstance } from "@/lib/builder/types";
import { schemaByType } from "@/lib/builder/registry";

function storageKey(slug: string) {
  return `awcmr_page_${slug}`;
}

export default function AdminPageEditor() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [page, setPage] = useState<PagePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const types = useMemo(() => Object.keys(schemaByType), []);

  useEffect(() => {
    async function load() {
      setError(null);

      // 1) si existe en localStorage, usa eso
      const cached = localStorage.getItem(storageKey(slug));
      if (cached) {
        setPage(JSON.parse(cached));
        return;
      }

      // 2) sino, carga del mock público /api/pages/{slug}
      const res = await fetch(`/api/pages/${encodeURIComponent(slug)}`, { cache: "no-store" });
      if (!res.ok) {
        setError(`No se pudo cargar /api/pages/${slug}`);
        return;
      }
      const data = await res.json();
      setPage(data);
    }

    if (slug) load();
  }, [slug]);

  function saveLocal() {
    if (!page) return;
    localStorage.setItem(storageKey(slug), JSON.stringify(page));
    alert("Guardado en localStorage (temporal).");
  }

  function move(idx: number, dir: -1 | 1) {
    if (!page) return;
    const next = [...page.sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    setPage({ ...page, sections: next });
  }

  function addSection(type: string) {
    if (!page) return;
    const id = `sec_${Date.now()}`;
    const newSection: SectionInstance = { id, type, data: {} };
    setPage({ ...page, sections: [...page.sections, newSection] });
  }

  function updateSectionData(idx: number, rawJson: string) {
    if (!page) return;
    try {
      const obj = JSON.parse(rawJson);
      const next = [...page.sections];
      next[idx] = { ...next[idx], data: obj };
      setPage({ ...page, sections: next });
    } catch {
      // no actualiza si JSON inválido
    }
  }

  if (error) return <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-red-200">{error}</div>;
  if (!page) return <div className="text-neutral-300">Cargando…</div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Editar: {slug}</h1>
          <p className="mt-1 text-sm text-neutral-300">Editor temporal (localStorage). Luego se conecta a James.</p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-xl border border-neutral-800 px-3 py-2 hover:bg-neutral-900/40" onClick={saveLocal}>
            Guardar
          </button>
          <a className="rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-black" href={`/${slug}`} target="_blank">
            Ver
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-950/30 p-4">
          <div className="text-sm font-extrabold text-neutral-200">Secciones</div>

          <div className="mt-4 space-y-3">
            {page.sections.map((s, idx) => {
              const schema = schemaByType[s.type];
              const ok = schema ? schema.safeParse(s.data).success : false;

              return (
                <div key={s.id} className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-extrabold">
                      {idx + 1}. {s.type}{" "}
                      <span className={`ml-2 rounded-full px-2 py-1 text-xs ${ok ? "bg-green-900/40 text-green-200" : "bg-yellow-900/40 text-yellow-200"}`}>
                        {ok ? "OK" : "Revisar"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => move(idx, -1)}>↑</button>
                      <button className="rounded-lg border border-neutral-800 px-2 py-1 text-xs" onClick={() => move(idx, 1)}>↓</button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-neutral-400">data (JSON)</label>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 p-3 font-mono text-xs text-neutral-200"
                      rows={6}
                      defaultValue={JSON.stringify(s.data, null, 2)}
                      onChange={(e) => updateSectionData(idx, e.target.value)}
                    />
                    <div className="mt-2 text-xs text-neutral-500">
                      Tip: pega JSON válido. Luego lo reemplazamos por formularios automáticos.
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-4">
          <div className="text-sm font-extrabold text-neutral-200">Agregar sección</div>
          <div className="mt-3 space-y-2">
            {types.map((t) => (
              <button
                key={t}
                className="w-full rounded-xl border border-neutral-800 px-3 py-2 text-left text-sm hover:bg-neutral-900/40"
                onClick={() => addSection(t)}
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}