import { ReservaController } from "@/controllers/reserva.controller";

/**
 * @swagger
 * /api/reservas/{id}:
 *   get:
 *     summary: Obtener detalle completo de una reserva
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Detalle completo de la reserva
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
 *                     localizador:
 *                       type: string
 *                     codigo_reserva_grupo:
 *                       type: string
 *                       format: uuid
 *                     fecCompra:
 *                       type: string
 *                       format: date-time
 *                     pasajeros:
 *                       type: integer
 *                     precioTotal:
 *                       type: number
 *                     precio_vuelo_historico:
 *                       type: number
 *                     total_extras_historico:
 *                       type: number
 *                     estado:
 *                       type: string
 *                       enum: [pendiente, confirmada, realizada, cancelada]
 *                     paisOrigen:
 *                       type: string
 *                     aeropuertoOrigen:
 *                       type: string
 *                     iataOrigen:
 *                       type: string
 *                     paisDestino:
 *                       type: string
 *                     aeropuertoDestino:
 *                       type: string
 *                     iataDestino:
 *                       type: string
 *                     fecSalida:
 *                       type: string
 *                       format: date
 *                     horaSalida:
 *                       type: string
 *                     fecLlegada:
 *                       type: string
 *                       format: date
 *                     horaLlegada:
 *                       type: string
 *                     vuelo_tipo:
 *                       type: string
 *                       enum: [ida, vuelta]
 *                     usuario_nombre:
 *                       type: string
 *                     usuario_email:
 *                       type: string
 *                     pasajeros:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           apellidos:
 *                             type: string
 *                           tipoDocumento:
 *                             type: string
 *                             enum: [DNI, NIE, NIF, Pasaporte]
 *                           numDocumento:
 *                             type: string
 *                           fecNacimiento:
 *                             type: string
 *                             format: date
 *                           fecCaducidadDocumento:
 *                             type: string
 *                             format: date
 *                           esAdulto:
 *                             type: boolean
 *                     serviciosIncluidos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           detalle:
 *                             type: string
 *                           cantidad:
 *                             type: integer
 *                           precio:
 *                             type: number
 *                     extras:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           detalle:
 *                             type: string
 *                           cantidad:
 *                             type: integer
 *                           precio:
 *                             type: number
 *                           subtotal:
 *                             type: number
 *                           tipo_vuelo:
 *                             type: string
 *                             enum: [ida, vuelta, ambos]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado — la reserva no pertenece al usuario
 *       404:
 *         description: Reserva no encontrada
 */
type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  return ReservaController.obtenerDetalle(req, id);
}
