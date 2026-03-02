"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginCMS } from "@/lib/api/cmsAdmin";

export default function AdminLogin() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("admin@apiworking.pe");
  const [password, setPassword] = useState("12345678");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

async function onLogin() {
  try {
    setLoading(true);
    setErr(null);

    const data = await loginCMS(usuario, password);

    // ✅ token
    localStorage.setItem("awcmr_token", data.token);

    // ✅ usuario para el panel (full_name + role)
    localStorage.setItem(
      "awcmr_user",
      JSON.stringify({
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_active: data.is_active,
      })
    );

    router.replace("/admin/pages");
  } catch (e: any) {
    setErr(e.message || "Error");
  } finally {
    setLoading(false);
  }
}

return (
  <div className="aw-admin min-h-screen bg-slate-50 text-slate-900">
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white font-extrabold">
            A
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Login CMS</h1>
            <p className="text-xs text-slate-500">Panel administrador</p>
          </div>
        </div>

        {err ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <label className="block text-sm font-medium text-slate-700">Usuario</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <button
          className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-indigo-500 disabled:opacity-50"
          onClick={onLogin}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className="mt-4 text-center text-xs text-slate-500">
          ApiWorking CMS
        </div>
      </div>
    </div>
  </div>
);
}