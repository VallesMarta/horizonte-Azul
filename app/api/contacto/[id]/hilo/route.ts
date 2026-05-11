import { NextRequest } from "next/server";
import { getHilo, responderHilo } from "@/controllers/contacto.controller";

/**
 * @swagger
 * /api/contacto/{id}/hilo:
 *   get:
 *     summary: Obtener el hilo de conversación (admin)
 *     description: Devuelve todos los mensajes del hilo ordenados cronológicamente. Solo admin.
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
 *       403:
 *         description: Acceso denegado
 *   post:
 *     summary: Añadir mensaje al hilo como admin
 *     description: |
 *       El admin escribe en el hilo de conversación.
 *       Automáticamente marca el mensaje como respondido,
 *       envía un email al usuario y crea una notificación interna
 *       si el usuario tiene cuenta registrada.
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
 *                 example: Hola, hemos revisado tu caso y podemos gestionar el cambio.
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
 *         description: Conversación no encontrada
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return getHilo(req, { params });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return responderHilo(req, { params });
}
