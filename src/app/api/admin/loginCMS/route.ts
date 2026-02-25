import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const base = (process.env.CMS_REMOTE_BASE_URL || "").replace(/\/+$/, "");
  if (!base) return NextResponse.json({ codResponse: "0", message: "Falta CMS_REMOTE_BASE_URL", data: null }, { status: 500 });

  const body = await req.text();

  const res = await fetch(`${base}/api/User/loginCMS`, {
    method: "POST",
    headers: {
      accept: "text/plain",
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