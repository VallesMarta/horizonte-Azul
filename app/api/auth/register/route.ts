import { AuthController } from "@/controllers/auth.controller";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una cuenta de usuario con contraseña hasheada.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            required: [username, password, email]
 *            properties:
 *              username:
 *                type: string
 *                example: marta
 *              password:
 *                type: string
 *                format: password
 *                example: "mi_password_segura"
 *              nombre:
 *                type: string
 *                example: "Marta Vallés"
 *              email:
 *                type: string
 *                format: email
 *                example: "marta@horizonteAzul.com"
 *     responses:
 *       200:
 *         description: Usuario creado con éxito.
 *       400:
 *         description: Email o usuario duplicado
 *       500:
 *         description: Error interno.
 */

export async function POST(req: Request) {
  return AuthController.register(req);
}