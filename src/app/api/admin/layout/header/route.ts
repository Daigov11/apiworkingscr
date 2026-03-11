import { NextResponse } from "next/server";
import { getCurrentBd } from "@/lib/api/bd";

function remoteBase() {
  const base = (process.env.CMS_REMOTE_BASE_URL || "").replace(/\/+$/, "");
  if (!base) throw new Error("Falta CMS_REMOTE_BASE_URL en .env.local");
  return base;
}

function buildUrl(req: Request) {
  const base = remoteBase();
  const bd = getCurrentBd();
  const url = new URL(req.url);

  url.searchParams.set("bd", bd);

  return `${base}/admin/layout/header?${url.searchParams.toString()}`;
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";

  const res = await fetch(buildUrl(req), {
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

export async function PUT(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const body = await req.text();

  const res = await fetch(buildUrl(req), {
    method: "PUT",
    headers: {
      accept: "*/*",
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body,
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}