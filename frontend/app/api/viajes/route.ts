import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

// GET: Obtener todos los viajes
export async function GET() {
  try {
    const sql = 'SELECT * FROM viajes ORDER BY created_at DESC';
    const rows = await query(sql) as any[];

    // Limpiamos los datos: convertimos el precio de string a número
    const viajes = rows.map(viaje => ({
      ...viaje,
      precio: parseFloat(viaje.precio)
    }));

    return NextResponse.json({ ok: true, resultado: viajes });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al obtener viajes" }, { status: 500 });
  }
}

// POST: Crear un nuevo viaje
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      origen, 
      origenAeropuerto, 
      destino, 
      destinoAeropuerto, 
      precio, 
      img, 
      descripcion 
    } = body;

    const sql = `
      INSERT INTO viajes (origen, origenAeropuerto, destino, destinoAeropuerto, precio, img, descripcion) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result: any = await query(sql, [
      origen, 
      origenAeropuerto, 
      destino, 
      destinoAeropuerto, 
      precio, 
      img, 
      descripcion
    ]);

    return NextResponse.json({ 
      ok: true, 
      id: result.insertId,
      mensaje: "Viaje creado correctamente" 
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al crear el viaje" }, { status: 400 });
  }
}