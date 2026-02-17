import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const sql = `
      SELECT 
        v.paisOrigen, v.aeropuertoOrigen, v.horaSalida,
        v.paisDestino, v.aeropuertoDestino, v.horaLlegada,
        s.nombre AS servicioNombre, 
        vs.valor AS servicioValor, 
        vs.precio_extra
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      LEFT JOIN viaje_servicio vs ON v.id = vs.viaje_id
      LEFT JOIN servicios s ON vs.servicio_id = s.id
      WHERE r.id = ?
    `;

    const rows = (await query(sql, [id])) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 },
      );
    }

    const primerFila = rows[0];

    const detalle = {
      origen: `${primerFila.paisOrigen} (${primerFila.aeropuertoOrigen})`,
      destino: `${primerFila.paisDestino} (${primerFila.aeropuertoDestino})`,
      horaSalida: primerFila.horaSalida,
      horaLlegada: primerFila.horaLlegada,
      duracion: "Directo", 
      servicios: rows
        .filter((r: any) => r.servicioNombre !== null)
        .map((r: any) => ({
          nombre: r.servicioNombre,
          valor: r.servicioValor,
          precio_extra: parseFloat(r.precio_extra) || 0,
        })),
    };

    return NextResponse.json(detalle);
  } catch (err: any) {
    console.error("Error en API detalles:", err.message);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}