import { query } from "@/config/db.config";

export const ReservaModel = {
  // Transacciones
  async startTransaction() {
    return await query("START TRANSACTION", []);
  },
  async commit() {
    return await query("COMMIT", []);
  },
  async rollback() {
    return await query("ROLLBACK", []);
  },

  // Crear Reserva (Estado inicial: confirmada porque ya pasó por checkout)
  async createReserva(data: {
    usuario_id: string | number;
    viaje_id: number;
    fecSalida: string;
    pasajeros: number;
  }) {
    const sql = `
      INSERT INTO reservas (usuario_id, viaje_id, fecSalida, pasajeros, estado)
      VALUES (?, ?, ?, ?, 'confirmada')
    `;
    return (await query(sql, [
      data.usuario_id,
      data.viaje_id,
      data.fecSalida,
      data.pasajeros,
    ])) as any;
  },

  // Guardar Tarjeta
  async saveMetodoPago(usuario_id: number, last4: string, brand: string) {
    const token = `tok_sim_${Math.random().toString(36).substr(2, 9)}`;
    const sql = `INSERT INTO metodos_pago (usuario_id, last4, marca, token_simulado) VALUES (?, ?, ?, ?)`;
    return (await query(sql, [usuario_id, last4, brand, token])) as any;
  },

  // Registrar Pago
  async registrarPago(data: any) {
    const sql = `
      INSERT INTO pagos (reserva_id, usuario_id, metodo_pago_id, monto, metodo, estado, tipo_tarjeta)
      VALUES (?, ?, ?, ?, 'tarjeta', 'exitoso', ?)
    `;
    return await query(sql, [
      data.reservaId,
      data.usuario_id,
      data.metodoPagoId,
      data.total,
      data.brand,
    ]);
  },
  // Obtener todas las reservas (Solo para Admin)
  async getAllAdmin() {
    const sql = `
      SELECT r.id AS reserva_id, r.usuario_id, u.username, v.paisDestino, 
             v.aeropuertoDestino, r.estado, r.fecCompra, r.fecSalida, 
             r.pasajeros, p.monto AS total_pagado
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN viajes v ON r.viaje_id = v.id
      LEFT JOIN pagos p ON r.id = p.reserva_id
      ORDER BY r.fecCompra DESC
    `;
    return (await query(sql, [])) as any[];
  },
  // Historial por Usuario
  async getByUsuarioId(usuarioId: string | number) {
    const sql = `
      SELECT r.id AS reserva_id, v.paisOrigen, v.aeropuertoOrigen, v.paisDestino, v.aeropuertoDestino,
             v.img, r.estado, p.monto AS total_pagado, r.fecSalida, r.pasajeros, p.tipo_tarjeta
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      LEFT JOIN pagos p ON r.id = p.reserva_id
      WHERE r.usuario_id = ?
      ORDER BY r.fecCompra DESC
    `;
    return (await query(sql, [usuarioId])) as any[];
  },

  // Detalle para Voucher (incluye servicios)
  async getVoucherDetalle(reservaId: string | number) {
    const sql = `
      SELECT r.id as reserva_id, r.usuario_id, r.estado, r.pasajeros, r.fecSalida,
             v.paisOrigen, v.aeropuertoOrigen, v.horaSalida,
             v.paisDestino, v.aeropuertoDestino, v.horaLlegada,
             s.nombre AS servicioNombre, vs.valor AS servicioValor, vs.precio_extra
      FROM reservas r
      JOIN viajes v ON r.viaje_id = v.id
      LEFT JOIN viaje_servicio vs ON v.id = vs.viaje_id
      LEFT JOIN servicios s ON vs.servicio_id = s.id
      WHERE r.id = ?
    `;
    return (await query(sql, [reservaId])) as any[];
  },

  async getById(id: string | number) {
    const sql = "SELECT * FROM reservas WHERE id = ?";
    const rows = (await query(sql, [id])) as any[];
    return rows[0];
  },
  async updateFull(
    id: string | number,
    data: {
      estado: string;
      pasajeros: number;
      fecSalida: string;
      viaje_id: number;
    },
  ) {
    const sql = `
      UPDATE reservas 
      SET estado = ?, pasajeros = ?, fecSalida = ?, viaje_id = ?
      WHERE id = ?
    `;
    return await query(sql, [
      data.estado,
      data.pasajeros,
      data.fecSalida,
      data.viaje_id,
      id,
    ]);
  },
  async updateEstado(id: string | number, nuevoEstado: string) {
    const sql = "UPDATE reservas SET estado = ? WHERE id = ?";
    return (await query(sql, [nuevoEstado, id])) as any;
  },

  async updateAdmin(id: string | number, estado: string, pasajeros: number) {
    const sql = "UPDATE reservas SET estado = ?, pasajeros = ? WHERE id = ?";
    return (await query(sql, [estado, pasajeros, id])) as any;
  },

  async delete(id: string | number) {
    const sql = "DELETE FROM reservas WHERE id = ?";
    return (await query(sql, [id])) as any;
  },
};
