import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { Pool } from "pg";

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat con el asistente virtual de Horizonte Azul
 *     description: Envía mensajes al asistente IA con contexto real de viajes y vuelos de la base de datos. Devuelve la respuesta en streaming.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 description: Historial de mensajes de la conversación
 *                 items:
 *                   type: object
 *                   required:
 *                     - role
 *                     - content
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                       description: Rol del mensaje
 *                     content:
 *                       type: string
 *                       description: Contenido del mensaje
 *           example:
 *             messages:
 *               - role: user
 *                 content: "¿Qué vuelos hay disponibles a Roma?"
 *     responses:
 *       200:
 *         description: Respuesta en texto plano (streaming)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Tenemos vuelos a Roma desde Madrid a partir del 12 de mayo desde 120€..."
 *       500:
 *         description: Error interno del servidor
 */

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function obtenerContextoDB() {
  const client = await pool.connect();
  try {
    // Viajes disponibles con sus servicios
    const viajes = await client.query(`
      SELECT 
        v.id,
        v."paisOrigen",
        v."aeropuertoOrigen",
        v."iataOrigen",
        v."paisDestino",
        v."aeropuertoDestino",
        v."iataDestino",
        v.descripcion,
        COALESCE(
          (SELECT MIN(precio_ajustado) 
           FROM vuelos 
           WHERE viaje_id = v.id AND "fecSalida" >= CURRENT_DATE)
        ) AS precio_oferta,
        (
          SELECT json_agg(json_build_object(
            'servicio', s.nombre,
            'precio_extra', vs.precio_extra
          ))
          FROM viaje_servicio vs
          JOIN servicios s ON s.id = vs.servicio_id
          WHERE vs.viaje_id = v.id
        ) AS servicios
      FROM viajes v
      ORDER BY v.id
    `);

    // Próximos vuelos disponibles
    const vuelos = await client.query(`
      SELECT 
        vl.id,
        v."paisOrigen",
        v."iataOrigen",
        v."paisDestino",
        v."iataDestino",
        vl."fecSalida",
        vl."horaSalida",
        vl."fecLlegada",
        vl."horaLlegada",
        vl."plazasDisponibles",
        vl.precio_ajustado,
        vl.tipo,
        vl.estado
      FROM vuelos vl
      JOIN viajes v ON v.id = vl.viaje_id
      WHERE vl."fecSalida" >= CURRENT_DATE
        AND vl."plazasDisponibles" > 0
        AND vl.estado = 'programado'
      ORDER BY vl."fecSalida"
      LIMIT 20
    `);

    return { viajes: viajes.rows, vuelos: vuelos.rows };
  } finally {
    client.release();
  }
}

function buildSystemPrompt(viajes: unknown[], vuelos: unknown[]) {
  return `Eres el asistente virtual de Horizonte Azul, una aerolínea española que ofrece vuelos a destinos de todo el mundo con servicios adicionales como transfer en bus al destino, transfer privado, equipaje extra, acceso VIP y mucho más.

Tu misión es ayudar a los clientes a:
- Informarse sobre los destinos y vuelos disponibles
- Conocer los servicios adicionales de cada viaje y sus precios
- Entender cómo funciona el proceso de reserva
- Resolver cualquier duda sobre la aerolínea

Responde siempre en español, de forma amable, clara y concisa. Si el usuario pregunta por algo que no está en los datos, indícale que contacte con soporte en info@horizonteazul.com.

PROCESO DE RESERVA:
1. El usuario navega a un destino en la web
2. Selecciona fecha de vuelo disponible
3. Elige los servicios adicionales que desee
4. Introduce los datos de los pasajeros
5. Realiza el pago (tarjeta, transferencia o PayPal)
6. Recibe confirmación de reserva

DOCUMENTACIÓN NECESARIA PARA VOLAR:
- DNI, NIE, NIF o Pasaporte en vigor
- Los datos deben coincidir exactamente con los del billete

DESTINOS Y VIAJES DISPONIBLES:
${JSON.stringify(viajes, null, 2)}

PRÓXIMOS VUELOS DISPONIBLES:
${JSON.stringify(vuelos, null, 2)}

Si te preguntan por precios, usa el campo precio_oferta (precio más bajo disponible). 
Si te preguntan por servicios, menciona los incluidos en ese viaje y su precio extra.
Si te preguntan por plazas, usa el campo plazasDisponibles.
No inventes vuelos ni destinos que no estén en los datos anteriores.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Obtener datos reales de la DB
    const { viajes, vuelos } = await obtenerContextoDB();

    const history = messages
      .filter((_: unknown, i: number, arr: { role: string }[]) => {
        if (i === 0 && arr[0].role === "assistant") return false;
        return true;
      })
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: buildSystemPrompt(viajes, vuelos) },
        ...history,
      ],
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: unknown) {
    console.error("CHAT ERROR:", error);
    const msg = error instanceof Error ? error.message : "Error desconocido";
    const is429 =
      msg.includes("429") || msg.includes("quota") || msg.includes("rate");

    return new Response(
      is429
        ? "Límite de peticiones alcanzado, espera un momento e inténtalo de nuevo."
        : "Error al conectar con la IA.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }
}
