"use client";

const MOCK = [
  { id: "home", slug: "home", metaTitle: "ApiWorking | Sistemas para negocios", status: "published", updatedAt: "hoy" },
  { id: "sistema-de-restaurantes", slug: "sistema-de-restaurantes", metaTitle: "Sistema de Restaurantes", status: "published", updatedAt: "hoy" },
  { id: "sistema-para-hoteles", slug: "sistema-para-hoteles", metaTitle: "Sistema para Hoteles", status: "draft", updatedAt: "hoy" },
  { id: "contacto", slug: "contacto", metaTitle: "Contacto", status: "published", updatedAt: "hoy" },
  { id: "demo", slug: "demo", metaTitle: "Demo", status: "draft", updatedAt: "hoy" },
];

export default function AdminPagesList() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Páginas</h1>
      <p className="mt-2 text-sm text-neutral-300">
        Listado temporal. Luego se conecta a <code>GET /cms/admin/pages</code>.
      </p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/40 text-neutral-300">
            <tr>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {MOCK.map((p) => (
              <tr key={p.id} className="border-t border-neutral-800">
                <td className="p-3">{p.slug}</td>
                <td className="p-3 text-neutral-200">{p.metaTitle}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${p.status === "published" ? "bg-green-900/40 text-green-200" : "bg-yellow-900/40 text-yellow-200"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <a className="rounded-xl border border-neutral-800 px-3 py-2 hover:bg-neutral-900/40" href={`/admin/pages/${p.slug}`}>
                    Editar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}