"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  key: string; // único (producto + plan)
  productId: number;
  productSlug: string;
  productName: string;
  type: "physical" | "service";
  currency: string;
  unitPrice: number; // precio final
  qty: number;
  imageUrl?: string | null;

  // para sistemas
  planId?: number | null;
  planName?: string | null;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;

  add: (item: Omit<CartItem, "qty" | "key">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;

  count: number;
  total: number;

  whatsappCheckout: () => void;
};

const LS_KEY = "awcmr_cart_v1";
const CartCtx = createContext<CartState | null>(null);

function normalizePhone(raw: string) {
  const digits = (raw || "").replace(/\D/g, "");
  // si viene 9 dígitos (Perú), agregamos 51
  if (digits.length === 9) return `51${digits}`;
  // si ya viene con 51
  if (digits.startsWith("51")) return digits;
  return digits; // fallback
}

function currencyFmt(currency: string, n: number) {
  try {
    return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

function buildWhatsappMessage(items: CartItem[], total: number) {
  const lines: string[] = [];
  lines.push("Hola, quiero comprar:");
  lines.push("");

  items.forEach((it, idx) => {
    const plan = it.planName ? ` — ${it.planName}` : "";
    const priceLine = `${currencyFmt(it.currency, it.unitPrice)} x ${it.qty}`;
    lines.push(`${idx + 1}) ${it.productName}${plan} — ${priceLine}`);
  });

  lines.push("");
  lines.push(`Total estimado: ${currencyFmt("PEN", total)}`);
  lines.push("");
  lines.push("Mi nombre: ");
  lines.push("DNI/RUC: ");

  return lines.join("\n");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const count = useMemo(() => items.reduce((a, b) => a + (b.qty || 0), 0), [items]);
  const total = useMemo(() => items.reduce((a, b) => a + (b.unitPrice * b.qty), 0), [items]);

  function open() { setIsOpen(true); }
  function close() { setIsOpen(false); }

  function add(item: Omit<CartItem, "qty" | "key">, qty: number = 1) {
    const key = `${item.productId}:${item.planId || 0}`;
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.key === key);
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, key, qty }];
    });
    setIsOpen(true);
  }

  function remove(key: string) {
    setItems((prev) => prev.filter((x) => x.key !== key));
  }

  function setQty(key: string, qty: number) {
    const safeQty = Math.max(1, Math.floor(qty || 1));
    setItems((prev) => prev.map((x) => (x.key === key ? { ...x, qty: safeQty } : x)));
  }

  function clear() {
    setItems([]);
  }

  function whatsappCheckout() {
    const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919688631";
    const phone = normalizePhone(rawPhone);
    const text = buildWhatsappMessage(items, total);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  const value: CartState = {
    items,
    isOpen,
    open,
    close,
    add,
    remove,
    setQty,
    clear,
    count,
    total,
    whatsappCheckout,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}