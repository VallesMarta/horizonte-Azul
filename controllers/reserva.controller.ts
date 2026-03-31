import { NextResponse } from "next/server";
import { ReservaModel } from "@/models/reserva.model";
import { validarAdmin, obtenerSesion } from "@/lib/auth-utils";

export const ReservaController = {
  // Checkout
  async procesarCheckout(req: Request) {
    const sesion = await obtenerSesion(req);
    if (!sesion)
      return NextResponse.json(
        { ok: false, error: "No autorizado." },
        { status: 401 },
      );

    try {
      const {
        viaje_id,
        fecSalida,
        pasajeros,
        total,
        save_card,
        card_last4,
        tipo_tarjeta,
      } = await req.json();

      await ReservaModel.startTransaction();
      try {
        const resReserva = await ReservaModel.createReserva({
          usuario_id: sesion.id,
          viaje_id,
          fecSalida,
          pasajeros,
        });
        const reservaId = resReserva.insertId;

        let metodoPagoId = null;
        if (save_card) {
          const resCard = await ReservaModel.saveMetodoPago(
            Number(sesion.id),
            card_last4 || "0000",
            tipo_tarjeta || "Visa",
          );
          metodoPagoId = resCard.insertId;
        }

        await ReservaModel.registrarPago({
          reservaId,
          usuario_id: sesion.id,
          metodoPagoId,
          total,
          brand: tipo_tarjeta || "Visa",
        });
        await ReservaModel.commit();
        return NextResponse.json({ ok: true, reservaId }, { status: 201 });
      } catch (err: any) {
        await ReservaModel.rollback();
        throw err;
      }
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },
  // GET /api/reservas (Admin)
  async listarTodasAdmin(req: Request) {
    // 1. Verificamos que sea ADMIN
    const auth = await validarAdmin(req);
    if (!auth.autorizado) {
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );
    }

    try {
      const todas = await ReservaModel.getAllAdmin();
      return NextResponse.json({ ok: true, resultado: todas });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },
  // Historial
  async listarPorUsuario(req: Request, targetId: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion || (sesion.id !== targetId && !sesion.isAdmin)) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 403 },
      );
    }
    const data = await ReservaModel.getByUsuarioId(targetId);
    return NextResponse.json(data);
  },

  // Detalle / Voucher
  async obtenerDetalle(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    const rows = await ReservaModel.getVoucherDetalle(id);
    if (!rows.length)
      return NextResponse.json({ error: "No existe" }, { status: 404 });

    // Seguridad: Solo el dueño o el admin ven el voucher
    if (rows[0].usuario_id.toString() !== sesion?.id && !sesion?.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const primerFila = rows[0];
    const detalle = {
      ...primerFila,
      servicios: rows
        .filter((r: any) => r.servicioNombre)
        .map((r: any) => ({
          nombre: r.servicioNombre,
          valor: r.servicioValor,
          precio: parseFloat(r.precio_extra) || 0,
        })),
    };
    return NextResponse.json(detalle);
  },

 async actualizar(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

    try {
      const body = await req.json();
      const { estado, pasajeros, fecSalida, viaje_id } = body;
      
      const reservaActual = await ReservaModel.getById(id);
      if (!reservaActual) return NextResponse.json({ ok: false, error: "Reserva no encontrada" }, { status: 404 });

      // SEGURIDAD: Solo el dueño o Admin
      const esDueno = String(reservaActual.usuario_id) === sesion.id;
      if (!esDueno && !sesion.isAdmin) {
        return NextResponse.json({ ok: false, error: "Acceso denegado: No tienes permiso" }, { status: 403 });
      }

      // Consolidar datos (si no vienen en el body, se quedan los que ya estaban)
      const nuevosDatos = {
        estado: estado || reservaActual.estado,
        pasajeros: pasajeros !== undefined ? pasajeros : reservaActual.pasajeros,
        fecSalida: fecSalida || reservaActual.fecSalida,
        viaje_id: viaje_id || reservaActual.viaje_id
      };

      await ReservaModel.updateFull(id, nuevosDatos);

      return NextResponse.json({ 
        ok: true, 
        mensaje: "Reserva actualizada correctamente" 
      });

    } catch (err: any) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
  },
  // DELETE: Solo Admin
  async eliminar(req: Request, id: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json({ error: auth.error }, { status: 403 });
    await ReservaModel.delete(id);
    return NextResponse.json({ ok: true, mensaje: "Eliminado" });
  },
};
