import { NextResponse } from "next/server";
import { ServicioModel } from "@/models/servicio.model";
import { validarAdmin } from "@/lib/auth-utils";

export const ServicioController = {
  // 1. LISTAR: Público
  async listar() {
    try {
      const servicios = await ServicioModel.getAll();
      return NextResponse.json({ ok: true, resultado: servicios });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: "Error al obtener servicios" },
        { status: 500 },
      );
    }
  },

  // 2. CREAR: Solo Admin
  async crear(req: Request) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const { nombre, tipo_control } = await req.json();

      if (!nombre || nombre.trim() === "") {
        return NextResponse.json(
          { ok: false, error: "El nombre es obligatorio" },
          { status: 400 },
        );
      }

      const valorTipoControl = tipo_control || "texto";
      const result = await ServicioModel.create(
        nombre.trim(),
        valorTipoControl,
      );

      return NextResponse.json({
        ok: true,
        id: result.id,
        mensaje: "Servicio creado correctamente",
      });
    } catch (err: any) {

      // 2. Comprobación estricta de duplicado en Postgres (Código 23505)
      if (err.code === "23505" || err.detail?.includes("already exists")) {
        return NextResponse.json(
          {
            ok: false,
            error: `El servicio ya existe en la base de datos`,
          },
          { status: 400 },
        );
      }

      // 3. Si no es duplicado, devolvemos el error genérico
      return NextResponse.json(
        {
          ok: false,
          error: "Error interno: " + (err.message || "No se pudo guardar"),
        },
        { status: 500 },
      );
    }
  },

  // 3. OBTENER UNO: Público
  async obtenerUno(id: string) {
    try {
      const servicio = await ServicioModel.getById(id);
      if (!servicio) {
        return NextResponse.json(
          { ok: false, error: "Servicio no encontrado" },
          { status: 404 },
        );
      }
      return NextResponse.json({ ok: true, resultado: servicio });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Error en el servidor" },
        { status: 500 },
      );
    }
  },

  // 4. ACTUALIZAR: Solo Admin
  async actualizar(req: Request, id: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const { nombre } = await req.json();
      if (!nombre) {
        return NextResponse.json(
          { ok: false, error: "El nombre es obligatorio" },
          { status: 400 },
        );
      }
      await ServicioModel.update(id, nombre);
      return NextResponse.json({
        ok: true,
        mensaje: "Servicio actualizado correctamente",
      });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Error al actualizar" },
        { status: 400 },
      );
    }
  },

  // 5. ELIMINAR: Solo Admin
  async eliminar(req: Request, id: string) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );

    try {
      const result = await ServicioModel.delete(id);

      // Si el modelo devolvió un array vacío, no existía el registro
      if (!result || result.length === 0) {
        return NextResponse.json(
          { ok: false, error: "Servicio no encontrado" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Servicio eliminado correctamente",
      });
    } catch (err: any) {
      // Código 23503 es el 'Foreign Key Violation' en Postgres
      if (err.code === "23503") {
        return NextResponse.json(
          {
            ok: false,
            error: "No se puede eliminar: está asignado a un viaje",
          },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { ok: false, error: "Error interno" },
        { status: 500 },
      );
    }
  },
};