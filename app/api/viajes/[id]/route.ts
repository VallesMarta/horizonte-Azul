import { ViajeController } from "@/controllers/viaje.controller";

/**
 * @swagger
 * /api/viajes/{id}:
 *   get:
 *     summary: Obtener detalle de un viaje
 *     tags: [Viajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del viaje obtenidos.
 *       404:
 *         description: Viaje no encontrado.
 *
 *   put:
 *     summary: Actualizar un viaje existente
 *     tags: [Viajes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paisOrigen: { type: string, example: "España" }
 *               aeropuertoOrigen: { type: string, example: "Valencia" }
 *               horaSalida: { type: string, example: "08:00:00" }
 *               paisDestino: { type: string, example: "Irlanda" }
 *               aeropuertoDestino: { type: string, example: "Dublin" }
 *               horaLlegada: { type: string, example: "10:30:00" }
 *               precio: { type: number, example: 150.50 }
 *               img: { type: string, example: "https://imagen.com/foto.jpg" }
 *               descripcion: { type: string, example: "Descripción editada" }
 *     responses:
 *       200:
 *         description: Viaje actualizado con éxito.
 *       403:
 *         description: No tienes permisos de administrador.
 *       404:
 *         description: Viaje no encontrado.
 *
 *   delete:
 *     summary: Eliminar un viaje
 *     tags: [Viajes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Viaje eliminado correctamente.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: No encontrado.
 */

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.obtenerUno(id);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.actualizar(request, id);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.eliminar(request, id);
}
