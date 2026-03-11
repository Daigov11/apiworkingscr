"use client";

import { useEffect, useMemo, useState } from "react";

type HeaderLink = {
  href: string;
  label: string;
};

type HeaderLayoutData = {
  cta?: {
    href?: string | null;
    text?: string | null;
  } | null;
  links?: HeaderLink[];
  logoUrl?: string | null;
};

type FooterSocial = {
  href: string;
  type: string;
};

type FooterColumnLink = {
  href: string;
  label: string;
};

type FooterColumn = {
  title: string;
  links: FooterColumnLink[];
};

type FooterLayoutData = {
  note?: string | null;
  social?: FooterSocial[];
  columns?: FooterColumn[];
};

function getToken() {
  try {
    return localStorage.getItem("awcmr_token") || "";
  } catch {
    return "";
  }
}

function emptyHeader(): HeaderLayoutData {
  return {
    logoUrl: "",
    cta: {
      text: "",
      href: "",
    },
    links: [],
  };
}

function emptyFooter(): FooterLayoutData {
  return {
    note: "",
    social: [],
    columns: [],
  };
}

function normalizeHeader(data: HeaderLayoutData): HeaderLayoutData {
  const logoUrl = (data.logoUrl || "").trim();

  const ctaText = (data.cta?.text || "").trim();
  const ctaHref = (data.cta?.href || "").trim();

  return {
    logoUrl: logoUrl || null,
    cta: ctaText || ctaHref ? { text: ctaText || null, href: ctaHref || null } : null,
    links: (data.links || [])
      .map((item) => ({
        label: (item.label || "").trim(),
        href: (item.href || "").trim(),
      }))
      .filter((item) => item.label || item.href),
  };
}

function normalizeFooter(data: FooterLayoutData): FooterLayoutData {
  return {
    note: (data.note || "").trim() || null,
    social: (data.social || [])
      .map((item) => ({
        type: (item.type || "").trim(),
        href: (item.href || "").trim(),
      }))
      .filter((item) => item.type || item.href),
    columns: (data.columns || [])
      .map((col) => ({
        title: (col.title || "").trim(),
        links: (col.links || [])
          .map((link) => ({
            label: (link.label || "").trim(),
            href: (link.href || "").trim(),
          }))
          .filter((link) => link.label || link.href),
      }))
      .filter((col) => col.title || col.links.length > 0),
  };
}

export default function AdminLayoutPage() {
  const [headerData, setHeaderData] = useState<HeaderLayoutData>(emptyHeader());
  const [footerData, setFooterData] = useState<FooterLayoutData>(emptyFooter());

  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savingFooter, setSavingFooter] = useState(false);

  const [error, setError] = useState("");
  const [headerOk, setHeaderOk] = useState("");
  const [footerOk, setFooterOk] = useState("");

  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    let ignore = false;

    async function loadAll() {
      setLoading(true);
      setError("");
      setHeaderOk("");
      setFooterOk("");

      try {
        if (!token) {
          throw new Error("No se encontró token de administrador.");
        }

        const [headerRes, footerRes] = await Promise.all([
          fetch("/api/admin/layout/header", {
            method: "GET",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),
          fetch("/api/admin/layout/footer", {
            method: "GET",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }),
        ]);

        const headerTextRaw = await headerRes.text();
        const footerTextRaw = await footerRes.text();

        if (!headerRes.ok) {
          throw new Error(headerTextRaw || `Error cargando header (${headerRes.status})`);
        }

        if (!footerRes.ok) {
          throw new Error(footerTextRaw || `Error cargando footer (${footerRes.status})`);
        }

        const headerJson = JSON.parse(headerTextRaw) as HeaderLayoutData;
        const footerJson = JSON.parse(footerTextRaw) as FooterLayoutData;

        if (!ignore) {
          setHeaderData({
            logoUrl: headerJson.logoUrl ?? "",
            cta: {
              text: headerJson.cta?.text ?? "",
              href: headerJson.cta?.href ?? "",
            },
            links: Array.isArray(headerJson.links) ? headerJson.links : [],
          });

          setFooterData({
            note: footerJson.note ?? "",
            social: Array.isArray(footerJson.social) ? footerJson.social : [],
            columns: Array.isArray(footerJson.columns) ? footerJson.columns : [],
          });
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "No se pudo cargar la configuración.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function saveHeader() {
    setSavingHeader(true);
    setError("");
    setHeaderOk("");

    try {
      if (!token) {
        throw new Error("No se encontró token de administrador.");
      }

      const payload = normalizeHeader(headerData);

      const res = await fetch("/api/admin/layout/header?id=1", {
        method: "PUT",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();

      if (!res.ok) {
        throw new Error(raw || `Error guardando header (${res.status})`);
      }

      setHeaderData({
        logoUrl: payload.logoUrl ?? "",
        cta: {
          text: payload.cta?.text ?? "",
          href: payload.cta?.href ?? "",
        },
        links: payload.links ?? [],
      });

      setHeaderOk("Header actualizado correctamente.");
    } catch (err: any) {
      setError(err?.message || "No se pudo guardar el header.");
    } finally {
      setSavingHeader(false);
    }
  }

  async function saveFooter() {
    setSavingFooter(true);
    setError("");
    setFooterOk("");

    try {
      if (!token) {
        throw new Error("No se encontró token de administrador.");
      }

      const payload = normalizeFooter(footerData);

      const res = await fetch("/api/admin/layout/footer?id=1", {
        method: "PUT",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();

      if (!res.ok) {
        throw new Error(raw || `Error guardando footer (${res.status})`);
      }

      setFooterData({
        note: payload.note ?? "",
        social: payload.social ?? [],
        columns: payload.columns ?? [],
      });

      setFooterOk("Footer actualizado correctamente.");
    } catch (err: any) {
      setError(err?.message || "No se pudo guardar el footer.");
    } finally {
      setSavingFooter(false);
    }
  }

  async function reloadData() {
    setLoading(true);
    setError("");
    setHeaderOk("");
    setFooterOk("");

    try {
      if (!token) {
        throw new Error("No se encontró token de administrador.");
      }

      const [headerRes, footerRes] = await Promise.all([
        fetch("/api/admin/layout/header", {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),
        fetch("/api/admin/layout/footer", {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }),
      ]);

      const headerTextRaw = await headerRes.text();
      const footerTextRaw = await footerRes.text();

      if (!headerRes.ok) {
        throw new Error(headerTextRaw || `Error cargando header (${headerRes.status})`);
      }

      if (!footerRes.ok) {
        throw new Error(footerTextRaw || `Error cargando footer (${footerRes.status})`);
      }

      const headerJson = JSON.parse(headerTextRaw) as HeaderLayoutData;
      const footerJson = JSON.parse(footerTextRaw) as FooterLayoutData;

      setHeaderData({
        logoUrl: headerJson.logoUrl ?? "",
        cta: {
          text: headerJson.cta?.text ?? "",
          href: headerJson.cta?.href ?? "",
        },
        links: Array.isArray(headerJson.links) ? headerJson.links : [],
      });

      setFooterData({
        note: footerJson.note ?? "",
        social: Array.isArray(footerJson.social) ? footerJson.social : [],
        columns: Array.isArray(footerJson.columns) ? footerJson.columns : [],
      });
    } catch (err: any) {
      setError(err?.message || "No se pudo recargar la configuración.");
    } finally {
      setLoading(false);
    }
  }

  function updateHeaderLink(index: number, key: keyof HeaderLink, value: string) {
    setHeaderData((prev) => {
      const nextLinks = [...(prev.links || [])];
      nextLinks[index] = { ...nextLinks[index], [key]: value };
      return { ...prev, links: nextLinks };
    });
  }

  function addHeaderLink() {
    setHeaderData((prev) => ({
      ...prev,
      links: [...(prev.links || []), { label: "", href: "" }],
    }));
  }

  function removeHeaderLink(index: number) {
    setHeaderData((prev) => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index),
    }));
  }

  function updateSocial(index: number, key: keyof FooterSocial, value: string) {
    setFooterData((prev) => {
      const nextSocial = [...(prev.social || [])];
      nextSocial[index] = { ...nextSocial[index], [key]: value };
      return { ...prev, social: nextSocial };
    });
  }

  function addSocial() {
    setFooterData((prev) => ({
      ...prev,
      social: [...(prev.social || []), { type: "whatsapp", href: "" }],
    }));
  }

  function removeSocial(index: number) {
    setFooterData((prev) => ({
      ...prev,
      social: (prev.social || []).filter((_, i) => i !== index),
    }));
  }

  function updateColumnTitle(index: number, value: string) {
    setFooterData((prev) => {
      const nextColumns = [...(prev.columns || [])];
      nextColumns[index] = { ...nextColumns[index], title: value };
      return { ...prev, columns: nextColumns };
    });
  }

  function addColumn() {
    setFooterData((prev) => ({
      ...prev,
      columns: [...(prev.columns || []), { title: "", links: [] }],
    }));
  }

  function removeColumn(index: number) {
    setFooterData((prev) => ({
      ...prev,
      columns: (prev.columns || []).filter((_, i) => i !== index),
    }));
  }

  function updateColumnLink(columnIndex: number, linkIndex: number, key: keyof FooterColumnLink, value: string) {
    setFooterData((prev) => {
      const nextColumns = [...(prev.columns || [])];
      const nextLinks = [...(nextColumns[columnIndex]?.links || [])];
      nextLinks[linkIndex] = { ...nextLinks[linkIndex], [key]: value };
      nextColumns[columnIndex] = { ...nextColumns[columnIndex], links: nextLinks };
      return { ...prev, columns: nextColumns };
    });
  }

  function addColumnLink(columnIndex: number) {
    setFooterData((prev) => {
      const nextColumns = [...(prev.columns || [])];
      const nextLinks = [...(nextColumns[columnIndex]?.links || []), { label: "", href: "" }];
      nextColumns[columnIndex] = { ...nextColumns[columnIndex], links: nextLinks };
      return { ...prev, columns: nextColumns };
    });
  }

  function removeColumnLink(columnIndex: number, linkIndex: number) {
    setFooterData((prev) => {
      const nextColumns = [...(prev.columns || [])];
      nextColumns[columnIndex] = {
        ...nextColumns[columnIndex],
        links: (nextColumns[columnIndex]?.links || []).filter((_, i) => i !== linkIndex),
      };
      return { ...prev, columns: nextColumns };
    });
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1 text-xs font-medium text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Configuración global del sitio
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Header & Footer
              </h1>

              <p className="mt-2 text-sm leading-6 text-neutral-400 sm:text-base">
                Edita encabezado y pie de página con un formulario simple para el cliente.
              </p>
            </div>

            <button
              type="button"
              onClick={reloadData}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900 px-5 text-sm font-medium text-neutral-100 transition hover:border-neutral-600 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Cargando..." : "Recargar datos"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Header</h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Logo, navegación principal y botón de acción.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {headerOk ? (
                  <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-3 py-2 text-xs font-medium text-emerald-200">
                    {headerOk}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={saveHeader}
                  disabled={loading || savingHeader}
                  className="inline-flex h-11 min-w-[148px] items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingHeader ? "Guardando..." : "Guardar header"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <label className="mb-2 block text-sm font-medium text-neutral-200">
                  URL del logo
                </label>
                <input
                  type="text"
                  value={headerData.logoUrl ?? ""}
                  onChange={(e) =>
                    setHeaderData((prev) => ({ ...prev, logoUrl: e.target.value }))
                  }
                  placeholder="https://tusitio.com/logo.png"
                  className="h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                />
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-white">Botón CTA</h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    Texto y enlace del botón principal.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-200">
                      Texto
                    </label>
                    <input
                      type="text"
                      value={headerData.cta?.text ?? ""}
                      onChange={(e) =>
                        setHeaderData((prev) => ({
                          ...prev,
                          cta: { ...(prev.cta ?? {}), text: e.target.value },
                        }))
                      }
                      placeholder="Solicitar demo"
                      className="h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-200">
                      Enlace
                    </label>
                    <input
                      type="text"
                      value={headerData.cta?.href ?? ""}
                      onChange={(e) =>
                        setHeaderData((prev) => ({
                          ...prev,
                          cta: { ...(prev.cta ?? {}), href: e.target.value },
                        }))
                      }
                      placeholder="/demo"
                      className="h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Enlaces del menú</h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      Agrega, edita o elimina los links principales.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addHeaderLink}
                    className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:border-neutral-600 hover:bg-neutral-800"
                  >
                    Agregar enlace
                  </button>
                </div>

                <div className="space-y-3">
                  {(headerData.links || []).map((link, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3 md:grid-cols-[1fr_1fr_auto]"
                    >
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateHeaderLink(index, "label", e.target.value)}
                        placeholder="Etiqueta"
                        className="h-11 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                      />

                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => updateHeaderLink(index, "href", e.target.value)}
                        placeholder="/contacto"
                        className="h-11 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                      />

                      <button
                        type="button"
                        onClick={() => removeHeaderLink(index)}
                        className="h-11 rounded-xl border border-red-900/50 bg-red-950/30 px-4 text-sm font-medium text-red-200 transition hover:bg-red-950/50"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}

                  {!headerData.links?.length ? (
                    <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 px-4 py-5 text-sm text-neutral-400">
                      Aún no hay enlaces en el header.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Footer</h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Nota final, redes sociales y columnas de enlaces.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {footerOk ? (
                  <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-3 py-2 text-xs font-medium text-emerald-200">
                    {footerOk}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={saveFooter}
                  disabled={loading || savingFooter}
                  className="inline-flex h-11 min-w-[148px] items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingFooter ? "Guardando..." : "Guardar footer"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <label className="mb-2 block text-sm font-medium text-neutral-200">
                  Nota inferior
                </label>
                <input
                  type="text"
                  value={footerData.note ?? ""}
                  onChange={(e) =>
                    setFooterData((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder="© ApiWorking"
                  className="h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                />
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Redes sociales</h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      Configura los enlaces sociales visibles en el footer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSocial}
                    className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:border-neutral-600 hover:bg-neutral-800"
                  >
                    Agregar red
                  </button>
                </div>

                <div className="space-y-3">
                  {(footerData.social || []).map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3 md:grid-cols-[180px_1fr_auto]"
                    >
                      <select
                        value={item.type}
                        onChange={(e) => updateSocial(index, "type", e.target.value)}
                        className="h-11 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube">YouTube</option>
                      </select>

                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => updateSocial(index, "href", e.target.value)}
                        placeholder="https://wa.me/51999999999"
                        className="h-11 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                      />

                      <button
                        type="button"
                        onClick={() => removeSocial(index)}
                        className="h-11 rounded-xl border border-red-900/50 bg-red-950/30 px-4 text-sm font-medium text-red-200 transition hover:bg-red-950/50"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}

                  {!footerData.social?.length ? (
                    <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 px-4 py-5 text-sm text-neutral-400">
                      Aún no hay redes configuradas.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Columnas del footer</h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      Cada columna puede tener un título y varios enlaces.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addColumn}
                    className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:border-neutral-600 hover:bg-neutral-800"
                  >
                    Agregar columna
                  </button>
                </div>

                <div className="space-y-4">
                  {(footerData.columns || []).map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4"
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <label className="mb-2 block text-sm font-medium text-neutral-200">
                            Título de la columna
                          </label>
                          <input
                            type="text"
                            value={column.title}
                            onChange={(e) => updateColumnTitle(columnIndex, e.target.value)}
                            placeholder="Soluciones"
                            className="h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeColumn(columnIndex)}
                          className="h-11 rounded-xl border border-red-900/50 bg-red-950/30 px-4 text-sm font-medium text-red-200 transition hover:bg-red-950/50"
                        >
                          Eliminar columna
                        </button>
                      </div>

                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-white">Enlaces</div>
                        <button
                          type="button"
                          onClick={() => addColumnLink(columnIndex)}
                          className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:border-neutral-600 hover:bg-neutral-800"
                        >
                          Agregar link
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(column.links || []).map((link, linkIndex) => (
                          <div
                            key={linkIndex}
                            className="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-800 bg-black/20 p-3 md:grid-cols-[1fr_1fr_auto]"
                          >
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) =>
                                updateColumnLink(columnIndex, linkIndex, "label", e.target.value)
                              }
                              placeholder="Restaurantes"
                              className="h-11 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                            />

                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) =>
                                updateColumnLink(columnIndex, linkIndex, "href", e.target.value)
                              }
                              placeholder="/sistema-de-restaurantes"
                              className="h-11 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-sm text-white outline-none transition focus:border-neutral-500"
                            />

                            <button
                              type="button"
                              onClick={() => removeColumnLink(columnIndex, linkIndex)}
                              className="h-11 rounded-xl border border-red-900/50 bg-red-950/30 px-4 text-sm font-medium text-red-200 transition hover:bg-red-950/50"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}

                        {!column.links?.length ? (
                          <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 px-4 py-5 text-sm text-neutral-400">
                            Esta columna aún no tiene enlaces.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {!footerData.columns?.length ? (
                    <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 px-4 py-5 text-sm text-neutral-400">
                      Aún no hay columnas configuradas.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}