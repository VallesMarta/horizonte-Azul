import { ViajeController } from "@/controllers/viaje.controller";

/**
 * @swagger
 * /api/viajes/{id}:
 *   get:
 *     summary: Obtener detalle completo de un viaje
 *     description: Retorna el viaje con sus vuelos disponibles y servicios asociados.
 *     tags: [Viajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detalle del viaje obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 resultado:
 *                   type: object
 *                   properties:
 *                     viaje: { type: object }
 *                     vuelos: { type: array, items: { type: object } }
 *                     servicios: { type: array, items: { type: object } }
 *       404:
 *         description: Viaje no encontrado.
 *
 *   put:
 *     summary: Actualizar un viaje existente (Admin)
 *     tags: [Viajes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paisOrigen: { type: string, example: "España" }
 *               aeropuertoOrigen: { type: string, example: "Valencia" }
 *               iataOrigen: { type: string, example: "VLC" }
 *               paisDestino: { type: string, example: "Irlanda" }
 *               aeropuertoDestino: { type: string, example: "Galway" }
 *               iataDestino: { type: string, example: "GWY" }
 *               img: { type: string, example: "https://imagen.com/foto.jpg" }
 *               descripcion: { type: string, example: "Descripción del destino" }
 *     responses:
 *       200: { description: Viaje actualizado con éxito. }
 *       401: { description: Token faltante o inválido. }
 *       403: { description: No tienes permisos de administrador. }
 *       404: { description: Viaje no encontrado. }
 *
 *   delete:
 *     summary: Eliminar un viaje y sus vuelos (Admin)
 *     description: Elimina el viaje en cascada — borra también sus vuelos y servicios asociados.
 *     tags: [Viajes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Viaje eliminado correctamente. }
 *       401: { description: Token faltante o inválido. }
 *       403: { description: No autorizado. }
 *       404: { description: No encontrado. }
 */

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.detalle(id);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.actualizar(request, id);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.eliminar(request, id);
}
