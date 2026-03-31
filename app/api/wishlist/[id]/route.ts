import { WishlistController } from "@/controllers/wishlist.controller";

/**
 * @swagger
 * /api/wishlist/{id}:
 *   get:
 *     summary: Obtener favoritos de un usuario
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de viajes favoritos obtenida.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: No puedes ver la lista de otro usuario.
 *       500:
 *         description: Error interno.
 */

type RouteParams = { params: Promise<{ id?: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  // Pasamos 'params' y 'req' para que el controlador pueda validar el Token
  return WishlistController.listarPorUsuario(params, req);
}