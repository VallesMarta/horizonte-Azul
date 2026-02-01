import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

// GET: Obtener todos los servicios disponibles
export async function GET() {
  try {
    const sql = 'SELECT * FROM servicios ORDER BY nombre ASC';
    const servicios = await query(sql);
    
    return NextResponse.json({ ok: true, resultado: servicios });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al obtener servicios" }, { status: 500 });
  }
}

// POST: Creación de un servicio 
export async function POST(request: Request) {
  try {
    const { nombre, tipo_control } = await request.json();

    if (!nombre) {
      return NextResponse.json({ ok: false, error: "El nombre es obligatorio" }, { status: 400 });
    }

    // Si por alguna razón no llega el tipo, le asignamos 'texto' por defecto
    const valorTipoControl = tipo_control || 'texto';
    const sql = 'INSERT INTO servicios (nombre, tipo_control) VALUES (?, ?)';
    const result: any = await query(sql, [nombre, valorTipoControl]);

    return NextResponse.json({ 
      ok: true, 
      id: result.insertId, 
      mensaje: "Servicio creado correctamente" 
    });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ ok: false, error: "Este servicio ya existe" }, { status: 400 });
    }
    console.error("Error en DB:", err);
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}