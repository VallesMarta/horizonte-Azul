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

  async sincronizar(req: Request, viajeId: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const { servicios } = await req.json();

      if (!Array.isArray(servicios))
        return NextResponse.json(
          { ok: false, error: "Formato inválido" },
          { status: 400 },
        );

      const serviciosLimpios = servicios.map((s: any) => ({
        servicio_id: parseInt(s.servicio_id),
        valor: String(s.valor || ""),
        precio_extra: parseFloat(s.precio_extra) || 0,
        incluido: s.incluido === true || s.incluido === "true",
        cantidad_incluida: parseInt(s.cantidad_incluida) || 0,
      }));

      await ViajeServicioModel.sincronizar(viajeId, serviciosLimpios);
      return NextResponse.json({
        ok: true,
        mensaje: "Servicios sincronizados",
      });
    } catch (err: any) {
      console.error("❌ Error en sincronizar:", err.message);
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
      await ViajeServicioModel.create(
        viajeId,
        servicio_id,
        String(valor || ""),
        parseFloat(precio_extra) || 0,
      );
      return NextResponse.json(
        { ok: true, mensaje: "Servicio vinculado" },
        { status: 201 },
      );
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },

  async eliminar(req: Request, id: string | number) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const rows = await ViajeServicioModel.deleteById(id);
      if (!rows.length)
        return NextResponse.json(
          { ok: false, mensaje: "La relación no existe" },
          { status: 404 },
        );
      return NextResponse.json({ ok: true, mensaje: "Servicio desvinculado" });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 500 },
      );
    }
  },
};
