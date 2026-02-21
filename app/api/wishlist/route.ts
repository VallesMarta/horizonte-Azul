import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

// POST: Añadir un viaje a favoritos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario_id, viaje_id } = body;

    // 1. Validación de datos
    if (!usuario_id || !viaje_id) {
      return NextResponse.json(
        { ok: false, error: "Se requieren usuario_id y viaje_id" },
        { status: 400 },
      );
    }

    // 2. Insertar en la tabla wishlist
    const sql = "INSERT INTO wishlist (usuario_id, viaje_id) VALUES (?, ?)";
    await query(sql, [usuario_id, viaje_id]);

    return NextResponse.json({
      ok: true,
      mensaje: "Viaje añadido a tu lista de deseos",
    });
  } catch (err: any) {
    // Si el usuario intenta añadir el mismo viaje dos veces
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { ok: false, error: "Este viaje ya está en tu wishlist" },
        { status: 400 },
      );
    }

    console.error("Error en wishlist POST:", err);
    return NextResponse.json(
      { ok: false, error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}

// DELETE: Quitar de favoritos usando el body
export async function DELETE(request: Request) {
  try {
    const { usuario_id, viaje_id } = await request.json();

    if (!usuario_id || !viaje_id) {
      return NextResponse.json(
        { ok: false, error: "Faltan IDs" },
        { status: 400 },
      );
    }

    const sql = "DELETE FROM wishlist WHERE usuario_id = ? AND viaje_id = ?";
    const result: any = await query(sql, [usuario_id, viaje_id]);

    return NextResponse.json({ ok: true, mensaje: "Eliminado de favoritos" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error al eliminar" },
      { status: 500 },
    );
  }
}
