import { NextResponse } from "next/server";
import { getCurrentBd } from "@/lib/api/bd";

function remoteBase() {
  const base = (process.env.CMS_REMOTE_BASE_URL || "").replace(/\/+$/, "");
  if (!base) throw new Error("Falta CMS_REMOTE_BASE_URL en .env.local");
  return base;
}

export async function GET(req: Request) {
  const base = remoteBase();
  const bd = getCurrentBd();
  const auth = req.headers.get("authorization") || "";

  const url = new URL(req.url);
  url.searchParams.set("bd", bd);

  const res = await fetch(`${base}/layout/footer?${url.searchParams.toString()}`, {
    method: "GET",
    headers: { accept: "*/*", Authorization: auth },
    cache: "no-store",
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}