import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Definimos qué rutas queremos proteger
const rutasProtegidas = [
  "/dashboard",
  "/favoritos",
  "/perfil",
  "/perfil/mis-reservas",
  "/perfil/mis-tarjetas",
];
const rutasSoloInvitados = ["/login", "/registro", "/sobre-nosotros"];

export function middleware(request: NextRequest) {
  // Buscamos el token en las cookies (que ahora guardamos con js-cookie)
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Si intenta ir a una ruta protegida y NO tiene token -> al Login
  if (rutasProtegidas.some((ruta) => pathname.startsWith(ruta)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Si YA está logueado e intenta ir a login/registro -> al Inicio
  if (rutasSoloInvitados.includes(pathname) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Si todo está bien, que continúe
  return NextResponse.next();
}

// Filtro para que el middleware no se ejecute en archivos internos de Next ni imágenes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|media).*)"],
};
