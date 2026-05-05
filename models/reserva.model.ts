import { query } from "@/config/db.config";
import { ReservaServicioInput, ReservaCreateInput } from "@/models/types";

export const ReservaModel = {
  // 1. MÉTODO PARA INSERTAR LA CABECERA DE LA RESERVA
  async crear(data: ReservaCreateInput) {
    const rows = await query(
      `
        INSERT INTO reservas (
          usuario_id, vuelo_id, codigo_reserva_grupo,
          precio_vuelo_historico, total_extras_historico,
          "precioTotal", pasajeros, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [
        data.usuario_id,
        data.vuelo_id,
        data.codigo_reserva_grupo,
        data.precio_vuelo_historico,
        data.total_extras_historico,
        data.precioTotal,
        data.pasajeros,
        data.estado || "confirmada",
      ],
    );
    return rows[0];
  },

  // 2. AÑADIR SERVICIO
  async añadirServicioExtra(data: ReservaServicioInput) {
    const sql = `
      INSERT INTO reserva_servicios (
        reserva_id, servicio_id, nombre_servicio, 
        valor_seleccionado, cantidad, precio_unitario_pagado, tipo_vuelo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await query(sql, [
      data.reserva_id,
      data.servicio_id,
      data.nombre_servicio,
      data.valor_seleccionado,
      data.cantidad,
      data.precio_unitario_pagado,
      data.tipo_vuelo,
    ]);
  },

  async getServiciosByReservaId(reservaId: number | string) {
    return await query(
      `SELECT 
        id, servicio_id, nombre_servicio AS nombre, 
        valor_seleccionado AS detalle, cantidad, 
        precio_unitario_pagado AS precio, tipo_vuelo,
        (cantidad * precio_unitario_pagado) AS subtotal
       FROM reserva_servicios 
       WHERE reserva_id = $1`,
      [reservaId],
    );
  },

  async getById(id: number | string) {
    const rows = await query(
      `SELECT r.*, vu.viaje_id, v."paisOrigen", v."aeropuertoOrigen", v."iataOrigen",
        v."paisDestino", v."aeropuertoDestino", v."iataDestino",
        vu."fecSalida", vu."horaSalida", vu."fecLlegada", vu."horaLlegada",
        vu.tipo AS vuelo_tipo, vu.precio_ajustado,
        u.nombre AS usuario_nombre, u.email AS usuario_email
      FROM reservas r
      JOIN vuelos vu ON vu.id = r.vuelo_id
      JOIN viajes v  ON v.id  = vu.viaje_id
      JOIN usuarios u ON u.id = r.usuario_id
      WHERE r.id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  async getByUsuarioId(usuarioId: number | string) {
    return await query(
      `SELECT r.*, v."paisOrigen", v."aeropuertoOrigen", v."iataOrigen",
        v."paisDestino", v."aeropuertoDestino", v."iataDestino", v.img,
        vu."fecSalida", vu."horaSalida", vu."fecLlegada", vu."horaLlegada",
        vu.tipo AS vuelo_tipo, vu.precio_ajustado,
        COALESCE((
          SELECT SUM(rs.precio_unitario_pagado * rs.cantidad)
          FROM reserva_servicios rs
          WHERE rs.reserva_id = r.id
        ), 0) AS total_extras_calculado
      FROM reservas r
      JOIN vuelos vu ON vu.id = r.vuelo_id
      JOIN viajes v  ON v.id  = vu.viaje_id
      WHERE r.usuario_id = $1
      ORDER BY r."fecCompra" DESC`,
      [usuarioId],
    );
  },

  async getAll() {
    return await query(`
      SELECT r.*, v."paisOrigen", v."aeropuertoOrigen", v."paisDestino", v."aeropuertoDestino",
        vu."fecSalida", vu.tipo AS vuelo_tipo, u.nombre AS usuario_nombre, u.email AS usuario_email
      FROM reservas r
      JOIN vuelos vu ON vu.id = r.vuelo_id
      JOIN viajes v  ON v.id  = vu.viaje_id
      JOIN usuarios u ON u.id = r.usuario_id
      ORDER BY r."fecCompra" DESC
    `);
  },

  async actualizarEstado(id: number | string, estado: string) {
    const rows = await query(
      `UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *`,
      [estado, id],
    );
    return rows[0];
  },

  async eliminar(id: number | string) {
    return await query(`DELETE FROM reservas WHERE id = $1 RETURNING id`, [id]);
  },
};
