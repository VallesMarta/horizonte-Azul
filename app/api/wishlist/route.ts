import { WishlistController } from "@/controllers/wishlist.controller";

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Añadir a la wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               viaje_id: { type: integer, example: 5 }
 *     responses:
 *       200:
 *         description: Añadido correctamente.
 *       401:
 *         description: Inicia sesión primero.
 * 
 *   delete:
 *     summary: Quitar de la wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               viaje_id: { type: integer, example: 5 }
 *     responses:
 *       200:
 *         description: Eliminado correctamente.
 */

export async function POST(req: Request) {
  return WishlistController.añadir(req);
}

export async function DELETE(req: Request) {
  return WishlistController.quitar(req);
}