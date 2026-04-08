import { NextResponse } from "next/server";
import { UsuarioModel } from "@/models/usuario.model";
import { validarAdmin, obtenerSesion } from "@/lib/auth-utils";

export const UsuarioController = {
  async listar(req: Request) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado)
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );
    try {
      const usuarios = await UsuarioModel.getAll();
      return NextResponse.json({ ok: true, resultado: usuarios });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Error al listar" },
        { status: 500 },
      );
    }
  },

  async obtenerUno(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion)
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 },
      );

    const esElPropietario = String(sesion.id) === String(id);
    if (!sesion.isAdmin && !esElPropietario)
      return NextResponse.json(
        { ok: false, error: "Acceso denegado" },
        { status: 403 },
      );

    try {
      const user = await UsuarioModel.getById(id);
      if (!user)
        return NextResponse.json(
          { ok: false, error: "Usuario no encontrado" },
          { status: 404 },
        );

      const { password, ...datosPublicos } = user;
      return NextResponse.json({ ok: true, resultado: datosPublicos });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Error de servidor" },
        { status: 500 },
      );
    }
  },

  async actualizar(req: Request, id: string) {
    try {
      const body = await req.json();
      const actual = await UsuarioModel.getById(id);

      if (!actual)
        return NextResponse.json(
          { ok: false, error: "Usuario no existe" },
          { status: 404 },
        );

      // Lógica de fusión de datos
      const dataUpdate = {
        username: body.username ?? actual.username,
        nombre: body.nombre ?? actual.nombre,
        apellidos: body.apellidos ?? actual.apellidos,
        email: body.email ?? actual.email,
        isAdmin: actual.isAdmin,
        password: actual.password,
        telefono: body.telefono ?? actual.telefono,
        fecNacimiento: body.fecNacimiento ?? actual.fecNacimiento,
        tipoDocumento: body.tipoDocumento ?? actual.tipoDocumento,
        numDocumento: body.numDocumento ?? actual.numDocumento,
        paisEmision: body.paisEmision ?? actual.paisEmision,
        fecCaducidadDocumento: body.fecCaducidadDocumento ?? actual.fecCaducidadDocumento,
        fotoPerfil: body.fotoPerfil ?? actual.fotoPerfil,
      };

      await UsuarioModel.update(id, dataUpdate);
      return NextResponse.json({
        ok: true,
        mensaje: "Pasaporte actualizado correctamente",
      });
    } catch (err) {
      console.error("Error en Update:", err);
      return NextResponse.json(
        { ok: false, error: "Error al actualizar datos" },
        { status: 400 },
      );
    }
  },

  async eliminar(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion || (!sesion.isAdmin && String(sesion.id) !== String(id))) {
      return NextResponse.json(
        { ok: false, error: "Sin permisos" },
        { status: 403 },
      );
    }
    try {
      await UsuarioModel.delete(id);
      return NextResponse.json({ ok: true, mensaje: "Usuario eliminado" });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Error al eliminar" },
        { status: 500 },
      );
    }
  },
};
