import { ReservaController } from "@/controllers/reserva.controller";

/**
 * @swagger
 * /api/reservas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una reserva (solo Admin)
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a cancelar
 *     responses:
 *       200:
 *         description: Reserva cancelada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 resultado:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     estado:
 *                       type: string
 *                       enum: [cancelada]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores pueden cancelar reservas
 */
type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const cancelReq = new Request(req.url, {
    method: "PATCH",
    headers: req.headers,
    body: JSON.stringify({ estado: "cancelada" }),
  });
  return ReservaController.actualizar(cancelReq, id);
}
