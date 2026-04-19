import { ViajeServicioController } from "@/controllers/viaje-servicio.controller";

/**
 * @swagger
 * /api/viaje-servicio/{id}:
 *   get:
 *     summary: Obtener servicios de un viaje
 *     description: Retorna todos los registros de servicios vinculados a un viaje, incluyendo si están incluidos, el precio extra y la cantidad incluida gratis.
 *     tags: [Viaje-Servicio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del viaje
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de servicios del viaje.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 resultado:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       servicio_id: { type: integer }
 *                       nombre: { type: string }
 *                       tipo_control: { type: string, enum: [numero, texto, booleano] }
 *                       valor: { type: string }
 *                       precio_extra: { type: number }
 *                       incluido: { type: boolean }
 *                       cantidad_incluida: { type: integer }
 *
 *   put:
 *     summary: Sincronizar servicios de un viaje (Admin)
 *     description: >
 *       Reemplaza TODOS los servicios del viaje con el array enviado.
 *       Permite múltiples registros del mismo servicio (ej. maleta incluida gratis + maleta de pago).
 *       La operación hace DELETE + INSERT en bloque.
 *     tags: [Viaje-Servicio]
 *     security: [ { BearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del viaje
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [servicios]
 *             properties:
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [servicio_id]
 *                   properties:
 *                     servicio_id: { type: integer, example: 1 }
 *                     valor: { type: string, example: "true" }
 *                     precio_extra: { type: number, example: 40.00 }
 *                     incluido: { type: boolean, example: false }
 *                     cantidad_incluida: { type: integer, example: 0 }
 *           example:
 *             servicios:
 *               - servicio_id: 1
 *                 valor: "1"
 *                 precio_extra: 0
 *                 incluido: true
 *                 cantidad_incluida: 1
 *               - servicio_id: 1
 *                 valor: "1"
 *                 precio_extra: 40
 *                 incluido: false
 *                 cantidad_incluida: 0
 *     responses:
 *       200: { description: Servicios sincronizados correctamente. }
 *       400: { description: Formato inválido — se esperaba un array. }
 *       401: { description: Token faltante o inválido. }
 *       403: { description: Acceso denegado — no eres admin. }
 *
 *   post:
 *     summary: Añadir un servicio individual al viaje (Admin)
 *     description: Inserta un único registro sin reemplazar los existentes.
 *     tags: [Viaje-Servicio]
 *     security: [ { BearerAuth: [] } ]
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
 *             required: [servicio_id]
 *             properties:
 *               servicio_id: { type: integer }
 *               valor: { type: string }
 *               precio_extra: { type: number }
 *               incluido: { type: boolean }
 *               cantidad_incluida: { type: integer }
 *     responses:
 *       201: { description: Servicio vinculado correctamente. }
 *       401: { description: No autorizado. }
 *       403: { description: Acceso denegado. }
 *
 *   delete:
 *     summary: Eliminar un registro de servicio por su ID (Admin)
 *     description: Elimina un registro concreto usando el ID de la tabla viaje_servicio, no el servicio_id.
 *     tags: [Viaje-Servicio]
 *     security: [ { BearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro en viaje_servicio (no el servicio_id)
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Servicio desvinculado correctamente. }
 *       401: { description: No autorizado. }
 *       403: { description: Acceso denegado. }
 *       404: { description: El registro no existe. }
 */

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  return ViajeServicioController.obtener(id);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  return ViajeServicioController.sincronizar(req, id);
}

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  return ViajeServicioController.crear(req, id);
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params;
  return ViajeServicioController.eliminar(req, id);
}
