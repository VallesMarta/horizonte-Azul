import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

export async function GET() {
  try {
    const usuarios = await query('SELECT id, username, nombre, email, isAdmin FROM usuarios');
    return NextResponse.json({ ok: true, resultado: usuarios });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al obtener" }, { status: 500 });
  }
}
