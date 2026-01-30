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

// POST: Crear un nuevo tipo de servicio (ej: 'WiFi', 'Desayuno')
export async function POST(request: Request) {
  try {
    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json({ ok: false, error: "El nombre es obligatorio" }, { status: 400 });
    }

    const sql = 'INSERT INTO servicios (nombre) VALUES (?)';
    const result: any = await query(sql, [nombre]);

    return NextResponse.json({ 
      ok: true, 
      id: result.insertId, 
      mensaje: "Servicio creado correctamente" 
    });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ ok: false, error: "Este servicio ya existe" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}