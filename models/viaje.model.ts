import { query } from "@/config/db.config";

export const ViajeModel = {
  async getAll() {
    const sql = `
    SELECT 
      v.*,
      COALESCE(
        (SELECT MIN(precio_ajustado) 
         FROM vuelos 
         WHERE viaje_id = v.id AND "fecSalida" >= CURRENT_DATE)
      ) AS precio_oferta
    FROM viajes v
    ORDER BY v.created_at DESC
  `;
    return await query(sql);
  },

  async getById(id: string | number) {
    const sql = `
      SELECT v.*, 
             vu.tipo,
             vu."fecSalida", vu."horaSalida", vu."fecLlegada", vu."horaLlegada",
             vu."plazasDisponibles" AS stock,
             COALESCE(vu.precio_ajustado) AS precio
      FROM viajes v 
      LEFT JOIN vuelos vu ON v.id = vu.viaje_id
      WHERE v.id = $1
      ORDER BY vu."fecSalida" ASC LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows[0];
  },

  async create(data: any) {
    const sql = `
    INSERT INTO viajes 
      ("paisOrigen", "aeropuertoOrigen", "iataOrigen", "paisDestino", "aeropuertoDestino", "iataDestino", img, descripcion) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING id
  `;
    const rows = await query(sql, [
      data.paisOrigen,
      data.aeropuertoOrigen,
      data.iataOrigen,
      data.paisDestino,
      data.aeropuertoDestino,
      data.iataDestino,
      data.img,
      data.descripcion,
    ]);
    return rows[0];
  },

  async update(id: string | number, data: any) {
    const sql = `
    UPDATE viajes 
    SET "paisOrigen"        = $1,
        "aeropuertoOrigen"  = $2,
        "iataOrigen"        = $3,
        "paisDestino"       = $4,
        "aeropuertoDestino" = $5,
        "iataDestino"       = $6,
        img                 = $7,
        descripcion         = $8
    WHERE id = $9
  `;
    return await query(sql, [
      data.paisOrigen,
      data.aeropuertoOrigen,
      data.iataOrigen,
      data.paisDestino,
      data.aeropuertoDestino,
      data.iataDestino,
      data.img,
      data.descripcion,
      id,
    ]);
  },

  async delete(id: string | number) {
    return await query("DELETE FROM viajes WHERE id = $1", [id]);
  },
};
