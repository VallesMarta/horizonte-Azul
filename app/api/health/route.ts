import { NextResponse } from "next/server";
import { query } from "@/config/db.config";

/**
 *  @swagger
 *  /api/health:
 *    get:
 *      summary: Verificar estado de la conexión con la base de datos
 *      description: Realiza un health check activo ejecutando una consulta rápida en Neon PostgreSQL para medir la latencia y disponibilidad.
 *      tags:
 *        - Sistema
 *      responses:
 *        200:
 *          description: Conexión exitosa
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: ok
 *                  database:
 *                    type: string
 *                    example: connected
 *                  latency:
 *                    type: string
 *                    example: "45ms"
 *                  timestamp:
 *                    type: string
 *                    format: date-time
 *        503:
 *          description: Error en la conexión con la base de datos
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  database:
 *                    type: string
 *                    example: disconnected
 *                  message:
 *                    type: string
 */

export const dynamic = "force-dynamic"; // Para que no se cachee

export async function GET() {
  try {
    // Intentamos una consulta ultra rápida
    const start = Date.now();
    await query("SELECT 1");
    const duration = Date.now() - start;

    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        latency: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Health check failed:", error.message);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: error.message,
      },
      { status: 503 }, // Service Unavailable
    );
  }
}
