import { NextResponse } from "next/server";
import { UsuarioModel } from "@/models/usuario.model";
import { AuthModel } from "@/models/auth.model";
import { obtenerSesion } from "@/lib/auth-utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "clave_super_secreta_horizonte_azul";

export const AuthController = {
  async register(req: Request) {
    try {
      const body = await req.json();
      const { username, password, nombre, email } = body;

      if (!username || !password || !email) {
        return NextResponse.json(
          { ok: false, error: "Faltan datos" },
          { status: 400 },
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userCreado: any = await UsuarioModel.create({
        username,
        password: hashedPassword,
        nombre,
        email,
      });

      return NextResponse.json({
        ok: true,
        resultado: { id: userCreado.id, username, nombre, email },
        mensaje: "Usuario creado con éxito.",
      });
    } catch (error: any) {
      if (error.code === "23505") {
        return NextResponse.json(
          { ok: false, error: "Usuario o email ya existe" },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { ok: false, error: "Error en registro" },
        { status: 500 },
      );
    }
  },

  async login(req: Request) {
    try {
      const { username, password } = await req.json();
      const user = await UsuarioModel.getByUsername(username);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json(
          { ok: false, error: "Credenciales inválidas" },
          { status: 401 },
        );
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      const decoded: any = jwt.decode(token);
      const fechaExp = new Date(decoded.exp * 1000);

      await AuthModel.registrarSesion(user.id, token, fechaExp);

      return NextResponse.json({
        ok: true,
        token,
        usuario: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { ok: false, error: "Error en login" },
        { status: 500 },
      );
    }
  },

  async logout(req: Request) {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) return NextResponse.json({ ok: false }, { status: 400 });
      const token = authHeader.split(" ")[1];

      const filasBorradas = await AuthModel.eliminarSesion(token);

      if (filasBorradas === 0) {
        return NextResponse.json(
          { ok: false, mensaje: "Sesión no activa" },
          { status: 400 },
        );
      }

      return NextResponse.json({ ok: true, mensaje: "Sesión cerrada" });
    } catch (error: any) {
      return NextResponse.json(
        { ok: false, error: "Error logout" },
        { status: 500 },
      );
    }
  },

  async verificarSesion(req: Request) {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader)
        return NextResponse.json({ activa: false }, { status: 401 });
      const token = authHeader.split(" ")[1];
      const activa = await AuthModel.esSesionActiva(token);
      return NextResponse.json({ activa });
    } catch (error) {
      return NextResponse.json({ activa: false }, { status: 500 });
    }
  },
  async cambiarPassword(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion) {
        return NextResponse.json(
          { ok: false, error: "No autorizado" },
          { status: 401 },
        );
      }

      const { passwordActual, nuevaPassword } = await req.json();
      const user = await UsuarioModel.getById(sesion.id);
      if (!user) {
        return NextResponse.json(
          { ok: false, error: "Usuario no encontrado" },
          { status: 404 },
        );
      }
      const passwordCorrecta = await bcrypt.compare(
        passwordActual,
        user.password,
      );
      if (!passwordCorrecta) {
        return NextResponse.json(
          { ok: false, error: "La contraseña actual es incorrecta" },
          { status: 400 },
        );
      }
      const hashedNuevaPassword = await bcrypt.hash(nuevaPassword, 10);

      const dataUpdate = {
        ...user,
        password: hashedNuevaPassword,
      };

      await UsuarioModel.update(sesion.id, dataUpdate);

      return NextResponse.json({
        ok: true,
        mensaje: "Contraseña actualizada con éxito",
      });
    } catch (error) {
      console.error("Error cambiando password:", error);
      return NextResponse.json(
        { ok: false, error: "Error interno del servidor" },
        { status: 500 },
      );
    }
  },
};
