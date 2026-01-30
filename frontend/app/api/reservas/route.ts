import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

export async function GET() {
  try {
    const sql = `
      SELECT r.*, u.nombre AS nombre_usuario, v.destino 
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN viajes v ON r.viaje_id = v.id
    `;
    const rows = await query(sql);
    return NextResponse.json({ ok: true, resultado: rows });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al listar" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario_id, viaje_id, fecSalida, pasajeros } = body;

    // Buscamos el nombre del usuario para insertarlo en la tabla reservas
    const userRow = await query('SELECT nombre FROM usuarios WHERE id = ?', [usuario_id]) as any[];
    const nombreUsuario = userRow[0]?.nombre || 'Usuario';

    const sql = `
      INSERT INTO reservas (usuario_id, viaje_id, nombre, fecSalida, pasajeros, estado)
      VALUES (?, ?, ?, ?, ?, 'pendiente')
    `;
    
    const result: any = await query(sql, [usuario_id, viaje_id, nombreUsuario, fecSalida, pasajeros || 1]);

    return NextResponse.json({ ok: true, id: result.insertId });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al crear" }, { status: 500 });
  }
}