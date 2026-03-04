"use client";

import { useMemo, useState } from "react";

type ContactFormData = {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  formTitle?: string;
  giroOptions?: string[]; // ["resto","tienda","hotel","otros"]
  primaryCtaText?: string; // "Enviar"
  secondaryCtaText?: string; // "Limpiar"
};

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}

export default function ContactFormSection({ data }: { data: any }) {
  const d = (data || {}) as ContactFormData;

  const title = d.title || "Agenda tu demo y recibe asesoría";
  const subtitle =
    d.subtitle ||
    "Déjanos tus datos y te contactamos para mostrarte cómo ApiWorking mejora tu negocio.";

  const bullets = Array.isArray(d.bullets) ? d.bullets : [];
  const formTitle = d.formTitle || "Contáctanos";

  const giroOptions = useMemo(() => {
    const base = Array.isArray(d.giroOptions) && d.giroOptions.length
      ? d.giroOptions
      : ["resto", "tienda", "hotel", "otros"];
    return base;
  }, [d.giroOptions]);

  const btnSend = d.primaryCtaText || "Enviar";
  const btnClear = d.secondaryCtaText || "Limpiar";

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [giroNegocio, setGiroNegocio] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit() {
    setMsg(null);

    const payload = {
      nombreCompleto: nombreCompleto.trim(),
      telefono: telefono.trim(),
      nombreNegocio: nombreNegocio.trim(),
      giroNegocio: giroNegocio.trim(),
    };

    if (!payload.nombreCompleto || !payload.telefono || !payload.nombreNegocio || !payload.giroNegocio) {
      setMsg({ type: "err", text: "Completa todos los campos." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        setMsg({ type: "err", text: json?.message || "Error enviando el formulario." });
        return;
      }

      setMsg({ type: "ok", text: "¡Listo! Te contactaremos pronto." });
      setNombreCompleto("");
      setTelefono("");
      setNombreNegocio("");
      setGiroNegocio("");
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Error inesperado." });
    } finally {
      setLoading(false);
    }
  }

  function onClear() {
    setMsg(null);
    setNombreCompleto("");
    setTelefono("");
    setNombreNegocio("");
    setGiroNegocio("");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 text-white">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Texto */}
          <div>
            <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">{title}</h2>
            <p className="mt-3 text-sm text-neutral-300 md:text-base">{subtitle}</p>

            {bullets.length ? (
              <ul className="mt-5 space-y-2 text-sm text-neutral-200">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-neutral-800 bg-black/20 p-5">
            <div className="text-center text-2xl font-extrabold">{formTitle}</div>

            {msg ? (
              <div
                className={[
                  "mt-4 rounded-xl border p-3 text-sm",
                  msg.type === "ok"
                    ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-200"
                    : "border-red-900/40 bg-red-950/20 text-red-200",
                ].join(" ")}
              >
                {msg.text}
              </div>
            ) : null}

            <label className="mt-5 block text-sm text-neutral-300">Escribe tu nombre</label>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              placeholder="Nombre completo"
            />

            <label className="mt-4 block text-sm text-neutral-300">Déjanos tu WhatsApp</label>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
              value={telefono}
              onChange={(e) => setTelefono(onlyDigits(e.target.value))}
              placeholder="Solo dígitos"
              inputMode="numeric"
            />
            <div className="mt-1 text-xs text-neutral-500">Se permiten solo dígitos</div>

            <label className="mt-4 block text-sm text-neutral-300">Nombre del negocio</label>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              placeholder="Nombre comercial"
            />

            <label className="mt-4 block text-sm text-neutral-300">Giro del negocio</label>
            <select
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
              value={giroNegocio}
              onChange={(e) => setGiroNegocio(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {giroOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-extrabold text-black disabled:opacity-50"
              >
                {loading ? "Enviando..." : btnSend}
              </button>

              <button
                type="button"
                onClick={onClear}
                disabled={loading}
                className="w-full rounded-xl border border-neutral-800 bg-black/10 px-4 py-3 text-sm font-extrabold text-white hover:bg-neutral-900/40 disabled:opacity-50"
              >
                {btnClear}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}