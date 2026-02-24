"use client";

import React, { useEffect, useRef, useState } from "react";
import CarouselSkeleton from "@/components/sections/CarouselSkeleton";
import CarouselSection from "@/components/sections/CarouselSection";

export default function CarouselLazy({
  data,
}: {
  data: { title?: string; items: Array<{ imageUrl: string; alt?: string; caption?: string; href?: string }> };
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {mounted ? <CarouselSection data={data} /> : <CarouselSkeleton />}
    </div>
  );
}