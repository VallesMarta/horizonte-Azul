import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

type RouteParams = { params: Promise<{ id: string }> };

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
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
        
    const { 
      paisOrigen, aeropuertoOrigen, horaSalida, 
      paisDestino, aeropuertoDestino, horaLlegada, 
      precio, img, descripcion 
    } = body;

    const sql = `
      UPDATE viajes 
      SET paisOrigen = ?, aeropuertoOrigen = ?, horaSalida = ?, 
          paisDestino = ?, aeropuertoDestino = ?, horaLlegada = ?, 
          precio = ?, img = ?, descripcion = ?
      WHERE id = ?
    `;

    const result: any = await query(sql, [
      paisOrigen, aeropuertoOrigen, horaSalida, 
      paisDestino, aeropuertoDestino, horaLlegada, 
      precio, img, descripcion, 
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ ok: false, error: "Viaje no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, mensaje: "Viaje actualizado correctamente" });
  } catch (err) {
    console.error("Error en PUT:", err);
    return NextResponse.json({ ok: false, error: "Error al actualizar el viaje" }, { status: 400 });
  }
}

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