"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  adminCreatePage,
  adminDeletePage,
  adminGetPage,
  adminListPages,
  adminUpdatePage,
  AdminPageListItem,
} from "@/lib/api/cmsAdmin";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function toInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function formatDate(v?: string) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** ===========================
 *  Plantillas (secciones iniciales)
 *  =========================== */

type CmsSection = {
  sectionKey: string;
  type: string;
  sortOrder: number;
  dataJson: string;
};

type TemplateKey = "none" | "home" | "restaurantes" | "hoteles";

function templateSections(key: TemplateKey): CmsSection[] {
  if (key === "none") return [];

  if (key === "home") {
    return [
      {
        sectionKey: "h1",
        type: "hero",
        sortOrder: 1,
        dataJson: JSON.stringify({
          title: "ApiWorking",
          subtitle: "Sistemas modernos para negocios. Todo editable por módulos.",
          ctaText: "Solicitar demo",
          ctaHref: "/contacto",
        }),
      },
      {
        sectionKey: "h2",
        type: "features",
        sortOrder: 2,
        dataJson: JSON.stringify({
          title: "¿Por qué ApiWorking?",
          subtitle: "Tu web se edita sin tocar código",
          items: [
            { title: "SEO real (SSR)", text: "Google indexa tus páginas por slug.", icon: "🔎" },
            { title: "Page Builder", text: "Agrega, quita y reordena módulos.", icon: "🧩" },
            { title: "Rápido", text: "Cargamos lo pesado cuando toca.", icon: "⚡" },
          ],
        }),
      },
      {
        sectionKey: "h3",
        type: "stats",
        sortOrder: 3,
        dataJson: JSON.stringify({
          title: "Resultados",
          items: [
            { value: "1 min", label: "para editar y publicar" },
            { value: "10+", label: "módulos listos" },
            { value: "SSR", label: "para SEO" },
            { value: "Lazy", label: "para performance" },
          ],
        }),
      },
      {
        sectionKey: "h4",
        type: "logos",
        sortOrder: 4,
        dataJson: JSON.stringify({
          title: "Clientes / Partners",
          logos: [
            { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+1", alt: "Logo 1" },
            { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+2", alt: "Logo 2" },
            { imageUrl: "https://dummyimage.com/160x50/111/fff&text=Logo+3", alt: "Logo 3" },
          ],
        }),
      },
      {
        sectionKey: "h5",
        type: "testimonials",
        sortOrder: 5,
        dataJson: JSON.stringify({
          title: "Opiniones",
          items: [
            { name: "Carlos", role: "Restaurante", text: "Me ordenó el negocio." },
            { name: "María", role: "Hotel", text: "Ahora todo está centralizado." },
          ],
        }),
      },
      {
        sectionKey: "h6",
        type: "pricing",
        sortOrder: 6,
        dataJson: JSON.stringify({
          title: "Planes",
          subtitle: "Ejemplo editable desde el CMS",
          plans: [
            {
              name: "Starter",
              price: "S/ 99",
              period: "mes",
              features: ["Landing básica", "Secciones esenciales"],
              ctaText: "Cotizar",
              ctaHref: "/contacto",
            },
            {
              name: "Pro",
              price: "S/ 199",
              period: "mes",
              highlighted: true,
              features: ["Page Builder", "SSR/SEO", "Soporte"],
              ctaText: "Solicitar demo",
              ctaHref: "/contacto",
            },
          ],
        }),
      },
      {
        sectionKey: "h7",
        type: "cta",
        sortOrder: 7,
        dataJson: JSON.stringify({
          title: "¿Listo para implementarlo?",
          text: "Te mostramos una demo y lo adaptamos a tu negocio.",
          ctaText: "Solicitar demo",
          ctaHref: "/contacto",
        }),
      },
    ];
  }

  if (key === "restaurantes") {
    return [
      {
        sectionKey: "r1",
        type: "hero",
        sortOrder: 1,
        dataJson: JSON.stringify({
          title: "Sistema de Restaurantes",
          subtitle: "Ventas + Mesas + Comandas + Caja",
          ctaText: "Solicitar demo",
          ctaHref: "/contacto",
        }),
      },
      {
        sectionKey: "r2",
        type: "features",
        sortOrder: 2,
        dataJson: JSON.stringify({
          title: "Beneficios",
          items: [
            { title: "Mesas y comandas", text: "Control total del salón.", icon: "🍽️" },
            { title: "Caja y reportes", text: "Cierre y métricas.", icon: "📊" },
            { title: "Rápido", text: "Flujo ágil para mozos.", icon: "⚡" },
          ],
        }),
      },
      {
        sectionKey: "r3",
        type: "faq",
        sortOrder: 3,
        dataJson: JSON.stringify({
          title: "Preguntas frecuentes",
          items: [
            { question: "¿Funciona en tablet?", answer: "Sí, es responsive." },
            { question: "¿Puedo editar la web?", answer: "Sí, por módulos desde el CMS." },
          ],
        }),
      },
      {
        sectionKey: "r4",
        type: "cta",
        sortOrder: 4,
        dataJson: JSON.stringify({
          title: "¿Te interesa para tu restaurante?",
          text: "Agenda una demo.",
          ctaText: "Solicitar demo",
          ctaHref: "/contacto",
        }),
      },
    ];
  }

  // hoteles
  return [
    {
      sectionKey: "h1",
      type: "hero",
      sortOrder: 1,
      dataJson: JSON.stringify({
        title: "Sistema para Hoteles",
        subtitle: "Reservas + Operación + Reportes",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
    {
      sectionKey: "h2",
      type: "features",
      sortOrder: 2,
      dataJson: JSON.stringify({
        title: "Beneficios",
        items: [
          { title: "Control", text: "Operación centralizada.", icon: "🏨" },
          { title: "Reportes", text: "Datos para decisiones.", icon: "📈" },
          { title: "Editable", text: "Landing por módulos.", icon: "🧩" },
        ],
      }),
    },
    {
      sectionKey: "h3",
      type: "cta",
      sortOrder: 3,
      dataJson: JSON.stringify({
        title: "¿Listo para una demo?",
        text: "Te mostramos el sistema.",
        ctaText: "Solicitar demo",
        ctaHref: "/contacto",
      }),
    },
  ];
}

/** ===========================
 *  Duplicar página (helper)
 *  =========================== */

async function findUniqueSlug(base: string): Promise<string> {
  const clean = slugify(base);
  if (!clean) return `copia-${Date.now()}`;

  for (let i = 1; i <= 25; i++) {
    const candidate = i === 1 ? `${clean}-copia` : `${clean}-copia-${i}`;
    const res = await adminListPages({ search: candidate, status: "", page: 1, pageSize: 50 });
    const existsExact = (res.items || []).some((p) => p.slug === candidate);
    if (!existsExact) return candidate;
  }
  return `${clean}-copia-${Date.now()}`;
}

async function slugExistsExact(candidate: string): Promise<boolean> {
  const res = await adminListPages({ search: candidate, status: "", page: 1, pageSize: 50 });
  return (res.items || []).some((p) => p.slug === candidate);
}

export default function AdminPages() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // URL -> state
  const urlSearch = sp.get("search") ?? "";
  const urlStatus = sp.get("status") ?? "all";
  const urlPage = toInt(sp.get("page"), 1);
  const urlPageSize = toInt(sp.get("pageSize"), 20);

  // Inputs local (debounce)
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [statusInput, setStatusInput] = useState(urlStatus);
  const [pageSizeInput, setPageSizeInput] = useState(urlPageSize);

  // Data
  const [items, setItems] = useState<AdminPageListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Selection (bulk)
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const selectedIds = useMemo(
    () => Object.keys(selected).filter((k) => selected[Number(k)]).map((k) => Number(k)),
    [selected]
  );
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkInfo, setBulkInfo] = useState<string | null>(null);

  // Modal create
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [createStatus, setCreateStatus] = useState("draft");
  const [template, setTemplate] = useState<TemplateKey>("none");

  // Modal duplicar (nuevo)
  const [dupOpen, setDupOpen] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupSaving, setDupSaving] = useState(false);
  const [dupErr, setDupErr] = useState<string | null>(null);
  const [dupSourceId, setDupSourceId] = useState<number | null>(null);
  const [dupSource, setDupSource] = useState<any | null>(null);
  const [dupSlug, setDupSlug] = useState("");
  const [dupTitle, setDupTitle] = useState("");

  const totalPages = useMemo(() => {
    const tp = Math.ceil((total || 0) / (urlPageSize || 20));
    return tp <= 0 ? 1 : tp;
  }, [total, urlPageSize]);

  // Sync inputs si URL cambia
  useEffect(() => {
    setSearchInput(urlSearch);
    setStatusInput(urlStatus);
    setPageSizeInput(urlPageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlStatus, urlPageSize]);

  function replaceQuery(next: { search?: string; status?: string; page?: number; pageSize?: number }) {
    const q = new URLSearchParams(sp.toString());

    if (typeof next.search === "string") q.set("search", next.search);
    if (typeof next.status === "string") q.set("status", next.status);
    if (typeof next.page === "number") q.set("page", String(next.page));
    if (typeof next.pageSize === "number") q.set("pageSize", String(next.pageSize));

    if (!q.get("search")) q.delete("search");
    if (!q.get("status") || q.get("status") === "all") q.set("status", "all");
    if (!q.get("page") || q.get("page") === "1") q.set("page", "1");
    if (!q.get("pageSize")) q.set("pageSize", "20");

    router.replace(`${pathname}?${q.toString()}`);
  }

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== urlSearch) replaceQuery({ search: searchInput.trim(), page: 1 });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Status change
  useEffect(() => {
    if (statusInput !== urlStatus) replaceQuery({ status: statusInput, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusInput]);

  // Page size change
  useEffect(() => {
    if (pageSizeInput !== urlPageSize) replaceQuery({ pageSize: pageSizeInput, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSizeInput]);

  async function load() {
    try {
      setLoading(true);
      setErr(null);

      const statusParam = urlStatus === "all" ? "" : urlStatus;
      const data = await adminListPages({
        search: urlSearch,
        status: statusParam,
        page: urlPage,
        pageSize: urlPageSize,
      });

      setItems(data.items || []);
      setTotal(data.total || 0);

      // limpiar selección de items fuera de vista
      setSelected((prev) => {
        const visible = new Set((data.items || []).map((x) => x.id));
        const next: Record<number, boolean> = {};
        for (const k of Object.keys(prev)) {
          const id = Number(k);
          if (visible.has(id)) next[id] = prev[id];
        }
        return next;
      });
    } catch (e: any) {
      setErr(e.message || "Error");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlStatus, urlPage, urlPageSize]);

  function toggleOne(id: number, value: boolean) {
    setSelected((prev) => ({ ...prev, [id]: value }));
  }

  function toggleAllVisible(value: boolean) {
    const next: Record<number, boolean> = {};
    for (const it of items) next[it.id] = value;
    setSelected(next);
  }

  const allVisibleChecked = items.length > 0 && items.every((it) => !!selected[it.id]);

  // ===== Create modal
  function openModal() {
    setFormErr(null);
    setSlug("");
    setMetaTitle("");
    setMetaDescription("");
    setOgImage("");
    setCreateStatus("draft");
    setTemplate("none");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function onCreate() {
    try {
      setCreating(true);
      setFormErr(null);

      const s = slugify(slug);
      if (!s) throw new Error("Slug es obligatorio");
      if (!metaTitle.trim()) throw new Error("Meta Title es obligatorio");
      if (!metaDescription.trim()) throw new Error("Meta Description es obligatorio");

      const sections = templateSections(template).map((x, i) => ({ ...x, sortOrder: i + 1 }));

      const payload = {
        slug: s,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        ogImage: ogImage.trim() ? ogImage.trim() : "",
        status: createStatus,
        sections,
      };

      const created = await adminCreatePage(payload);
      closeModal();
      replaceQuery({ page: 1 });
      router.push(`/admin/pages/${created.id}`);
    } catch (e: any) {
      setFormErr(e.message || "Error creando");
    } finally {
      setCreating(false);
    }
  }

  // ===== Duplicate modal (nuevo)
  async function openDuplicateModal(id: number) {
    try {
      setDupErr(null);
      setDupOpen(true);
      setDupLoading(true);
      setDupSourceId(id);

      const details = await adminGetPage(id);
      setDupSource(details);

      const suggestedSlug = await findUniqueSlug(details.page.slug || "pagina");
      const suggestedTitle = details.page.metaTitle
        ? `${details.page.metaTitle} (Copia)`
        : "Copia";

      setDupSlug(suggestedSlug);
      setDupTitle(suggestedTitle);
    } catch (e: any) {
      setDupErr(e.message || "Error preparando duplicado");
    } finally {
      setDupLoading(false);
    }
  }

  function closeDuplicateModal() {
    setDupOpen(false);
    setDupErr(null);
    setDupLoading(false);
    setDupSaving(false);
    setDupSourceId(null);
    setDupSource(null);
    setDupSlug("");
    setDupTitle("");
  }

  async function confirmDuplicate() {
    try {
      if (!dupSourceId || !dupSource) throw new Error("No hay página origen cargada.");

      setDupSaving(true);
      setDupErr(null);

      const s = slugify(dupSlug);
      if (!s) throw new Error("Slug es obligatorio");

      // validar existencia exacta
      const exists = await slugExistsExact(s);
      if (exists) throw new Error(`Ese slug ya existe: "${s}"`);

      const title = dupTitle.trim();
      if (!title) throw new Error("Título es obligatorio");

      const payload = {
        slug: s,
        metaTitle: title,
        metaDescription: dupSource.page.metaDescription || "",
        ogImage: dupSource.page.ogImage || "",
        status: "draft", // copia siempre en draft (seguro)
        sections: (dupSource.sections || [])
          .slice()
          .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
          .map((sec: any) => ({
            sectionKey: sec.sectionKey,
            type: sec.type,
            sortOrder: sec.sortOrder,
            dataJson: sec.dataJson ?? "{}",
          })),
      };

      const created = await adminCreatePage(payload);

      closeDuplicateModal();
      await load();
      router.push(`/admin/pages/${created.id}`);
    } catch (e: any) {
      setDupErr(e.message || "Error duplicando");
    } finally {
      setDupSaving(false);
    }
  }

  // ===== Bulk (publish/draft/delete)
  async function bulkSetStatus(nextStatus: "draft" | "published") {
    if (!selectedIds.length) return;
    const ok = confirm(`¿Seguro que deseas cambiar a "${nextStatus}" ${selectedIds.length} página(s)?`);
    if (!ok) return;

    try {
      setErr(null);
      setBulkInfo(null);
      setBulkBusy(true);

      let done = 0;
      for (const id of selectedIds) {
        const details = await adminGetPage(id);

        await adminUpdatePage(id, {
          slug: details.page.slug,
          metaTitle: details.page.metaTitle,
          metaDescription: details.page.metaDescription,
          ogImage: details.page.ogImage || "",
          status: nextStatus,
          sections: (details.sections || []).map((s: any) => ({
            sectionKey: s.sectionKey,
            type: s.type,
            sortOrder: s.sortOrder,
            dataJson: s.dataJson ?? "{}",
          })),
        });

        done++;
        setBulkInfo(`Actualizando... ${done}/${selectedIds.length}`);
      }

      setBulkInfo(`Listo ✅ ${selectedIds.length} página(s) actualizadas a "${nextStatus}".`);
      await load();
    } catch (e: any) {
      setErr(e.message || "Error en bulk");
    } finally {
      setBulkBusy(false);
    }
  }

  async function bulkDelete() {
    if (!selectedIds.length) return;
    const ok = confirm(`¿Seguro que deseas ELIMINAR ${selectedIds.length} página(s)?`);
    if (!ok) return;

    try {
      setErr(null);
      setBulkInfo(null);
      setBulkBusy(true);

      let done = 0;
      for (const id of selectedIds) {
        await adminDeletePage(id);
        done++;
        setBulkInfo(`Eliminando... ${done}/${selectedIds.length}`);
      }

      setBulkInfo(`Listo ✅ ${selectedIds.length} página(s) eliminadas.`);
      await load();
      setSelected({});
    } catch (e: any) {
      setErr(e.message || "Error eliminando en bulk");
    } finally {
      setBulkBusy(false);
    }
  }

  function goPrev() {
    if (urlPage <= 1) return;
    replaceQuery({ page: urlPage - 1 });
  }

  function goNext() {
    if (urlPage >= totalPages) return;
    replaceQuery({ page: urlPage + 1 });
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Páginas</h1>
          <p className="mt-2 text-sm text-neutral-300">
            Total: {total} · Página {urlPage} / {totalPages}
          </p>
        </div>

        <button className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-black" onClick={openModal} type="button">
          + Nueva página
        </button>
      </div>

      {/* Bulk bar */}
      <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-neutral-300">
            Seleccionadas: <span className="font-extrabold text-white">{selectedIds.length}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40 disabled:opacity-50"
              onClick={() => bulkSetStatus("published")}
              disabled={bulkBusy || selectedIds.length === 0}
              type="button"
            >
              Publicar
            </button>
            <button
              className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40 disabled:opacity-50"
              onClick={() => bulkSetStatus("draft")}
              disabled={bulkBusy || selectedIds.length === 0}
              type="button"
            >
              Pasar a draft
            </button>
            <button
              className="rounded-xl border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-200 hover:bg-red-950/30 disabled:opacity-50"
              onClick={bulkDelete}
              disabled={bulkBusy || selectedIds.length === 0}
              type="button"
            >
              Eliminar
            </button>
            <button
              className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40 disabled:opacity-50"
              onClick={() => setSelected({})}
              disabled={bulkBusy || selectedIds.length === 0}
              type="button"
            >
              Limpiar selección
            </button>
          </div>
        </div>

        {bulkInfo ? <div className="mt-3 text-xs text-neutral-300">{bulkInfo}</div> : null}
      </div>

      {/* Filters */}
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
          <label className="text-xs text-neutral-400">Buscar (slug o título)</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ej: home, restaurantes..."
          />
          <div className="mt-2 text-xs text-neutral-500">Se aplica en ~0.4s</div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
          <label className="text-xs text-neutral-400">Estado</label>
          <select
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
          <label className="text-xs text-neutral-400">Page size</label>
          <select
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
            value={pageSizeInput}
            onChange={(e) => setPageSizeInput(Number(e.target.value))}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <div className="mt-3 flex items-center justify-between">
            <button
              className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40 disabled:opacity-50"
              onClick={goPrev}
              disabled={loading || urlPage <= 1 || bulkBusy}
              type="button"
            >
              ← Prev
            </button>

            <button
              className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900/40 disabled:opacity-50"
              onClick={goNext}
              disabled={loading || urlPage >= totalPages || bulkBusy}
              type="button"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-red-200">{err}</div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/40 text-neutral-300">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={allVisibleChecked}
                  onChange={(e) => toggleAllVisible(e.target.checked)}
                  disabled={loading || bulkBusy}
                />
              </th>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Updated</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr className="border-t border-neutral-800">
                <td colSpan={7} className="p-4 text-neutral-400">
                  Cargando...
                </td>
              </tr>
            ) : null}

            {!loading &&
              items.map((p) => (
                <tr key={p.id} className="border-t border-neutral-800">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={!!selected[p.id]}
                      onChange={(e) => toggleOne(p.id, e.target.checked)}
                      disabled={bulkBusy}
                    />
                  </td>
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.slug}</td>
                  <td className="p-3">{p.metaTitle}</td>
                  <td className="p-3">
                    <span
                      className={[
                        "rounded-full px-2 py-1 text-xs",
                        (p.status || "").toLowerCase() === "published"
                          ? "bg-green-900/40 text-green-200"
                          : "bg-yellow-900/40 text-yellow-200",
                      ].join(" ")}
                    >
                      {p.status || "draft"}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-300">{formatDate(p.updatedAt)}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-xl border border-neutral-800 px-3 py-2 hover:bg-neutral-900/40 disabled:opacity-50"
                        onClick={() => openDuplicateModal(p.id)}
                        disabled={bulkBusy}
                        type="button"
                        title="Duplicar página"
                      >
                        Duplicar
                      </button>
                      <a className="rounded-xl border border-neutral-800 px-3 py-2 hover:bg-neutral-900/40" href={`/admin/pages/${p.id}`}>
                        Editar
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && !items.length ? (
              <tr className="border-t border-neutral-800">
                <td className="p-4 text-neutral-400" colSpan={7}>
                  No hay resultados con esos filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Modal create */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/70" aria-label="Cerrar" onClick={closeModal} type="button" />
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">Nueva página</div>
              <button
                className="rounded-lg border border-neutral-800 px-3 py-1 text-sm text-neutral-300 hover:text-white"
                onClick={closeModal}
                type="button"
              >
                Cerrar
              </button>
            </div>

            {formErr ? (
              <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-200">{formErr}</div>
            ) : null}

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-neutral-400">Plantilla</label>
                <select
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as TemplateKey)}
                >
                  <option value="none">Sin plantilla (vacía)</option>
                  <option value="home">Home (Landing)</option>
                  <option value="restaurantes">Restaurantes</option>
                  <option value="hoteles">Hoteles</option>
                </select>
                <div className="mt-1 text-xs text-neutral-500">Crea la página con secciones base (editable después).</div>
              </div>

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
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400">Meta Description</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
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
                  value={createStatus}
                  onChange={(e) => setCreateStatus(e.target.value)}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  className="w-full rounded-xl border border-neutral-800 px-4 py-3 text-sm font-extrabold text-neutral-200 hover:bg-neutral-900/40"
                  onClick={closeModal}
                  type="button"
                  disabled={creating}
                >
                  Cancelar
                </button>
                <button
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black disabled:opacity-50"
                  onClick={onCreate}
                  disabled={creating}
                  type="button"
                >
                  {creating ? "Creando..." : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal duplicar (nuevo) */}
      {dupOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/70" aria-label="Cerrar" onClick={closeDuplicateModal} type="button" />
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">Duplicar página</div>
              <button
                className="rounded-lg border border-neutral-800 px-3 py-1 text-sm text-neutral-300 hover:text-white"
                onClick={closeDuplicateModal}
                type="button"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-2 text-sm text-neutral-300">
              La copia se crea en <strong>draft</strong> (seguro). Luego la publicas cuando estés listo.
            </div>

            {dupErr ? (
              <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-200">{dupErr}</div>
            ) : null}

            {dupLoading ? (
              <div className="mt-4 text-sm text-neutral-400">Preparando duplicado...</div>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-neutral-400">Nuevo Slug</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                    value={dupSlug}
                    onChange={(e) => setDupSlug(e.target.value)}
                    placeholder="ej: home-copia"
                    disabled={dupSaving}
                  />
                  <div className="mt-1 text-xs text-neutral-500">
                    Se convertirá a: <span className="text-neutral-300">{slugify(dupSlug) || "—"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400">Nuevo Título (Meta Title)</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2 text-sm"
                    value={dupTitle}
                    onChange={(e) => setDupTitle(e.target.value)}
                    disabled={dupSaving}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    className="w-full rounded-xl border border-neutral-800 px-4 py-3 text-sm font-extrabold text-neutral-200 hover:bg-neutral-900/40"
                    onClick={closeDuplicateModal}
                    type="button"
                    disabled={dupSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black disabled:opacity-50"
                    onClick={confirmDuplicate}
                    disabled={dupSaving}
                    type="button"
                  >
                    {dupSaving ? "Duplicando..." : "Duplicar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}