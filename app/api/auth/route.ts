/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Pega aquí el token obtenido en /api/auth/login para acceder a rutas protegidas.
 */

export async function GET() {
  return new Response("Configuración de seguridad activa");
}
