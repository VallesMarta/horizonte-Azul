import { ReservaController } from "@/controllers/reserva.controller";

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Listar todas las reservas de la plataforma
 *     tags: [Reservas]
 *     security: [ { BearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Lista completa de reservas.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (No es admin).
 *
 *   post:
 *     summary: "Procesar nueva reserva"
 *     description: "Crea una reserva y registra el pago. El sistema identifica al usuario automáticamente mediante el Token Bearer."
 *     tags: [Reservas]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [viaje_id, fecSalida, pasajeros, total]
 *             properties:
 *               viaje_id: { type: integer, description: "ID del viaje seleccionado" }
 *               fecSalida: { type: string, format: date, description: "Fecha programada del viaje" }
 *               pasajeros: { type: integer, minimum: 1 }
 *               save_card: { type: boolean, description: "¿Guardar tarjeta para futuros pagos?" }
 *               card_last4: { type: string, maxLength: 4 }
 *               tipo_tarjeta: { type: string, example: "Visa" }
 *     responses:
 *       201: { description: "Reserva y pago creados con éxito" }
 *       401: { description: "No autorizado: Debes enviar un Token válido" }
 *       500: { description: "Error interno: Fallo en la transacción" }
 */
// GET para el Admin
export async function GET(req: Request) {
  return ReservaController.listarTodasAdmin(req);
}

// POST para el Checkout
export async function POST(req: Request) {
  return ReservaController.procesarCheckout(req);
}
