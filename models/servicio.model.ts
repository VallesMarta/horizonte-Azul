import { query } from "@/config/db.config";

export const ServicioModel = {
  async getAll() {
    const sql = "SELECT * FROM servicios ORDER BY nombre ASC";
    return await query(sql);
  },

  async create(nombre: string, tipo_control: string = "texto") {
    const sql = "INSERT INTO servicios (nombre, tipo_control) VALUES (?, ?)";
    return (await query(sql, [nombre, tipo_control])) as any;
  },

  async getById(id: string | number) {
    const sql = "SELECT * FROM servicios WHERE id = ?";
    const rows = (await query(sql, [id])) as any[];
    return rows[0];
  },

  async update(id: string | number, nombre: string) {
    const sql = "UPDATE servicios SET nombre = ? WHERE id = ?";
    return await query(sql, [nombre, id]);
  },

  async delete(id: string | number) {
    const sql = "DELETE FROM servicios WHERE id = ?";
    return (await query(sql, [id])) as any;
  },
};
