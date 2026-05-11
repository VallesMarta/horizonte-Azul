import { NextRequest } from "next/server";
import { enviarMensaje, getMensajes } from "@/controllers/contacto.controller";

/**
 * @swagger
 * /api/contacto:
 *   get:
 *     summary: Listar todos los mensajes de contacto
 *     description: Devuelve todos los mensajes recibidos con el último mensaje del hilo. Solo accesible por administradores.
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensajes de contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 123
 *                   nombre:
 *                     type: string
 *                     example: Ana García
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: ana@ejemplo.com
 *                   asunto:
 *                     type: string
 *                     example: Consulta de vuelo
 *                   mensaje:
 *                     type: string
 *                     example: Quisiera cambiar el asiento.
 *                   usuario_id:
 *                     type: integer
 *                     nullable: true
 *                     example: 45
 *                   leido:
 *                     type: boolean
 *                     example: false
 *                   respondido:
 *                     type: boolean
 *                     example: false
 *                   respuesta:
 *                     type: string
 *                     nullable: true
 *                     example: Hola, tu consulta está en proceso.
 *                   fecha_respuesta:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-05-11T12:34:56Z
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado — no es administrador
 *   post:
 *     summary: Enviar un nuevo mensaje de contacto
 *     description: Cualquier usuario (loggeado o no) puede enviar un mensaje. Si hay sesión activa, el mensaje se vincula al usuario.
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, asunto, mensaje]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ana García
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ana@ejemplo.com
 *               asunto:
 *                 type: string
 *                 example: Consulta sobre mi reserva
 *               mensaje:
 *                 type: string
 *                 example: Quisiera saber el estado de mi reserva HA-ABC123
 *     responses:
 *       200:
 *         description: Mensaje enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: integer
 *                   example: 7
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */

export async function GET(req: NextRequest) {
  return getMensajes(req);
}

export async function POST(req: NextRequest) {
  return enviarMensaje(req);
}
