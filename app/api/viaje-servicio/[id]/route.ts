import { ViajeServicioController } from "@/controllers/viaje-servicio.controller";

/**
 * @swagger
 * /api/viaje-servicio/{id}:
 *   get:
 *     summary: Obtener servicios de un viaje
 *     description: Retorna la lista de servicios vinculados a un viaje.
 *     tags: [Viaje-Servicio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *
 *   post:
 *     summary: Vincular nuevo servicio
 *     description: Crea la relación. Retorna 409 si el servicio ya existe.
 *     tags: [Viaje-Servicio]
 *     security: [ { BearerAuth: [] } ]
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
 *             required: [servicio_id]
 *             properties:
 *               servicio_id: { type: integer }
 *               valor: { type: string }
 *               precio_extra: { type: number }
 *     responses:
 *       201: { description: Creado con éxito }
 *       401: { description: No autorizado (Token faltante o inválido) }
 *       403: { description: Acceso denegado (No eres admin) }
 *       409: { description: El servicio ya está vinculado a este viaje }
 *
 *   put:
 *     summary: Actualizar servicio específico
 *     description: Modifica valor/precio. Retorna 404 si no existe la relación o no hay cambios.
 *     tags: [Viaje-Servicio]
 *     security: [ { BearerAuth: [] } ]
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
 *             required: [servicio_id]
 *             properties:
 *               servicio_id: { type: integer }
 *               valor: { type: string }
 *               precio_extra: { type: number }
 *     responses:
 *       200: { description: Actualizado correctamente }
 *       401: { description: No autorizado }
 *       403: { description: Acceso denegado }
 *       404: { description: No encontrado o no hay cambios que aplicar }
 *
 *   delete:
 *     summary: Eliminar relación exacta
 *     description: Desvincula un servicio de un viaje. Retorna 404 si no existe.
 *     tags: [Viaje-Servicio]
 *     security: [ { BearerAuth: [] } ]
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
 *             required: [servicio_id]
 *             properties:
 *               servicio_id: { type: integer }
 *     responses:
 *       200: { description: Eliminado con éxito }
 *       401: { description: No autorizado }
 *       403: { description: Acceso denegado }
 *       404: { description: La relación no existe }
 */

export async function GET(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.obtener(id);
}

export async function POST(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.crear(req, id);
}

export async function PUT(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.actualizar(req, id);
}

export async function DELETE(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.eliminar(req, id);
}
