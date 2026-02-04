import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    mensaje: "Sesión cerrada correctamente"
  });

  // Si usamos cookies para guardar el token, aquí las eliminamos
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0), // Fecha en el pasado para borrarla ya
    path: '/',
  });

  return response;
}