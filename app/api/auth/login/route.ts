import { AuthController } from "@/controllers/auth.controller";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              username: { type: string, example: username }
 *              password: { type: string, example: "pAssw0rd" }
 *     responses:
 *       200:
 *         description: Login exitoso.
 *       401:
 *         description: Credenciales incorrectas.
 */

export async function POST(req: Request) {
  return AuthController.login(req);
}