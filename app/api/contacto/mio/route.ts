import { NextRequest } from "next/server";
import { getMisConsultas } from "@/controllers/contacto.controller";

/**
 * @swagger
 * /api/contacto/mio:
 *   get:
 *     summary: Listar las consultas del usuario autenticado
 *     description: |
 *       Devuelve todas las conversaciones abiertas por el usuario,
 *       incluyendo el último mensaje y su autor para mostrar el estado.
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consultas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   asunto:
 *                     type: string
 *                   leido:
 *                     type: boolean
 *                   respondido:
 *                     type: boolean
 *                   ultimo_mensaje:
 *                     type: string
 *                     nullable: true
 *                   ultimo_autor:
 *                     type: string
 *                     enum: [usuario, admin]
 *                     nullable: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 */

export async function GET(req: NextRequest) {
  return getMisConsultas(req);
}
