import { TarjetaController } from "@/controllers/tarjeta.controller";

/**
 * @swagger
 * /api/tarjetas:
 *   post:
 *     summary: Guardar una nueva tarjeta
 *     description: Obtiene los detalles desde Stripe con el paymentMethodId y guarda la tarjeta en la base de datos.
 *     tags: [Tarjetas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethodId]
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *                 example: "pm_1ABC..."
 *     responses:
 *       200:
 *         description: Tarjeta guardada correctamente
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
 *                     id:
 *                       type: integer
 *                     stripePaymentMethodId:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     last4:
 *                       type: string
 *                     expMonth:
 *                       type: integer
 *                     expYear:
 *                       type: integer
 *                     nombreTitular:
 *                       type: string
 *                     esPredeterminada:
 *                       type: boolean
 *       400:
 *         description: paymentMethodId obligatorio
 *       401:
 *         description: No autorizado
 *
 *   delete:
 *     summary: Eliminar una tarjeta guardada
 *     description: Desvincula el método de pago en Stripe y lo elimina de la base de datos local.
 *     tags: [Tarjetas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethodId]
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *                 example: "pm_1ABC..."
 *     responses:
 *       200:
 *         description: Tarjeta eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 mensaje:
 *                   type: string
 *       400:
 *         description: paymentMethodId obligatorio
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Tarjeta no encontrada o no pertenece al usuario
 */
export async function POST(req: Request) {
  return TarjetaController.crear(req);
}

export async function DELETE(req: Request) {
  return TarjetaController.eliminar(req);
}
