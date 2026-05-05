import { TarjetaController } from "@/controllers/tarjeta.controller";

/**
 * @swagger
 * /api/tarjetas/{id}:
 *   get:
 *     summary: Obtener tarjetas guardadas de un usuario
 *     description: Retorna la lista de métodos de pago vinculados. El usuario solo puede ver sus propias tarjetas. El admin puede ver las de cualquiera.
 *     tags: [Tarjetas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tarjetas obtenida con éxito
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
 *                       stripePaymentMethodId:
 *                         type: string
 *                       brand:
 *                         type: string
 *                       last4:
 *                         type: string
 *                       expMonth:
 *                         type: integer
 *                       expYear:
 *                         type: integer
 *                       nombreTitular:
 *                         type: string
 *                       esPredeterminada:
 *                         type: boolean
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para ver estas tarjetas
 */
type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return TarjetaController.listarPorUsuario(req, id);
}
