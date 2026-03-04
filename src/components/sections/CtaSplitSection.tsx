"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CtaSplitData = {
  title?: string;
  subtitle?: string;

  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };

  slides: Array<{
    imageUrl: string;
    alt?: string;
    caption?: string;
    href?: string;
  }>;
};

export default function CtaSplitSection({ data }: { data: any }) {
  const d = (data || {}) as CtaSplitData;

  const title = d.title || "¿Listo para revolucionar tu negocio?";
  const subtitle = d.subtitle || "Agenda tu demo personalizada y comienza hoy.";

  const primary = d.primaryCta?.text ? d.primaryCta : { text: "Agendar demo", href: "/contacto" };
  const secondary = d.secondaryCta?.text ? d.secondaryCta : { text: "Ver productos", href: "/productos" };

  const slides = Array.isArray(d.slides) ? d.slides : [];
  const hasSlides = slides.length > 0;

  const [idx, setIdx] = useState(0);
  const safeIdx = useMemo(() => (hasSlides ? ((idx % slides.length) + slides.length) % slides.length : 0), [idx, hasSlides, slides.length]);

  function prev() {
    if (!hasSlides) return;
    setIdx((p) => p - 1);
  }

  function next() {
    if (!hasSlides) return;
    setIdx((p) => p + 1);
  }

  const current = hasSlides ? slides[safeIdx] : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-white">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left CTA */}
          <div>
            <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">{title}</h2>
            <p className="mt-3 text-base text-neutral-200 md:text-lg">{subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={primary.href} className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-black">
                {primary.text}
              </Link>

              <Link
                href={secondary.href}
                className="rounded-xl border border-neutral-800 bg-black/10 px-5 py-3 text-sm font-extrabold text-white hover:bg-neutral-900/40"
              >
                {secondary.text}
              </Link>
            </div>

            <div className="mt-4 text-xs text-neutral-400">
              Tip: este bloque es ideal para cerrar el home con conversión.
            </div>
          </div>

          {/* Right Slider */}
          <div className="rounded-3xl border border-neutral-800 bg-black/20 p-3">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black">
              {current ? (
                current.href ? (
                  <a href={current.href} className="block h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.imageUrl}
                      alt={current.alt || "Slide"}
                      className="h-full w-full object-cover"
                    />
                  </a>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.imageUrl}
                    alt={current.alt || "Slide"}
                    className="h-full w-full object-cover"
                  />
                )
              ) : (
                <div className="grid h-full place-items-center text-sm text-neutral-300">
                  No hay slides configurados.
                </div>
              )}
            </div>

            {current?.caption ? (
              <div className="mt-3 text-sm text-neutral-200">{current.caption}</div>
            ) : null}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="rounded-lg border border-neutral-800 bg-black/10 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900/40 disabled:opacity-50"
                  disabled={!hasSlides}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="rounded-lg border border-neutral-800 bg-black/10 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900/40 disabled:opacity-50"
                  disabled={!hasSlides}
                >
                  →
                </button>
              </div>

              <div className="flex items-center gap-1">
                {slides.slice(0, 8).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={[
                      "h-2.5 w-2.5 rounded-full border border-neutral-700",
                      i === safeIdx ? "bg-white" : "bg-transparent",
                    ].join(" ")}
                    aria-label={`Ir al slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}