import { NextRequest } from "next/server";
import {
  marcarLeida,
  eliminarNotificacion,
} from "@/controllers/notificacion.controller";

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   patch:
 *     summary: Marcar una notificación como leída
 *     description: Marca una notificación específica como leída para el usuario autenticado.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación a marcar como leída
 *     responses:
 *       200:
 *         description: Notificación marcada como leída exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 usuario_id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 mensaje:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 leida:
 *                   type: boolean
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Notificación no encontrada o no pertenece al usuario
 *  delete:
 *    summary: Eliminar una notificación
 *    description: Elimina una notificación específica para el usuario autenticado.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación eliminada
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return marcarLeida(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return eliminarNotificacion(req, { params });
}
