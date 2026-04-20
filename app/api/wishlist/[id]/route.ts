import { WishlistController } from "@/controllers/wishlist.controller";

/**
 * @swagger
 * /api/wishlist/{id}:
 *   get:
 *     summary: Obtener favoritos de un usuario
 *     description: El usuario solo puede ver sus propios favoritos. El admin puede ver los de cualquiera.
 *     tags: [Wishlist]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de viajes favoritos.
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
 *                       viaje_id: { type: integer }
 *                       paisDestino: { type: string }
 *                       aeropuertoDestino: { type: string }
 *                       iataDestino: { type: string }
 *                       img: { type: string }
 *                       precio_oferta: { type: number }
 *       401: { description: No autorizado }
 *       403: { description: No puedes ver los favoritos de otro usuario }
 */
type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return WishlistController.listarPorUsuario(req, id);
}