import { NextResponse } from "next/server";

function remoteBase() {
  const base = (process.env.CMS_REMOTE_BASE_URL || "").replace(/\/+$/, "");
  if (!base) throw new Error("Falta CMS_REMOTE_BASE_URL en .env.local");
  return base;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const base = remoteBase();
  const { id } = await params;

  const auth = req.headers.get("authorization") || "";

  const res = await fetch(`${base}/cms/admin/pages/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { accept: "*/*", Authorization: auth },
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const base = remoteBase();
  const { id } = await params;

  const auth = req.headers.get("authorization") || "";
  const body = await req.text();

  const res = await fetch(`${base}/cms/admin/pages/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { accept: "*/*", Authorization: auth, "Content-Type": "application/json" },
    body,
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const base = remoteBase();
  const { id } = await params;

  const auth = req.headers.get("authorization") || "";

  const res = await fetch(`${base}/cms/admin/pages/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { accept: "*/*", Authorization: auth },
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}