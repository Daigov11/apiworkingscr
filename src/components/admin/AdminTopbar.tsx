"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StoredUser = {
  id?: string;
  email?: string;
  full_name?: string;
  role?: string;
};

function safeParseUser(raw: string | null): StoredUser | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    return obj as StoredUser;
  } catch {
    return null;
  }
}

// Fallback opcional: intenta sacar nombre/rol del JWT si no existe awcmr_user
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function AdminTopbar() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    // 1) preferimos awcmr_user
    const u = safeParseUser(localStorage.getItem("awcmr_user"));
    if (u) {
      setUser(u);
      return;
    }

    // 2) fallback: token JWT
    const token = localStorage.getItem("awcmr_token");
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        // en tu JWT he visto campos como nombrecompleto/rol a veces
        setUser({
          full_name: payload.full_name || payload.nombrecompleto || payload.nombreCompleto || "Admin",
          role: payload.role || payload.rol || "admin",
          email: payload.email,
          id: payload.idusuario || payload.id,
        });
      }
    }
  }, []);

  function logout() {
    try {
      localStorage.removeItem("awcmr_token");
      localStorage.removeItem("awcmr_user");
    } catch {}
    router.replace("/admin/login");
    router.refresh();
  }

  const fullName = user?.full_name?.trim() || "—";
  const role = user?.role?.trim() || "—";

return (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div className="text-sm font-extrabold text-slate-900">Panel administrador</div>
      <div className="text-xs text-slate-500">Gestiona páginas y configuración</div>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
        {fullName}
      </span>

      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
        Rol: <span className="text-slate-800 font-semibold">{role}</span>
      </span>

      <button
        type="button"
        onClick={logout}
        className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Salir
      </button>
    </div>
  </div>
);
}