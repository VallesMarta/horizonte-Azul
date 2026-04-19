import { NextResponse } from "next/server";
import { VueloModel } from "@/models/vuelo.model";
import { validarAdmin } from "@/lib/auth-utils";

export const VueloController = {
  async listarPorViaje(viajeId: string, esAdmin = false) {
    try {
      const vuelos = esAdmin
        ? await VueloModel.getByViajeIdAdmin(viajeId)
        : await VueloModel.getByViajeId(viajeId);
      return NextResponse.json({ ok: true, resultado: vuelos });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Error al obtener vuelos" },
        { status: 500 },
      );
    }
  },

  async detalle(req: Request, id: string) {
    try {
      const vuelo = await VueloModel.getById(id);
      if (!vuelo)
        return NextResponse.json(
          { ok: false, error: "Vuelo no encontrado" },
          { status: 404 },
        );
      return NextResponse.json({ ok: true, resultado: vuelo });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Error interno" },
        { status: 500 },
      );
    }
  },

  async crear(req: Request) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const body = await req.json();
      const {
        viaje_id,
        fecSalida,
        horaSalida,
        fecLlegada,
        horaLlegada,
        plazasTotales,
        precio_ajustado,
        tipo,
        estado,
      } = body;

      if (
        !viaje_id ||
        !fecSalida ||
        !horaSalida ||
        !fecLlegada ||
        !horaLlegada ||
        !tipo
      ) {
        return NextResponse.json(
          { ok: false, error: "Faltan campos obligatorios" },
          { status: 400 },
        );
      }

      const vuelo = await VueloModel.create({
        viaje_id,
        fecSalida,
        horaSalida,
        fecLlegada,
        horaLlegada,
        plazasTotales: plazasTotales ?? 150,
        plazasDisponibles: plazasTotales ?? 150,
        precio_ajustado,
        tipo,
        estado: estado ?? "programado",
      });

      return NextResponse.json({ ok: true, resultado: vuelo }, { status: 201 });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Error al crear vuelo" },
        { status: 500 },
      );
    }
  },

  async actualizar(req: Request, id: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const body = await req.json();
      const vuelo = await VueloModel.update(id, body);
      if (!vuelo)
        return NextResponse.json(
          { ok: false, error: "Vuelo no encontrado" },
          { status: 404 },
        );
      return NextResponse.json({ ok: true, resultado: vuelo });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Error al actualizar vuelo" },
        { status: 500 },
      );
    }
  },

  async eliminar(req: Request, id: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const rows = await VueloModel.delete(id);
      if (!rows.length)
        return NextResponse.json(
          { ok: false, error: "Vuelo no encontrado" },
          { status: 404 },
        );
      return NextResponse.json({ ok: true, mensaje: "Vuelo eliminado" });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Error al eliminar vuelo" },
        { status: 500 },
      );
    }
  },
};
