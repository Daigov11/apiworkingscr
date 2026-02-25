"use client";

export default function AdminTopbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="text-lg font-extrabold">ApiWorking CMR — Admin</div>

      <div className="flex gap-3 text-sm">
        <a className="text-neutral-300 hover:text-white" href="/admin/pages">
          Páginas
        </a>

        <button
          type="button"
          className="rounded-lg border border-neutral-800 px-3 py-1 text-neutral-300 hover:text-white"
          onClick={() => {
            localStorage.removeItem("awcmr_token");
            window.location.href = "/admin/login";
          }}
        >
          Salir
        </button>
      </div>
    </div>
  );
}