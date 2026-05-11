import { NextRequest } from "next/server";
import {
  getMensaje,
  responderMensaje,
  eliminarMensaje,
} from "@/controllers/contacto.controller";

/**
 * @swagger
 * /api/contacto/{id}:
 *   get:
 *     summary: Obtener un mensaje de contacto por ID
 *     description: Devuelve los datos del mensaje y lo marca como leído automáticamente. Solo admin.
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
 *         description: Datos del mensaje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 123
 *                 nombre:
 *                   type: string
 *                   example: Ana García
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: ana@ejemplo.com
 *                 asunto:
 *                   type: string
 *                   example: Consulta de vuelo
 *                 mensaje:
 *                   type: string
 *                   example: Quisiera cambiar el asiento.
 *                 usuario_id:
 *                   type: integer
 *                   nullable: true
 *                   example: 45
 *                 leido:
 *                   type: boolean
 *                   example: false
 *                 respondido:
 *                   type: boolean
 *                   example: false
 *                 respuesta:
 *                   type: string
 *                   nullable: true
 *                   example: Hola, tu consulta está en proceso.
 *                 fecha_respuesta:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-05-11T12:34:56Z
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Mensaje no encontrado
 *   post:
 *     summary: Responder a un mensaje de contacto (admin)
 *     description: Guarda la respuesta del admin, envía email al usuario y genera notificación interna si tiene cuenta. Solo admin.
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
 *             required: [respuesta]
 *             properties:
 *               respuesta:
 *                 type: string
 *                 example: Hola Ana, hemos revisado tu reserva y todo está en orden.
 *     responses:
 *       200:
 *         description: Respuesta enviada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Respuesta vacía
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mensaje no encontrado
 *   delete:
 *     summary: Eliminar un mensaje de contacto
 *     description: Elimina el mensaje y todo su hilo de conversación. Solo admin.
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mensaje eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return getMensaje(req, { params });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return responderMensaje(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return eliminarMensaje(req, { params });
}
