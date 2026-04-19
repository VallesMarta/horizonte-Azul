import { NextResponse } from "next/server";
import { ViajeModel } from "@/models/viaje.model";
import { VueloModel } from "@/models/vuelo.model";
import { query } from "@/config/db.config";
import { validarAdmin } from "@/lib/auth-utils";

export const ViajeController = {
  // MÉTODO PARA LISTAR TODOS (GRID)
  async listar() {
    try {
      const viajesRaw = await ViajeModel.getAll();
      const viajes = (viajesRaw || []).map((v: any) => ({
        ...v,
        // Mantener fallback por si la imagen es null
        img: v.img || "",
      }));

      return NextResponse.json({
        ok: true,
        resultado: viajes,
      });
    } catch (err: any) {
      console.error("❌ Error en listar:", err.message);
      return NextResponse.json({ ok: false, resultado: [] }, { status: 500 });
    }
  },

  // MÉTODO PARA EL DETALLE DE UN VIAJE
  async detalle(id: string) {
    try {
      const viajeRaw = await ViajeModel.getById(id);

      if (!viajeRaw) {
        return NextResponse.json(
          { ok: false, error: "No encontrado" },
          { status: 404 },
        );
      }

      const vuelosRaw = await VueloModel.getByViajeId(id);
      const serviciosRaw = await query(
        `
        SELECT vs.*, s.nombre, s.tipo_control 
        FROM viaje_servicio vs
        JOIN servicios s ON vs.servicio_id = s.id
        WHERE vs.viaje_id = $1
      `,
        [id],
      );

      const dataMapeada = {
        viaje: {
          ...viajeRaw,
          img: viajeRaw.img || "",
        },
        vuelos: (vuelosRaw || []).map((v: any) => ({
          ...v,
          precio_ajustado: v.precio_ajustado || 0,
        })),
        servicios: serviciosRaw,
      };

      return NextResponse.json({
        ok: true,
        resultado: dataMapeada,
      });
    } catch (err: any) {
      console.error("❌ Error en detalle:", err.message);
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
        paisOrigen,
        aeropuertoOrigen,
        iataOrigen,
        paisDestino,
        aeropuertoDestino,
        iataDestino,
        img,
        descripcion,
      } = body;

      if (
        !paisOrigen ||
        !aeropuertoOrigen ||
        !paisDestino ||
        !aeropuertoDestino
      ) {
        return NextResponse.json(
          { ok: false, error: "Faltan campos obligatorios" },
          { status: 400 },
        );
      }

      const resultado = await ViajeModel.create({
        paisOrigen,
        aeropuertoOrigen,
        iataOrigen,
        paisDestino,
        aeropuertoDestino,
        iataDestino,
        precio: 0,
        img,
        descripcion,
      });

      return NextResponse.json({ ok: true, resultado }, { status: 201 });
    } catch (err: any) {
      console.error("❌ Error en crear:", err.message);
      return NextResponse.json(
        { ok: false, error: "Error al crear el viaje" },
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
      await ViajeModel.update(id, body);
      return NextResponse.json({ ok: true, mensaje: "Viaje actualizado" });
    } catch (err: any) {
      console.error("❌ Error en actualizar:", err.message);
      return NextResponse.json(
        { ok: false, error: "Error al actualizar" },
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
      await ViajeModel.delete(id);
      return NextResponse.json({ ok: true, mensaje: "Viaje eliminado" });
    } catch (err: any) {
      console.error("❌ Error en eliminar:", err.message);
      return NextResponse.json(
        { ok: false, error: "Error al eliminar" },
        { status: 500 },
      );
    }
  },
};
