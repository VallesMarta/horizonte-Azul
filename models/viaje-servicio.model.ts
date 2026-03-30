import { query } from "@/config/db.config";

export const ViajeServicioModel = {
  async getByViajeId(viajeId: string) {
    const sql = `
      SELECT vs.id as relacion_id, vs.servicio_id, vs.valor, vs.precio_extra, 
             s.nombre, s.tipo_control
      FROM viaje_servicio vs
      JOIN servicios s ON vs.servicio_id = s.id
      WHERE vs.viaje_id = ?
    `;
    return (await query(sql, [viajeId])) as any[];
  },
  async create(
    viajeId: string,
    servicioId: number,
    valor: string,
    precio: number,
  ) {
    const sql = `
      INSERT INTO viaje_servicio (viaje_id, servicio_id, valor, precio_extra) 
      SELECT ?, ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM viaje_servicio WHERE viaje_id = ? AND servicio_id = ?
      )
    `;
    return (await query(sql, [
      viajeId,
      servicioId,
      valor,
      precio,
      viajeId,
      servicioId,
    ])) as any;
  },

  async update(
    viajeId: string,
    servicio_id: number,
    valor: string,
    precio: number,
  ) {
    const sql = `
      UPDATE viaje_servicio 
      SET valor = ?, precio_extra = ? 
      WHERE viaje_id = ? AND servicio_id = ?
      LIMIT 1
    `;
    return (await query(sql, [valor, precio, viajeId, servicio_id])) as any;
  },

  async deleteSpecific(viajeId: string, servicioId: number) {
    const sql = `
      DELETE FROM viaje_servicio 
      WHERE viaje_id = ? AND servicio_id = ?
      LIMIT 1
    `;
    return (await query(sql, [viajeId, servicioId])) as any;
  },
};
