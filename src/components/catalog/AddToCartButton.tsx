"use client";

import { useCart } from "@/components/cart/CartProvider";
import type { CatalogProduct } from "@/lib/catalog/types";

export default function AddToCartButton({ product }: { product: CatalogProduct }) {
  const cart = useCart();

  // Para sistemas (service) no agregamos directo porque necesita plan
  if (product.type === "service") {
    return (
      <a
        href={`/productos/${product.slug}`}
        className="block w-full rounded-xl border border-neutral-800 px-4 py-3 text-center text-sm font-extrabold text-white hover:bg-neutral-900/40"
      >
        Elegir plan
      </a>
    );
  }

  const price = Number(product.price || 0);

  return (
    <button
      type="button"
      className="w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black"
      onClick={() =>
        cart.add({
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          type: product.type,
          currency: product.currency,
          unitPrice: price,
          imageUrl: product.mainImageUrl || null,
          planId: null,
          planName: null,
        })
      }
    >
      Agregar al carrito
    </button>
  );
}