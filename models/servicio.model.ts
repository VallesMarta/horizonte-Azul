import { query } from "@/config/db.config";

export const ServicioModel = {
  async getAll() {
    const sql = "SELECT * FROM servicios ORDER BY nombre ASC";
    return await query(sql);
  },

  async create(nombre: string, tipo_control: string = "texto") {
    const sql = "INSERT INTO servicios (nombre, tipo_control) VALUES ($1, $2) RETURNING id";
    const rows = await query(sql, [nombre, tipo_control]);
    return rows[0]; 
  },

  async getById(id: string | number) {
    const sql = "SELECT * FROM servicios WHERE id = $1";
    const rows = await query(sql, [id]);
    return rows[0];
  },

  async update(id: string | number, nombre: string) {
    const sql = "UPDATE servicios SET nombre = $1 WHERE id = $2";
    return await query(sql, [nombre, id]);
  },

  async delete(id: string | number) {
    const sql = "DELETE FROM servicios WHERE id = $1 RETURNING id";
    const rows = await query(sql, [id]);
    return rows; // Si rows.length > 0, es que se borró algo
  },
};