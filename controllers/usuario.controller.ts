import { NextResponse } from "next/server";
import { UsuarioModel } from "@/models/usuario.model";
import { validarAdmin, obtenerSesion } from "@/lib/auth-utils";
import bcrypt from "bcrypt";

export const UsuarioController = {
  // 1. LISTAR: Solo para Administradores
  async listar(req: Request) {
    const auth = await validarAdmin(req);
    if (!auth.autorizado) {
      return NextResponse.json(
        { ok: false, error: auth.error },
        { status: auth.status },
      );
    }

    try {
      const usuarios = await UsuarioModel.getAll();
      return NextResponse.json({ ok: true, resultado: usuarios });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Error al listar usuarios" },
        { status: 500 },
      );
    }
  },

  // 2. OBTENER UNO: Admin o El dueño de la cuenta
  async obtenerUno(req: Request, id: string) {
    // 1. Obtenemos quién está llamando
    const sesion = await obtenerSesion(req);

    if (!sesion) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 },
      );
    }
    // 2. Comprobamos permisos: O es Admin O es el mismo usuario
    const esElPropietario = sesion.id === String(id);

    if (!sesion.isAdmin && !esElPropietario) {
      return NextResponse.json(
        { ok: false, error: "Acceso denegado" },
        { status: 403 },
      );
    }

    try {
      const user = await UsuarioModel.getById(id);
      if (!user)
        return NextResponse.json(
          { ok: false, error: "No encontrado" },
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

  // 3. ACTUALIZAR: Admin o El dueño de la cuenta
  async actualizar(req: Request, id: string) {
    // 1. Usamos la utilidad para saber quién es
    const sesion = await obtenerSesion(req);

    if (!sesion) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 },
      );
    }

    // 2. Comprobamos permisos: O es Admin O es el mismo usuario
    const esElPropietario = sesion.id === String(id);

    if (!sesion.isAdmin && !esElPropietario) {
      return NextResponse.json(
        { ok: false, error: "No puedes editar este perfil" },
        { status: 403 },
      );
    }

    try {
      const body = await req.json();
      const actual = await UsuarioModel.getById(id);

      if (!actual) {
        return NextResponse.json(
          { ok: false, error: "El usuario no existe" },
          { status: 404 },
        );
      }

      // 3. SEGURIDAD: Solo el Admin puede cambiar el rango (isAdmin)
      // Si un usuario normal se edita a sí mismo, mantenemos su valor actual de isAdmin
      let nuevoStatusAdmin = actual.isAdmin;
      if (sesion.isAdmin && body.isAdmin !== undefined) {
        nuevoStatusAdmin = body.isAdmin ? 1 : 0;
      }

      // 4. Preparamos los datos para el Model
      const dataUpdate = {
        username: body.username ?? actual.username,
        nombre: body.nombre ?? actual.nombre,
        email: body.email ?? actual.email,
        isAdmin: nuevoStatusAdmin,
        password: actual.password, // Valor por defecto
      };

      // Si envía password nueva, la hasheamos
      if (body.password && body.password.trim() !== "") {
        dataUpdate.password = await bcrypt.hash(body.password, 10);
      }

      await UsuarioModel.update(id, dataUpdate);

      return NextResponse.json({
        ok: true,
        mensaje: "Usuario actualizado correctamente.",
      });
    } catch (err) {
      console.error("Error en actualización:", err);
      return NextResponse.json(
        { ok: false, error: "Error al procesar la actualización" },
        { status: 400 },
      );
    }
  },

  // 4. ELIMINAR: Solo el mismo usuario o el Admin
  async eliminar(req: Request, id: string) {
    const sesion = await obtenerSesion(req);
    if (!sesion)
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 },
      );

    const esElPropietario = sesion.id === String(id);

    // Si NO es admin Y NO es el dueño -> BLOQUEO
    if (!sesion.isAdmin && !esElPropietario) {
      return NextResponse.json(
        { ok: false, error: "No tienes permiso para borrar este perfil" },
        { status: 403 },
      );
    }

    // Seguridad extra para el admin principal
    if (id === "1")
      return NextResponse.json(
        { ok: false, error: "Acción prohibida" },
        { status: 403 },
      );

    try {
      await UsuarioModel.delete(id);
      return NextResponse.json({
        ok: true,
        mensaje: "Cuenta eliminada correctamente",
      });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Error al eliminar" },
        { status: 500 },
      );
    }
  },
};
