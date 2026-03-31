import { AuthController } from "@/controllers/auth.controller";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags:
 *       - Autenticación
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión finalizada
 *       400:
 *         description: No había sesión activa
 */

export async function POST(req: Request) {
  return AuthController.logout(req);
}
