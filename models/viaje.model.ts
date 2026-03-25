import { query } from "@/config/db.config";

export const ViajeModel = {
  async getAll() {
    const sql = "SELECT * FROM viajes ORDER BY created_at DESC";
    return (await query(sql)) as any[];
  },

  async create(data: any) {
    const sql = `
      INSERT INTO viajes (
        paisOrigen, aeropuertoOrigen, horaSalida, 
        paisDestino, aeropuertoDestino, horaLlegada, 
        precio, img, descripcion
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return (await query(sql, [
      data.paisOrigen,
      data.aeropuertoOrigen,
      data.horaSalida,
      data.paisDestino,
      data.aeropuertoDestino,
      data.horaLlegada,
      data.precio,
      data.img,
      data.descripcion,
    ])) as any;
  },

  async getById(id: string | number) {
    const sql = "SELECT * FROM viajes WHERE id = ?";
    const rows = (await query(sql, [id])) as any[];
    return rows[0];
  },

  async update(id: string | number, data: any) {
    const sql = `
      UPDATE viajes 
      SET paisOrigen = ?, aeropuertoOrigen = ?, horaSalida = ?, 
          paisDestino = ?, aeropuertoDestino = ?, horaLlegada = ?, 
          precio = ?, img = ?, descripcion = ?
      WHERE id = ?
    `;
    return await query(sql, [
      data.paisOrigen,
      data.aeropuertoOrigen,
      data.horaSalida,
      data.paisDestino,
      data.aeropuertoDestino,
      data.horaLlegada,
      data.precio,
      data.img,
      data.descripcion,
      id,
    ]);
  },

  async delete(id: string | number) {
    const sql = "DELETE FROM viajes WHERE id = ?";
    return (await query(sql, [id])) as any;
  },
};
