"use client";

import React, { useMemo, useState } from "react";

export default function CarouselSection({
  data,
}: {
  data: { title?: string; items: Array<{ imageUrl: string; alt?: string; caption?: string; href?: string }> };
}) {
  let [index, setIndex] = useState(0);

  const items = useMemo(() => data.items || [], [data.items]);
  const current = items[index];

  function prev() {
    setIndex((v) => (v - 1 + items.length) % items.length);
  }

  function next() {
    setIndex((v) => (v + 1) % items.length);
  }

  if (!items.length) return null;

  const img = (
    <img
      src={current.imageUrl}
      alt={current.alt ?? ""}
      className="h-64 w-full rounded-2xl border border-neutral-800 object-cover md:h-80"
    />
  );

  return (
    <section className="py-10">
      {data.title ? <h2 className="text-2xl font-extrabold">{data.title}</h2> : null}

      <div className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="relative">
          {current.href ? <a href={current.href}>{img}</a> : img}

          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-neutral-800 bg-black/50 px-3 py-2 text-sm font-extrabold"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-neutral-800 bg-black/50 px-3 py-2 text-sm font-extrabold"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-neutral-400">
            {index + 1}/{items.length}
            {current.caption ? <span className="ml-2 text-neutral-300">— {current.caption}</span> : null}
          </div>

          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={["h-2 w-2 rounded-full", i === index ? "bg-white" : "bg-neutral-600"].join(" ")}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}