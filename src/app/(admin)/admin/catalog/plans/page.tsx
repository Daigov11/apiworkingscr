"use client";

import Link from "next/link";

export default function AdminCatalogPlansPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Catálogo · Planes</h1>
      <p className="mt-2 text-sm text-slate-500">
        Los planes se administran dentro del producto (tipo <b>service</b>).
      </p>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold">Ir a productos</div>
        <div className="mt-2 text-sm text-slate-600">
          Entra a un producto service y baja a la sección “Planes”.
        </div>

        <Link
          className="mt-3 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
          href="/admin/catalog/products"
        >
          Abrir catálogo de productos →
        </Link>
      </div>
    </div>
  );
}