import { NextResponse } from 'next/server';
import { query } from '@/config/db.config';

// GET: Obtener todos los viajes
export async function GET() {
  try {
    const sql = 'SELECT * FROM viajes ORDER BY created_at DESC';
    const rows = await query(sql) as any[];
    
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
      paisOrigen, aeropuertoOrigen, horaSalida,
      paisDestino, aeropuertoDestino, horaLlegada,
      precio, img, descripcion 
    } = body;

    // Ahora tenemos 9 columnas y 9 valores
    const sql = `
      INSERT INTO viajes (paisOrigen, aeropuertoOrigen, horaSalida, paisDestino, aeropuertoDestino, horaLlegada, precio, img, descripcion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result: any = await query(sql, [
      paisOrigen, aeropuertoOrigen, horaSalida, 
      paisDestino, aeropuertoDestino, horaLlegada, 
      precio, img, descripcion
    ]);

    return NextResponse.json({ ok: true, id: result.insertId });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error al insertar" }, { status: 400 });
  }
}