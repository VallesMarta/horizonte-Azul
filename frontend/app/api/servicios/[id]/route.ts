import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

type RouteParams = { params: Promise<{ id: string }> };

// GET: Obtener un servicio específico por su ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const rows = await query('SELECT * FROM servicios WHERE id = ?', [id]) as any[];

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Servicio no encontrado" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      ok: true, 
      resultado: rows[0] 
    });
  } catch (err) {
    console.error("Error al obtener el servicio:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}

// PUT: Renombrar un servicio
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { nombre } = await request.json();

    await query('UPDATE servicios SET nombre = ? WHERE id = ?', [nombre, id]);

    return NextResponse.json({ ok: true, mensaje: "Servicio actualizado" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al actualizar" }, { status: 400 });
  }
}

// DELETE: Eliminar un servicio
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    await query('DELETE FROM servicios WHERE id = ?', [id]);

    return NextResponse.json({ ok: true, mensaje: "Servicio eliminado" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al eliminar" }, { status: 500 });
  }
}