import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. Verificamos si la reserva existe y si se puede cancelar
    const checkSql = "SELECT estado FROM reservas WHERE id = ?";
    const currentReserva = (await query(checkSql, [id])) as any[];

    if (!currentReserva || currentReserva.length === 0) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 },
      );
    }

    if (currentReserva[0].estado === "cancelada") {
      return NextResponse.json(
        { error: "La reserva ya está cancelada" },
        { status: 400 },
      );
    }

    // 2. Actualizamos el estado a 'cancelada'
    const updateSql = "UPDATE reservas SET estado = 'cancelada' WHERE id = ?";
    await query(updateSql, [id]);
    
    return NextResponse.json({ message: "Reserva cancelada exitosamente" });
  } catch (err: any) {
    console.error("Error al cancelar reserva:", err.message);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}