import { ServicioController } from "@/controllers/servicio.controller";

/**
 * @swagger
 * /api/servicios:
 *   get:
 *     summary: Obtener catálogo de servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida con éxito.
 *       500:
 *         description: Error al obtener servicios.
 * 
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: { type: string, example: "Seguro de Cancelación" }
 *               tipo_control: { type: string, example: "booleano" }
 *     responses:
 *       200:
 *         description: Servicio creado correctamente.
 *       400:
 *         description: El nombre es obligatorio o servicio duplicado.
 *       401:
 *         description: No autorizado (Token faltante o inválido).
 *       403:
 *         description: Acceso denegado (No eres admin).
 */

export async function GET() {
  return ServicioController.listar();
}

export async function POST(req: Request) {
  return ServicioController.crear(req);
}
