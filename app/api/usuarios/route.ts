import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

export async function GET() {
  try {
    const sql = `
        SELECT 
            id, 
            username, 
            nombre, 
            email, 
            isAdmin,
            (SELECT COUNT(*) FROM reservas WHERE usuario_id = usuarios.id) AS total_reservas
        FROM usuarios
    `;

    const usuarios = await query(sql);

    return NextResponse.json({ 
      ok: true, 
      resultado: usuarios 
    });
    
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    return NextResponse.json({ 
      ok: false, 
      error: "Error al obtener la lista de usuarios" 
    }, { status: 500 });
  }
}