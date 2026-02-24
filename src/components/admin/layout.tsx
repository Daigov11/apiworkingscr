import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-5xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold">ApiWorking CMR — Admin</div>
            <div className="flex gap-3 text-sm">
              <a className="text-neutral-300 hover:text-white" href="/admin/pages">Páginas</a>
              <button
                className="rounded-lg border border-neutral-800 px-3 py-1 text-neutral-300 hover:text-white"
                onClick={() => {
                  localStorage.removeItem("awcmr_admin");
                  window.location.href = "/admin/login";
                }}
              >
                Salir
              </button>
            </div>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}