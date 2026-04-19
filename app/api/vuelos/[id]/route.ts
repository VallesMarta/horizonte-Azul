import { VueloController } from "@/controllers/vuelo.controller";

/**
 * @swagger
 * /api/vuelos/{id}:
 *   get:
 *     summary: Obtener detalle de un vuelo
 *     tags: [Vuelos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos del vuelo con info del viaje asociado }
 *       404: { description: Vuelo no encontrado }
 *   put:
 *     summary: Actualizar un vuelo (Admin)
 *     tags: [Vuelos]
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
 *               fecSalida: { type: string, format: date }
 *               horaSalida: { type: string }
 *               fecLlegada: { type: string, format: date }
 *               horaLlegada: { type: string }
 *               plazasTotales: { type: integer }
 *               plazasDisponibles: { type: integer }
 *               precio_ajustado: { type: number }
 *               tipo: { type: string, enum: [ida, vuelta] }
 *               estado: { type: string, enum: [programado, abordando, volando, cancelado] }
 *     responses:
 *       200: { description: Vuelo actualizado }
 *       403: { description: No autorizado }
 *       404: { description: No encontrado }
 *   delete:
 *     summary: Eliminar un vuelo (Admin)
 *     tags: [Vuelos]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Vuelo eliminado }
 *       403: { description: No autorizado }
 *       404: { description: No encontrado }
 */
type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  return VueloController.detalle(req, id);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  return VueloController.actualizar(req, id);
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params;
  return VueloController.eliminar(req, id);
}