import { ReservaController } from "@/controllers/reserva.controller";

/**
 * @swagger
 * /api/reservas/{id}:
 *   get:
 *     summary: "Obtener detalle de reserva"
 *     tags: [Reservas]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: "Detalles obtenidos" }
 *       403: { description: "Acceso denegado: No es tu reserva" }
 *       404: { description: "No encontrada" }
 *
 *   put:
 *     summary: "Modificar reserva"
 *     description: "Permite modificar viaje, fecha, pasajeros y estado."
 *     tags: [Reservas]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               viaje_id: { type: integer, example: 5 }
 *               fecSalida: { type: string, format: date, example: "2024-10-15" }
 *               pasajeros: { type: integer, example: 3 }
 *               estado: { type: string, enum: [pendiente, confirmada, realizada, cancelada] }
 *     responses:
 *       200: { description: "Reserva actualizada correctamente" }
 *       401: { description: "Token inválido o expirado" }
 *       403: { description: "Acceso denegado: No tienes permiso" }
 *       404: { description: "Reserva no encontrada" }
 *
 *   delete:
 *     summary: "Eliminar reserva"
 *     tags: [Reservas]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: "Reserva eliminada de la base de datos" }
 *       403: { description: "Acceso denegado: No eres admin" }
 */

export async function GET(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.obtenerDetalle(req, id);
}

export async function PUT(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.actualizar(req, id);
}

export async function DELETE(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.eliminar(req, id);
}