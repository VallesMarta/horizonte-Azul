import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const rows = await query('SELECT * FROM reservas WHERE id = ?', [id]);
  return NextResponse.json({ ok: true, resultado: rows });
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { estado, pasajeros } = await request.json();

    const sql = 'UPDATE reservas SET estado = ?, pasajeros = ? WHERE id = ?';
    await query(sql, [estado, pasajeros, id]);

    return NextResponse.json({ ok: true, mensaje: "Reserva actualizada" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error 405 o de sintaxis" }, { status: 405 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  await query('DELETE FROM reservas WHERE id = ?', [id]);
  return NextResponse.json({ ok: true, mensaje: "Reserva eliminada" });
}