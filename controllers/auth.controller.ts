import { NextResponse } from "next/server";
import { UsuarioModel } from "@/models/usuario.model";
import { AuthModel } from "@/models/auth.model"; // Asegúrate de crear este modelo
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta";

export const AuthController = {
  /**
   * Registro de nuevos usuarios
   */
  async register(req: Request) {
    try {
      const body = await req.json();
      const { username, password, nombre, email } = body;

      if (!username || !password || !email) {
        return NextResponse.json(
          { ok: false, error: "Faltan datos obligatorios" },
          { status: 400 },
        );
      }

      // Hasheamos la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const result: any = await UsuarioModel.create({
        username,
        password: hashedPassword,
        nombre,
        email,
      });

      return NextResponse.json({
        ok: true,
        resultado: { id: result.insertId, username, nombre, email },
        mensaje: "Usuario creado con éxito.",
      });
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
          { ok: false, error: "El usuario o email ya existe" },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { ok: false, error: "Error interno en el registro" },
        { status: 500 },
      );
    }
  },

  /**
   * Login: Genera JWT y lo registra como SESIÓN ACTIVA
   */
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

      // 1. Generar el Token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          isAdmin: Boolean(user.isAdmin === 1),
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      // 2. Extraer fecha de expiración para la base de datos
      const decoded: any = jwt.decode(token);
      const fechaExp = new Date(decoded.exp * 1000);

      // 3. Registrar la sesión en la tabla 'tokens_activos'
      await AuthModel.registrarSesion(user.id, token, fechaExp);

      return NextResponse.json({
        ok: true,
        token,
        usuario: {
          id: user.id,
          username: user.username,
          isAdmin: Boolean(user.isAdmin === 1),
        },
      });
    } catch (error: any) {
      console.error("Error en Login:", error.message);
      return NextResponse.json(
        { ok: false, error: "Error al iniciar sesión" },
        { status: 500 },
      );
    }
  },

  /**
   * Logout: Elimina el token de la tabla 'tokens_activos'
   */
  async logout(req: Request) {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) return NextResponse.json({ ok: false }, { status: 400 });

      const token = authHeader.split(" ")[1];

      // Intentamos borrar y guardamos el resultado
      const filasBorradas = await AuthModel.eliminarSesion(token);

      if (filasBorradas === 0) {
        return NextResponse.json(
          {
            ok: false,
            mensaje: "La sesión ya no estaba activa o ya se había cerrado",
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        ok: true,
        mensaje: "Sesión cerrada correctamente. Token invalidado.",
      });
    } catch (error: any) {
      return NextResponse.json(
        { ok: false, error: "Error al cerrar sesión" },
        { status: 500 },
      );
    }
  },

  /**
   * Verificar si la sesión sigue activa
   */
  async verificarSesion(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ activa: false }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const activa = await AuthModel.esSesionActiva(token);

    return NextResponse.json({ activa });
  },
};
