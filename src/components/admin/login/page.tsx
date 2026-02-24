"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@apiworking.com");
  const [pass, setPass] = useState("123456");

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-md p-6 pt-20">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/40 p-6">
          <h1 className="text-2xl font-extrabold">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-neutral-300">Login temporal (sin backend). Luego se conecta a James.</p>

          <label className="mt-5 block text-sm text-neutral-300">Email</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="mt-4 block text-sm text-neutral-300">Password</label>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-black/30 px-3 py-2"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
          />

          <button
            className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-black"
            onClick={() => {
              // login fake
              localStorage.setItem("awcmr_admin", "1");
              router.replace("/admin/pages");
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}