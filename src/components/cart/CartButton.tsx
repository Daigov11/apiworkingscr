"use client";

import { useCart } from "@/components/cart/CartProvider";

export default function CartButton() {
  const cart = useCart();
  if (cart.count <= 0) return null;

  return (
    <button
      type="button"
      onClick={cart.open}
      className="fixed bottom-5 right-5 z-50 rounded-2xl bg-black px-4 py-3 text-sm font-extrabold text-white shadow-lg"
      aria-label="Abrir carrito"
    >
      🛒 Carrito ({cart.count})
    </button>
  );
}