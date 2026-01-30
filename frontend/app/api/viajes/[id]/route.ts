import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

type RouteParams = { params: Promise<{ id: string }> };

// 1. GET: Detalle de un viaje
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM viajes WHERE id = ?', [id]) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Viaje no encontrado" }, { status: 404 });
    }

    const viaje = { ...rows[0], precio: parseFloat(rows[0].precio) };
    return NextResponse.json({ ok: true, resultado: viaje });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}

// 2. PUT: Actualizar un viaje existente
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json(); // Corregido a request.json()
    
    const { 
      origen, origenAeropuerto, 
      destino, destinoAeropuerto, 
      precio, img, descripcion 
    } = body;

    const sql = `
      UPDATE viajes 
      SET origen = ?, origenAeropuerto = ?, destino = ?, destinoAeropuerto = ?, 
          precio = ?, img = ?, descripcion = ?
      WHERE id = ?
    `;

    await query(sql, [
      origen, 
      origenAeropuerto, 
      destino, 
      destinoAeropuerto, 
      precio, 
      img, 
      descripcion,
      id
    ]);

    return NextResponse.json({ ok: true, mensaje: "Viaje actualizado" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al actualizar" }, { status: 400 });
  }
}

// 3. DELETE: Eliminar viaje
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result: any = await query('DELETE FROM viajes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, mensaje: "Viaje eliminado" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al eliminar" }, { status: 500 });
  }
}