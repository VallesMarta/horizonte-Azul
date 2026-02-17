import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // Este 'id' representa al usuario_id

    // Consulta avanzada para traer detalles del viaje y del pago
    const sql = `
        SELECT 
            r.id AS reserva_id,
            v.paisOrigen,    -- ¡Asegúrate de tener esto!
            v.aeropuertoOrigen,
            v.paisDestino,
            v.aeropuertoDestino,
            v.img,
            r.estado,
            p.monto AS total_pagado,
            r.fecSalida,
            r.pasajeros,
            p.tipo_tarjeta
        FROM reservas r
        JOIN viajes v ON r.viaje_id = v.id
        LEFT JOIN pagos p ON r.id = p.reserva_id
        WHERE r.usuario_id = ?
    `;

    const rows = await query(sql, [id]);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error al obtener reservas del usuario:", err);
    return NextResponse.json(
      { ok: false, error: "Error al cargar el historial" },
      { status: 500 },
    );
  }
}
