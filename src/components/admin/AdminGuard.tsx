"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // permite la página de login siempre
    if (pathname === "/admin/login") return;

    const ok = localStorage.getItem("awcmr_admin") === "1";
    if (!ok) router.replace("/admin/login");
  }, [pathname, router]);

  return <>{children}</>;
}