import { AuthController } from "@/controllers/auth.controller";

/**
 * @swagger
 *      /api/auth/cambiar-password:
 *        post:
 *          summary: Actualizar la contraseña del usuario autenticado
 *          description: Permite al usuario cambiar su clave actual por una nueva. 
 *          tags: [Autenticación]
 *          security:
 *            - bearerAuth: []
 *          requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  required:
 *                    - passwordActual
 *                    - nuevaPassword
 *                  properties:
 *                    passwordActual:
 *                      type: string
 *                      format: password
 *                      description: La contraseña que el usuario tiene actualmente  
 *                    nuevaPassword:
 *                      type: string
 *                      format: password
 *                      description: La nueva contraseña (mínimo 4 caracteres)
 *          responses:
 *            200:
 *              description: Contraseña actualizada con éxito 
 *            400:
 *              description: Datos inválidos o contraseña actual incorrecta  
 *            401:
 *              description: No autorizado 
 *            404:
 *              description: Usuario no encontrado 
 *            500:
 *              description: Error interno del servidor 
 */

export async function POST(req: Request) {
  return AuthController.cambiarPassword(req);
}