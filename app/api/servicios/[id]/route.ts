import { ServicioController } from "@/controllers/servicio.controller";

/**
 * @swagger
 * /api/servicios/{id}:
 *   get:
 *     summary: Obtener un servicio específico
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Servicio encontrado.
 *       404:
 *         description: Servicio no encontrado.
 *
 *   put:
 *     summary: Actualizar un servicio
 *     tags: [Servicios]
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
 *               nombre: { type: string, example: "Seguro Premium" }
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (Solo Admin).
 *       404:
 *         description: Servicio no encontrado.
 *
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Servicios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Servicio eliminado correctamente.
 *       403:
 *         description: Acceso denegado (Solo Admin).
 *       500:
 *         description: No se puede eliminar (el servicio podría estar asignado a un viaje).
 */

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ServicioController.obtenerUno(id);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ServicioController.actualizar(request, id);
}

// AQUÍ ESTABA EL ERROR: Ahora pasamos 'request' y luego 'id'
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ServicioController.eliminar(request, id);
}