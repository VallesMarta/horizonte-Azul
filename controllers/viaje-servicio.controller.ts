import { NextResponse } from "next/server";
import { ViajeServicioModel } from "@/models/viaje-servicio.model";
import { validarAdmin } from "@/lib/auth-utils";

export const ViajeServicioController = {
  async obtener(id: string) {
    try {
      const rows = await ViajeServicioModel.getByViajeId(id);
      return NextResponse.json({ ok: true, resultado: rows });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  async crear(req: Request, viajeId: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const { servicio_id, valor, precio_extra } = await req.json();
      const precioNumerico = parseFloat(precio_extra) || 0;

      const result = await ViajeServicioModel.create(
        viajeId,
        servicio_id,
        String(valor || ""),
        precioNumerico,
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          {
            ok: false,
            mensaje: "Este servicio ya está vinculado a este viaje",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { ok: true, mensaje: "Servicio vinculado correctamente" },
        { status: 201 },
      );
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  async actualizar(req: Request, viajeId: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const { servicio_id, valor, precio_extra } = await req.json();
      const precioNumerico = parseFloat(precio_extra) || 0;

      const result = await ViajeServicioModel.update(
        viajeId,
        servicio_id,
        String(valor || ""),
        precioNumerico,
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          {
            ok: false,
            mensaje: "No se encontró la relación o no hay cambios que aplicar",
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Servicio actualizado con éxito",
      });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  async eliminar(req: Request, viajeId: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const { servicio_id } = await req.json();
      const result = await ViajeServicioModel.deleteSpecific(
        viajeId,
        servicio_id,
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { ok: false, mensaje: "La relación no existe" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Servicio desvinculado con éxito",
      });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },
};
