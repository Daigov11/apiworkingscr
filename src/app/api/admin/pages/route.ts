import { NextResponse } from "next/server";

function remoteBase() {
  const base = (process.env.CMS_REMOTE_BASE_URL || "").replace(/\/+$/, "");
  if (!base) throw new Error("Falta CMS_REMOTE_BASE_URL en .env.local");
  return base;
}

export async function GET(req: Request) {
  const base = remoteBase();
  const url = new URL(req.url);

  const auth = req.headers.get("authorization") || "";

  const res = await fetch(`${base}/cms/admin/pages?${url.searchParams.toString()}`, {
    method: "GET",
    headers: { accept: "*/*", Authorization: auth },
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request) {
  const base = remoteBase();
  const auth = req.headers.get("authorization") || "";
  const body = await req.text();

  const res = await fetch(`${base}/cms/admin/pages`, {
    method: "POST",
    headers: { accept: "*/*", Authorization: auth, "Content-Type": "application/json" },
    body,
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}