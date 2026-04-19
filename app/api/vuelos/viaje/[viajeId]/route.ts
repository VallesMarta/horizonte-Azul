import { VueloController } from "@/controllers/vuelo.controller";

/**
 * @swagger
 * /api/vuelos/viaje/{viajeId}:
 *   get:
 *     summary: Listar vuelos disponibles de un viaje
 *     tags: [Vuelos]
 *     parameters:
 *       - in: path
 *         name: viajeId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de vuelos futuros con plazas disponibles.
 *   post:
 *     summary: Crear un nuevo vuelo para un viaje (Admin)
 *     tags: [Vuelos]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: viajeId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fecSalida, horaSalida, fecLlegada, horaLlegada, tipo]
 *             properties:
 *               fecSalida: { type: string, format: date, example: "2026-06-15" }
 *               horaSalida: { type: string, example: "08:00" }
 *               fecLlegada: { type: string, format: date, example: "2026-06-15" }
 *               horaLlegada: { type: string, example: "10:45" }
 *               plazasTotales: { type: integer, example: 150 }
 *               precio_ajustado: { type: number, example: 145.99 }
 *               tipo: { type: string, enum: [ida, vuelta], example: "ida" }
 *               estado: { type: string, enum: [programado, abordando, volando, cancelado], example: "programado" }
 *     responses:
 *       201: { description: Vuelo creado correctamente }
 *       400: { description: Faltan campos obligatorios }
 *       403: { description: No autorizado }
 */
type Params = { params: Promise<{ viajeId: string }> };

export async function GET(req: Request, { params }: Params) {
  const { viajeId } = await params;
  const url = new URL(req.url);
  const esAdmin = url.searchParams.get("admin") === "true";
  return VueloController.listarPorViaje(viajeId, esAdmin);
}

export async function POST(req: Request, { params }: Params) {
  const { viajeId } = await params;
  const body = await req.json();
  const reqModificado = new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: JSON.stringify({ ...body, viaje_id: parseInt(viajeId) }),
  });
  return VueloController.crear(reqModificado);
}