import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "clave_super_secreta_horizonte_azul";

function extraerToken(req: Request): string | null {
  return req.headers.get("authorization")?.split(" ")[1] ?? null;
}

export async function validarAdmin(req: Request) {
  try {
    const token = extraerToken(req);
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

// Esta función solo extrae los datos
export async function obtenerSesion(req: Request) {
  try {
    const token = extraerToken(req);
    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Devolvemos un objeto limpio con lo que necesitamos
    return {
      id: String(decoded.id || decoded.sub),
      isAdmin:
        decoded.isAdmin === true ||
        decoded.isAdmin === 1 ||
        decoded.role === "admin",
      username: decoded.username,
      email: decoded.email,
    };
  } catch (error) {
    return null; // Si el token es falso o expiró, devolvemos null
  }
}
