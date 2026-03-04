import { NextResponse } from "next/server";

function pickClientIp(headers: Headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "0.0.0.0";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nombreCompleto = String(body?.nombreCompleto || "").trim();
    const telefono = String(body?.telefono || "").trim();
    const nombreNegocio = String(body?.nombreNegocio || "").trim();
    const giroNegocio = String(body?.giroNegocio || "").trim();

    if (!nombreCompleto || !telefono || !nombreNegocio || !giroNegocio) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    const base =
      (process.env.CMS_REMOTE_BASE_URL || "https://api-centralizador.apiworking.pe").replace(/\/+$/, "");

    // ✅ destinatarios hardcodeados por ahora (puedes mover esto a env luego)
    const destinatarios =
      (process.env.CONTACT_RECIPIENTS || "rexlobo45699@gmail.com")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    const payload = {
      nombreCompleto,
      telefono,
      nombreNegocio,
      giroNegocio,
      ipCreacion: pickClientIp(req.headers),
      destinatarios,
    };

    const res = await fetch(`${base}/api/Administrativo/sendFormContact`, {
      method: "POST",
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const raw = await res.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: parsed?.message || "Error enviando formulario.", raw: parsed },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Error inesperado" },
      { status: 500 }
    );
  }
}