import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta_horizonte_azul";

export async function validarAdmin(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return { autorizado: false, error: "No autorizado", status: 401 };
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Comprobamos si es admin
    if (!decoded.isAdmin) {
      return {
        autorizado: false,
        error: "Acceso denegado: No eres admin",
        status: 403,
      };
    }

    // Si todo está bien, devolvemos los datos del usuario por si los necesitamos
    return { autorizado: true, usuario: decoded };
  } catch (error) {
    return {
      autorizado: false,
      error: "Token inválido o expirado",
      status: 401,
    };
  }
}
