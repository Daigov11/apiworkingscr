"use client";

import ContactFormSection from "@/components/sections/ContactFormSection";

type SplitData = {
  imageUrl?: string;
  imageAlt?: string;
} & Record<string, any>;

export default function ContactFormSplitSection({ data }: { data: any }) {
  const d = (data || {}) as SplitData;

  const imageUrl = d.imageUrl || "https://picsum.photos/seed/form/900/900";
  const imageAlt = d.imageAlt || "Imagen";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 text-white">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Izquierda: usamos el mismo form pero solo tomamos sus props desde data */}
          <div className="lg:order-1">
            <ContactFormSection data={d} />
          </div>

          {/* Derecha: imagen */}
          <div className="lg:order-2">
            <div className="rounded-3xl border border-neutral-800 bg-black/20 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageAlt}
                className="h-full w-full rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}