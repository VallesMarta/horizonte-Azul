import { NextRequest } from "next/server";
import {
  getMiConsulta,
  responderComoUsuario,
} from "@/controllers/contacto.controller";

/**
 * @swagger
 * /api/contacto/mio/{id}:
 *   get:
 *     summary: Obtener el hilo de una consulta propia
 *     description: |
 *       Devuelve el array de mensajes del hilo de la consulta indicada.
 *       Solo accesible por el usuario propietario de la consulta.
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del mensaje de contacto
 *     responses:
 *       200:
 *         description: Array de mensajes del hilo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 987
 *                   contacto_id:
 *                     type: integer
 *                     example: 123
 *                   autor:
 *                     type: string
 *                     enum: [usuario, admin]
 *                     example: usuario
 *                   contenido:
 *                     type: string
 *                     example: Gracias, revisen mi reserva.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-05-11T12:34:56Z
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Consulta no encontrada o no pertenece al usuario
 *   post:
 *     summary: Responder en el hilo como usuario
 *     description: |
 *       El usuario añade un mensaje al hilo de su propia consulta.
 *       Marca automáticamente la conversación como pendiente
 *       para que el admin sepa que hay una nueva réplica.
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contenido]
 *             properties:
 *               contenido:
 *                 type: string
 *                 example: Gracias, pero tengo otra duda sobre el equipaje.
 *     responses:
 *       200:
 *         description: Mensaje añadido al hilo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 987
 *                 contacto_id:
 *                   type: integer
 *                   example: 123
 *                 autor:
 *                   type: string
 *                   enum: [usuario, admin]
 *                   example: usuario
 *                 contenido:
 *                   type: string
 *                   example: Gracias, revisen mi reserva.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-05-11T12:34:56Z
 *       400:
 *         description: Contenido vacío
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Consulta no encontrada o no pertenece al usuario
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return getMiConsulta(req, { params });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return responderComoUsuario(req, { params });
}
