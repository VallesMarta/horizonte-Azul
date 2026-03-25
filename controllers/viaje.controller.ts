import { NextResponse } from "next/server";
import { ViajeModel } from "@/models/viaje.model";
import { validarAdmin } from "@/lib/auth-utils";

export const ViajeController = {
  // 1. LISTAR TODOS (Público)
  async listar() {
    try {
      const rows = await ViajeModel.getAll();
      const viajes = rows.map((viaje) => ({
        ...viaje,
        precio: parseFloat(viaje.precio),
      }));
      return NextResponse.json({ ok: true, resultado: viajes });
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Error al obtener viajes" }, { status: 500 });
    }
  },

  // 2. OBTENER UNO POR ID (Público)
  async obtenerUno(id: string) {
    try {
      const viaje = await ViajeModel.getById(id);
      if (!viaje) {
        return NextResponse.json({ ok: false, error: "Viaje no encontrado" }, { status: 404 });
      }
      const resultado = { ...viaje, precio: parseFloat(viaje.precio) };
      return NextResponse.json({ ok: true, resultado });
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
    }
  },

  // 3. CREAR VIAJE (Solo Admin)
  async crear(req: Request) {
    // Verificamos si es admin usando tu utilidad de lib/auth-utils
    const auth = await validarAdmin(req);
    if (!auth.autorizado) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    try {
      const body = await req.json();
      const result = await ViajeModel.create(body);
      return NextResponse.json({
        ok: true,
        id: result.insertId,
        mensaje: "Viaje creado exitosamente",
      });
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Error al insertar el viaje" }, { status: 400 });
    }
  },

  // 4. ACTUALIZAR VIAJE (Solo Admin)
  async actualizar(req: Request, id: string) {
    // Verificamos admin
    const auth = await validarAdmin(req);
    if (!auth.autorizado) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    try {
      const body = await req.json();
      
      // Buscamos el viaje actual para no perder datos
      const viajeActual = await ViajeModel.getById(id);
      if (!viajeActual) {
        return NextResponse.json({ ok: false, error: "Viaje no encontrado" }, { status: 404 });
      }

      // Mezclamos: si el body trae el campo lo usamos, si no, el que ya estaba
      const datosActualizados = {
        paisOrigen: body.paisOrigen ?? viajeActual.paisOrigen,
        aeropuertoOrigen: body.aeropuertoOrigen ?? viajeActual.aeropuertoOrigen,
        horaSalida: body.horaSalida ?? viajeActual.horaSalida,
        paisDestino: body.paisDestino ?? viajeActual.paisDestino,
        aeropuertoDestino: body.aeropuertoDestino ?? viajeActual.aeropuertoDestino,
        horaLlegada: body.horaLlegada ?? viajeActual.horaLlegada,
        precio: body.precio ?? viajeActual.precio,
        img: body.img ?? viajeActual.img,
        descripcion: body.descripcion ?? viajeActual.descripcion,
      };

      const result: any = await ViajeModel.update(id, datosActualizados);

      return NextResponse.json({
        ok: true,
        mensaje: "Viaje actualizado correctamente",
      });
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Error al actualizar" }, { status: 400 });
    }
  },

  // 5. ELIMINAR VIAJE (Solo Admin)
  async eliminar(req: Request, id: string) {
    // Verificamos admin
    const auth = await validarAdmin(req);
    if (!auth.autorizado) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    try {
      const result: any = await ViajeModel.delete(id);
      if (result.affectedRows === 0) {
        return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, mensaje: "Viaje eliminado" });
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Error al eliminar" }, { status: 500 });
    }
  },
};