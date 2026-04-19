import { query } from "@/config/db.config";

export const ViajeServicioModel = {
  async getByViajeId(viajeId: string | number) {
    return await query(
      `
      SELECT 
        vs.id,
        vs.servicio_id,
        vs.valor,
        vs.precio_extra,
        vs.incluido,
        vs.cantidad_incluida,
        s.nombre,
        s.tipo_control
      FROM viaje_servicio vs
      JOIN servicios s ON vs.servicio_id = s.id
      WHERE vs.viaje_id = $1
      ORDER BY vs.incluido DESC, s.nombre ASC
    `,
      [viajeId],
    );
  },

  async sincronizar(
    viajeId: string | number,
    servicios: {
      servicio_id: number;
      valor: string;
      precio_extra: number;
      incluido: boolean;
      cantidad_incluida: number;
    }[],
  ) {
    await query(`DELETE FROM viaje_servicio WHERE viaje_id = $1`, [viajeId]);

    for (const s of servicios) {
      await query(
        `
        INSERT INTO viaje_servicio 
          (viaje_id, servicio_id, valor, precio_extra, incluido, cantidad_incluida)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          viajeId,
          s.servicio_id,
          s.valor,
          s.precio_extra,
          s.incluido,
          s.cantidad_incluida,
        ],
      );
    }
  },

  async create(
    viajeId: string | number,
    servicioId: number,
    valor: string,
    precio: number,
    incluido = false,
    cantidadIncluida = 0,
  ) {
    return await query(
      `
    INSERT INTO viaje_servicio (viaje_id, servicio_id, valor, precio_extra, incluido, cantidad_incluida)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
      [viajeId, servicioId, valor, precio, incluido, cantidadIncluida],
    );
  },

  async deleteById(id: string | number) {
    return await query(
      `DELETE FROM viaje_servicio WHERE id = $1 RETURNING id`,
      [id],
    );
  },
};
