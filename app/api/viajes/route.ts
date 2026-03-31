import { ViajeController } from "@/controllers/viaje.controller";

/**
 * @swagger
 * /api/viajes:
 *   get:
 *     summary: Obtener todos los viajes
 *     tags: [Viajes]
 *     responses:
 *       200:
 *         description: Lista de viajes obtenida.
 * 
 *   post:
 *     summary: Crear un nuevo viaje
 *     tags: [Viajes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paisOrigen, aeropuertoOrigen, paisDestino, precio]
 *             properties:
 *               paisOrigen: { type: string, example: "España" }
 *               aeropuertoOrigen: { type: string, example: "Madrid-Barajas" }
 *               horaSalida: { type: string, example: "12:00:00" }
 *               paisDestino: { type: string, example: "Francia" }
 *               aeropuertoDestino: { type: string, example: "París-CDG" }
 *               horaLlegada: { type: string, example: "14:30:00" }
 *               precio: { type: number, example: 120.99 }
 *               img: { type: string, example: "https://url-imagen.com/paris.jpg" }
 *               descripcion: { type: string, example: "Escapada romántica a París." }
 *     responses:
 *       200:
 *         description: Viaje creado exitosamente.
 *       400:
 *         description: Error en los datos enviados.
 *       403:
 *         description: No autorizado (Solo administradores).
 */

export async function GET() {
  return ViajeController.listar();
}

export async function POST(req: Request) {
  // El controlador ya usa validarAdmin(req), así que solo le pasamos el req
  return ViajeController.crear(req);
}