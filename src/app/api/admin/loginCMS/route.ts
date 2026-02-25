import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const base = (process.env.CMS_REMOTE_BASE_URL || "").replace(/\/+$/, "");
  if (!base) {
    return NextResponse.json(
      { codResponse: "0", message: "Falta CMS_REMOTE_BASE_URL", data: null },
      { status: 500 }
    );
  }

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

  // Intentar parsear para extraer token y setear cookie
  try {
    const json = JSON.parse(text);

    if (json?.codResponse === "1" && json?.data?.token) {
      const out = NextResponse.json(json, { status: res.status });

      // Cookie para que /preview funcione (server-side)
      out.cookies.set({
        name: "awcmr_token",
        value: json.data.token,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });

      return out;
    }

    return NextResponse.json(json, { status: res.status });
  } catch {
    // Si no es JSON, devolvemos tal cual
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }
}