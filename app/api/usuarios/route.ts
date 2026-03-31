import { UsuarioController } from "@/controllers/usuario.controller";

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener lista completa de usuarios
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No eres admin
 */

export async function GET(req: Request) {
  return UsuarioController.listar(req);
}
