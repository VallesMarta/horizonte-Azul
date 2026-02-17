import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      usuario_id, viaje_id, fecSalida, pasajeros, 
      total, save_card, card_last4, tipo_tarjeta 
    } = body;

    // Validación básica
    if (!usuario_id || !viaje_id || !fecSalida || !total) {
      return NextResponse.json({ ok: false, error: "Datos incompletos" }, { status: 400 });
    }

    // Validación de fecha
    const fechaSalidaDate = new Date(fecSalida);
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    if (fechaSalidaDate < hoy) {
      return NextResponse.json({ ok: false, error: "La fecha no puede ser pasada" }, { status: 400 });
    }

    const brand = tipo_tarjeta || "Visa";
    const last4 = card_last4 || "0000";

    await query("START TRANSACTION", []);

    try {
      // 1. Insertar Reserva
      const sqlReserva = `
        INSERT INTO reservas (usuario_id, viaje_id, fecSalida, pasajeros, estado)
        VALUES (?, ?, ?, ?, 'confirmada')
      `;
      const resReserva: any = await query(sqlReserva, [usuario_id, viaje_id, fecSalida, pasajeros]);
      const reservaId = resReserva.insertId;

      let metodoPagoId = null; // Iniciamos en null

      // 2. Si el check "save_card" es true, guardamos el método
      if (save_card) {
        const sqlCard = `
          INSERT INTO metodos_pago (usuario_id, last4, marca, token_simulado)
          VALUES (?, ?, ?, ?)
        `;
        const resCard: any = await query(sqlCard, [
          usuario_id, last4, brand, `tok_${Math.random().toString(36).substr(2, 9)}`
        ]);
        metodoPagoId = resCard.insertId; // Ahora tiene un ID real
      }

      // 3. Registrar el Pago (VINCULADO A LA RESERVA)
      // Si metodoPagoId es null, la FK pagos.metodo_pago_id debe permitir NULL en SQL
      const sqlPago = `
        INSERT INTO pagos (reserva_id, usuario_id, metodo_pago_id, monto, metodo, estado, tipo_tarjeta)
        VALUES (?, ?, ?, ?, 'tarjeta', 'exitoso', ?)
      `;
      await query(sqlPago, [reservaId, usuario_id, metodoPagoId, total, brand]);

      await query("COMMIT", []);
      return NextResponse.json({ ok: true, reservaId });

    } catch (dbError: any) {
      await query("ROLLBACK", []);
      return NextResponse.json({ ok: false, error: dbError.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: "Error de servidor interno" }, { status: 500 });
  }
}