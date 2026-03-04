"use client";

import { useCart } from "@/components/cart/CartProvider";

function money(currency: string, n: number) {
  try {
    return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export default function CartDrawer() {
  const cart = useCart();
  if (!cart.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={cart.close}
        aria-label="Cerrar carrito"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-5 text-slate-900 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold">Carrito</div>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
            onClick={cart.close}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {cart.items.length === 0 ? (
            <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
              Tu carrito está vacío.
            </div>
          ) : (
            cart.items.map((it) => (
              <div key={it.key} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold">{it.productName}</div>
                    {it.planName ? <div className="text-xs text-slate-500">{it.planName}</div> : null}
                    <div className="mt-1 text-sm text-slate-700">
                      {money(it.currency, it.unitPrice)} x {it.qty}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => cart.remove(it.key)}
                  >
                    Quitar
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-2 py-1"
                    onClick={() => cart.setQty(it.key, it.qty - 1)}
                  >
                    -
                  </button>
                  <div className="w-10 text-center text-sm font-bold">{it.qty}</div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-2 py-1"
                    onClick={() => cart.setQty(it.key, it.qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Total</span>
            <span className="font-extrabold">{money("PEN", cart.total)}</span>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
              onClick={cart.clear}
              disabled={cart.items.length === 0}
            >
              Vaciar
            </button>
            <button
              type="button"
              className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50"
              onClick={cart.whatsappCheckout}
              disabled={cart.items.length === 0}
            >
              WhatsApp
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-slate-500">
          Se enviará al WhatsApp configurado (por ahora: 919688631).
        </div>
      </aside>
    </div>
  );
}