import { ReservaController } from "@/controllers/reserva.controller";

/**
 * @swagger
 * /api/reservas/usuario/{id}:
 *   get:
 *     summary: Historial de reservas de un usuario
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 resultado:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       localizador:
 *                         type: string
 *                       codigo_reserva_grupo:
 *                         type: string
 *                       fecCompra:
 *                         type: string
 *                         format: date-time
 *                       pasajeros:
 *                         type: integer
 *                       precioTotal:
 *                         type: number
 *                       estado:
 *                         type: string
 *                         enum: [pendiente, confirmada, realizada, cancelada]
 *                       paisOrigen:
 *                         type: string
 *                       aeropuertoOrigen:
 *                         type: string
 *                       iataOrigen:
 *                         type: string
 *                       paisDestino:
 *                         type: string
 *                       aeropuertoDestino:
 *                         type: string
 *                       iataDestino:
 *                         type: string
 *                       img:
 *                         type: string
 *                       fecSalida:
 *                         type: string
 *                         format: date
 *                       horaSalida:
 *                         type: string
 *                       fecLlegada:
 *                         type: string
 *                         format: date
 *                       horaLlegada:
 *                         type: string
 *                       vuelo_tipo:
 *                         type: string
 *                         enum: [ida, vuelta]
 *                       precio_ajustado:
 *                         type: number
 *                       total_extras_calculado:
 *                         type: number
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No puedes ver las reservas de otro usuario
 */
type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return ReservaController.listarPorUsuario(req, id);
}
