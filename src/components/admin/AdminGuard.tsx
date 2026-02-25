"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (path === "/admin/login") return;
    const token = localStorage.getItem("awcmr_token");
    if (!token) router.replace("/admin/login");
  }, [path, router]);

  return <>{children}</>;
}