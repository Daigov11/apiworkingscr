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
      localStorage.setItem("awcmr_token", data.token);
      router.replace("/admin/pages");
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-md p-6 pt-20">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/40 p-6">
          <h1 className="text-2xl font-extrabold">Login CMS</h1>
          <p className="mt-2 text-sm text-neutral-300">Conecta con: /api/User/loginCMS</p>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          <label className="mt-5 block text-sm text-neutral-300">Usuario</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <label className="mt-4 block text-sm text-neutral-300">Password</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <button
            className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black disabled:opacity-50"
            onClick={onLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}