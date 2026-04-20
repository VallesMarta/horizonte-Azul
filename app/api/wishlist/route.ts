import { WishlistController } from "@/controllers/wishlist.controller";

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Añadir viaje a favoritos
 *     tags: [Wishlist]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [viaje_id]
 *             properties:
 *               viaje_id: { type: integer }
 *     responses:
 *       200: { description: Añadido a favoritos }
 *       401: { description: No autorizado }
 *
 *   delete:
 *     summary: Quitar viaje de favoritos
 *     tags: [Wishlist]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [viaje_id]
 *             properties:
 *               viaje_id: { type: integer }
 *     responses:
 *       200: { description: Eliminado de favoritos }
 *       401: { description: No autorizado }
 */

export async function POST(req: Request) {
  return WishlistController.añadir(req);
}

export async function DELETE(req: Request) {
  return WishlistController.quitar(req);
}