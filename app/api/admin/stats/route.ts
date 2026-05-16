import { NextResponse } from "next/server";
import { query } from "@/config/db.config";
import { validarAdmin } from "@/lib/auth-utils";

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Estadísticas generales del panel de administración
 *     description: Devuelve KPIs globales, top destinos, top wishlist, distribución de reservas por estado, últimas reservas e histórico mensual. Solo accesible para administradores.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 resultado:
 *                   type: object
 *                   properties:
 *                     totales:
 *                       type: object
 *                       properties:
 *                         usuarios:
 *                           type: integer
 *                           description: Total de usuarios no administradores
 *                           example: 142
 *                         reservas:
 *                           type: integer
 *                           description: Total de reservas no canceladas
 *                           example: 318
 *                         ingresos:
 *                           type: number
 *                           description: Suma total de precioTotal de reservas no canceladas
 *                           example: 47850.75
 *                         reservas_mes:
 *                           type: integer
 *                           description: Reservas no canceladas creadas en el mes actual
 *                           example: 24
 *                         total_favoritos:
 *                           type: integer
 *                           description: Total de entradas en la tabla wishlist
 *                           example: 87
 *                         vuelos_activos:
 *                           type: integer
 *                           description: Vuelos con fecSalida >= hoy y estado distinto de completado/cancelado
 *                           example: 11
 *                     top_destinos:
 *                       type: array
 *                       description: Los 5 destinos con más reservas no canceladas
 *                       items:
 *                         type: object
 *                         properties:
 *                           paisDestino:
 *                             type: string
 *                             example: "Japón"
 *                           iataDestino:
 *                             type: string
 *                             example: "TYO"
 *                           aeropuertoDestino:
 *                             type: string
 *                             example: "Aeropuerto Internacional de Tokio"
 *                           img:
 *                             type: string
 *                             example: "https://..."
 *                           total_reservas:
 *                             type: integer
 *                             example: 58
 *                           ingresos:
 *                             type: number
 *                             example: 12400.50
 *                     top_wishlist:
 *                       type: array
 *                       description: Los 5 viajes más guardados en wishlist
 *                       items:
 *                         type: object
 *                         properties:
 *                           paisDestino:
 *                             type: string
 *                             example: "Tailandia"
 *                           iataDestino:
 *                             type: string
 *                             example: "BKK"
 *                           img:
 *                             type: string
 *                             example: "https://..."
 *                           total_guardados:
 *                             type: integer
 *                             example: 34
 *                     estados:
 *                       type: array
 *                       description: Conteo de reservas agrupadas por estado (incluye canceladas)
 *                       items:
 *                         type: object
 *                         properties:
 *                           estado:
 *                             type: string
 *                             enum: [pendiente, confirmada, realizada, cancelada]
 *                             example: "confirmada"
 *                           total:
 *                             type: integer
 *                             example: 210
 *                     ultimas_reservas:
 *                       type: array
 *                       description: Las 5 reservas más recientes ordenadas por fecha de compra
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 301
 *                           localizador:
 *                             type: string
 *                             example: "HA-A1B2C3"
 *                           fecCompra:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-30T18:22:00Z"
 *                           precioTotal:
 *                             type: number
 *                             example: 349.99
 *                           estado:
 *                             type: string
 *                             enum: [pendiente, confirmada, realizada, cancelada]
 *                             example: "confirmada"
 *                           pasajeros:
 *                             type: integer
 *                             example: 2
 *                           usuario_nombre:
 *                             type: string
 *                             example: "María García"
 *                           paisDestino:
 *                             type: string
 *                             example: "Japón"
 *                           iataDestino:
 *                             type: string
 *                             example: "TYO"
 *                     reservas_mes_historico:
 *                       type: array
 *                       description: Número de reservas no canceladas agrupadas por mes en los últimos 6 meses
 *                       items:
 *                         type: object
 *                         properties:
 *                           mes:
 *                             type: string
 *                             description: Abreviatura del mes en inglés (Mon)
 *                             example: "Apr"
 *                           total:
 *                             type: integer
 *                             example: 42
 *                     ingresos_mes_historico:
 *                       type: array
 *                       description: Suma de ingresos de reservas confirmadas agrupadas por mes en los últimos 6 meses
 *                       items:
 *                         type: object
 *                         properties:
 *                           mes:
 *                             type: string
 *                             description: Abreviatura del mes en inglés (Mon)
 *                             example: "Apr"
 *                           total:
 *                             type: number
 *                             format: float
 *                             example: 8750.25
 *       401:
 *         description: No autorizado — falta o es inválido el token
 *       403:
 *         description: Acceso denegado — el usuario no es administrador
 *       500:
 *         description: Error interno del servidor
 */

export async function GET(req: Request) {
  const auth = await validarAdmin(req);
  if (!auth.autorizado)
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );

  try {
    // 1. Total usuarios
    const [{ total_usuarios }] = await query(
      `SELECT COUNT(*) AS total_usuarios FROM usuarios WHERE "isAdmin" = false`,
    );

    // 2. Total reservas + ingresos
    const [reservas] = await query(`
      SELECT 
        COUNT(*) AS total_reservas,
        COALESCE(SUM("precioTotal"), 0) AS ingresos_totales
      FROM reservas 
      WHERE estado != 'cancelada'
    `);

    // 3. Reservas este mes
    const [{ reservas_mes }] = await query(`
      SELECT COUNT(*) AS reservas_mes 
      FROM reservas 
      WHERE DATE_TRUNC('month', "fecCompra") = DATE_TRUNC('month', CURRENT_DATE)
        AND estado != 'cancelada'
    `);
    // 4. Total favoritos
    const [{ total_favoritos }] = await query(
      `SELECT COUNT(*) AS total_favoritos FROM wishlist`,
    );
    // 5. Top 5 destinos más reservados
    const top_destinos = await query(`
      SELECT 
        v."paisDestino",
        v."iataDestino",
        v."aeropuertoDestino",
        v.img,
        COUNT(r.id) AS total_reservas,
        COALESCE(SUM(r."precioTotal"), 0) AS ingresos
      FROM reservas r
      JOIN vuelos vu ON vu.id = r.vuelo_id
      JOIN viajes v ON v.id = vu.viaje_id
      WHERE r.estado != 'cancelada'
      GROUP BY v.id, v."paisDestino", v."iataDestino", v."aeropuertoDestino", v.img
      ORDER BY total_reservas DESC
      LIMIT 5
    `);

    // 6. Top 5 viajes más guardados en wishlist
    const top_wishlist = await query(`
      SELECT 
        v."paisDestino",
        v."iataDestino",
        v.img,
        COUNT(w.viaje_id) AS total_guardados
      FROM wishlist w
      JOIN viajes v ON v.id = w.viaje_id
      GROUP BY v.id, v."paisDestino", v."iataDestino", v.img
      ORDER BY total_guardados DESC
      LIMIT 5
    `);

    // 7. Reservas por estado
    const estados = await query(`
      SELECT estado, COUNT(*) AS total
      FROM reservas
      GROUP BY estado
    `);

    // 8. Últimas 5 reservas
    const ultimas_reservas = await query(`
      SELECT 
        r.id,
        r.localizador,
        r."fecCompra",
        r."precioTotal",
        r.estado,
        r.pasajeros,
        u.nombre AS usuario_nombre,
        v."paisDestino",
        v."iataDestino"
      FROM reservas r
      JOIN usuarios u ON u.id = r.usuario_id
      JOIN vuelos vu ON vu.id = r.vuelo_id
      JOIN viajes v ON v.id = vu.viaje_id
      ORDER BY r."fecCompra" DESC
      LIMIT 5
    `);

    // 9. Vuelos activos hoy
    const [{ vuelos_activos }] = await query(`
      SELECT COUNT(*) AS vuelos_activos 
      FROM vuelos 
      WHERE "fecSalida" >= CURRENT_DATE 
        AND estado NOT IN ('completado', 'cancelado')
    `);

    // 10. Reservas por mes (últimos 6 meses)
    const reservas_mes_historico = await query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "fecCompra"), 'Mon') AS mes,
        COUNT(*)::int AS total
      FROM reservas
      WHERE "fecCompra" >= NOW() - INTERVAL '6 months'
        AND estado != 'cancelada'
      GROUP BY DATE_TRUNC('month', "fecCompra")
      ORDER BY DATE_TRUNC('month', "fecCompra") ASC
    `);

    // 11. Ingresos por mes (últimos 6 meses)
    const ingresos_mes_historico = await query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "fecCompra"), 'Mon') AS mes,
        COALESCE(SUM("precioTotal"), 0)::float AS total
      FROM reservas
      WHERE "fecCompra" >= NOW() - INTERVAL '6 months'
        AND estado = 'confirmada'
      GROUP BY DATE_TRUNC('month', "fecCompra")
      ORDER BY DATE_TRUNC('month', "fecCompra") ASC
    `);

    return NextResponse.json({
      ok: true,
      resultado: {
        totales: {
          usuarios: Number(total_usuarios),
          reservas: Number(reservas.total_reservas),
          ingresos: Number(reservas.ingresos_totales),
          reservas_mes: Number(reservas_mes),
          total_favoritos: Number(total_favoritos),
          vuelos_activos: Number(vuelos_activos),
        },
        top_destinos,
        top_wishlist,
        estados,
        ultimas_reservas,
        reservas_mes_historico,
        ingresos_mes_historico,
      },
    });
  } catch (err: any) {
    console.error("Error stats:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 },
    );
  }
}
