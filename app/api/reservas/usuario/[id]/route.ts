import { ReservaController } from "@/controllers/reserva.controller";

/**
 * @swagger
 * /api/reservas/usuario/{id}:
 *   get:
 *     summary: Obtener historial de reservas de un usuario
 *     description: Retorna todas las reservas vinculadas a un ID de usuario.
 *     tags: [Reservas]
 *     security: [ { BearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario del que se quiere el historial
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida con éxito.
 *       401:
 *         description: No autorizado (Token faltante o expirado).
 *       403:
 *         description: Prohibido (No puedes ver el historial de otro usuario si no eres admin).
 *       500:
 *         description: Error interno del servidor.
 */

export async function GET(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.listarPorUsuario(req, id);
}