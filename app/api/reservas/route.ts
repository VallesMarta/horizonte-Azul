import { ReservaController } from "@/controllers/reserva.controller";
import { TarjetaModel } from "@/models/tarjeta.model";

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Listar todas las reservas (solo Admin)
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de reservas
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
 *                       paisOrigen:
 *                         type: string
 *                       aeropuertoOrigen:
 *                         type: string
 *                       paisDestino:
 *                         type: string
 *                       aeropuertoDestino:
 *                         type: string
 *                       fecSalida:
 *                         type: string
 *                         format: date
 *                       vuelo_tipo:
 *                         type: string
 *                         enum: [ida, vuelta]
 *                       usuario_nombre:
 *                         type: string
 *                       usuario_email:
 *                         type: string
 *       403:
 *         description: No autorizado — solo administradores
 *
 *   post:
 *     summary: Procesar checkout y crear reserva
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vuelosIds, pasajeros, metodo, precioTotal]
 *             properties:
 *               vuelosIds:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [vuelo_id, tipo]
 *                   properties:
 *                     vuelo_id:
 *                       type: integer
 *                     tipo:
 *                       type: string
 *                       enum: [ida, vuelta]
 *               pasajeros:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [nombre, apellidos, tipoDocumento, numDocumento, fecNacimiento]
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     apellidos:
 *                       type: string
 *                     tipoDocumento:
 *                       type: string
 *                       enum: [DNI, NIE, NIF, Pasaporte]
 *                     numDocumento:
 *                       type: string
 *                     fecNacimiento:
 *                       type: string
 *                       format: date
 *                     fecCaducidadDocumento:
 *                       type: string
 *                       format: date
 *               extras:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     servicio_id:
 *                       type: integer
 *                     nombre_servicio:
 *                       type: string
 *                     valor_seleccionado:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *                     precio_extra:
 *                       type: number
 *                     tipo_vuelo:
 *                       type: string
 *                       enum: [ida, vuelta, ambos]
 *               metodo:
 *                 type: string
 *                 enum: [tarjeta, transferencia, paypal]
 *               paymentMethodId:
 *                 type: string
 *                 description: Token de Stripe (obligatorio si metodo es tarjeta)
 *                 example: "pm_1ABC..."
 *               precioTotal:
 *                 type: number
 *               guardarTarjeta:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Reserva confirmada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *                 resultado:
 *                   type: object
 *                   properties:
 *                     codigoGrupo:
 *                       type: string
 *                       format: uuid
 *                     total:
 *                       type: number
 *                     reservas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           localizador:
 *                             type: string
 *       400:
 *         description: Faltan datos obligatorios
 *       401:
 *         description: Debes iniciar sesión para realizar una reserva
 *       402:
 *         description: Pago rechazado por Stripe
 *       409:
 *         description: Sin plazas disponibles en el vuelo
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (searchParams.get("action") === "get_cards" && userId) {
    const tarjetas = await TarjetaModel.getByUsuarioId(Number(userId));
    return Response.json(tarjetas);
  }

  return ReservaController.listarTodasAdmin(req);
}

export async function POST(req: Request) {
  return ReservaController.procesarCheckout(req);
}
