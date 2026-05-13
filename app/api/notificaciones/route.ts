import { NextRequest } from "next/server";
import {
  getNotificaciones,
  marcarTodasLeidas,
  eliminarNotificaciones,
} from "@/controllers/notificacion.controller";

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Obtener notificaciones del usuario
 *     description: Obtiene todas las notificaciones del usuario autenticado y el contador de no leídas.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notificaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificaciones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       usuario_id:
 *                         type: integer
 *                       titulo:
 *                         type: string
 *                       mensaje:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       leida:
 *                         type: boolean
 *                       fecha_creacion:
 *                         type: string
 *                         format: date-time
 *                 no_leidas:
 *                   type: integer
 *                   description: Cantidad de notificaciones no leídas
 *       401:
 *         description: No autorizado
 *
 *   patch:
 *     summary: Marcar todas las notificaciones como leídas
 *     description: Marca todas las notificaciones del usuario autenticado como leídas.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Todas las notificaciones marcadas como leídas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *       401:
 *         description: No autorizado
 *   delete:
 *     summary: Eliminar notificaciones (todas o solo leídas)
 *     description: Elimina las notificaciones del usuario. Si se pasa el parámetro solo_leidas=true, solo borrará esas.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: query
 *         name: solo_leidas
 *         schema:
 *           type: boolean
 *         description: Si es true, solo elimina las notificaciones ya leídas.
 *     responses:
 *       200:
 *         description: Eliminación exitosa
 */ 

export async function GET(req: NextRequest) {
  return getNotificaciones(req);
}

export async function PATCH(req: NextRequest) {
  return marcarTodasLeidas(req);
}

export async function DELETE(req: NextRequest) {
  return eliminarNotificaciones(req);
}