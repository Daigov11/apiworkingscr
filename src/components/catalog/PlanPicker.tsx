"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { CatalogProduct } from "@/lib/catalog/types";

export default function PlanPicker({ product }: { product: CatalogProduct }) {
  const cart = useCart();
  const plans = product.plans || [];

  const defaultPlanId = useMemo(() => {
    const def = plans.find((p) => p.isDefault);
    return def ? def.id : plans[0]?.id;
  }, [plans]);

  const [planId, setPlanId] = useState<number | undefined>(defaultPlanId);

  const selected = plans.find((p) => p.id === planId);

  if (!plans.length) {
    return <div className="text-sm text-red-200">Este sistema no tiene planes configurados.</div>;
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
      <div className="text-sm font-extrabold">Planes</div>

      <div className="mt-3 space-y-2">
        {plans.map((p) => (
          <label key={p.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950/30 p-3">
            <input
              type="radio"
              name="plan"
              checked={planId === p.id}
              onChange={() => setPlanId(p.id)}
            />
            <div>
              <div className="font-bold">{p.name} — S/ {p.price.toFixed(2)}</div>
              {p.features?.length ? (
                <ul className="mt-1 list-disc pl-5 text-xs text-neutral-300">
                  {p.features.slice(0, 4).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </label>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black"
        onClick={() => {
          if (!selected) return;
          cart.add(
            {
              productId: product.id,
              productSlug: product.slug,
              productName: product.name,
              type: product.type,
              currency: selected.currency,
              unitPrice: selected.price,
              imageUrl: product.mainImageUrl || null,
              planId: selected.id,
              planName: selected.name,
            },
            1
          );
        }}
      >
        Agregar plan al carrito
      </button>
    </div>
  );
}