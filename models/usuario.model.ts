import { query } from "@/config/db.config";

export const UsuarioModel = {
  async getAll() {
    const sql = `
        SELECT 
            id, 
            username, 
            nombre, 
            email, 
            isAdmin,
            (SELECT COUNT(*) FROM reservas WHERE usuario_id = usuarios.id) AS total_reservas
        FROM usuarios
    `;
    return await query(sql);
  },

  async create(data: any) {
    const sqlInsert = `
      INSERT INTO usuarios (username, password, nombre, email, isAdmin) 
      VALUES (?, ?, ?, ?, 0)
    `;
    return await query(sqlInsert, [
      data.username,
      data.password, // Vendrá hasheada desde el controlador
      data.nombre,
      data.email,
    ]);
  },

  async getById(id: string | number) {
    const sql =
      "SELECT id, username, nombre, email, isAdmin, password, created_at FROM usuarios WHERE id = ?";
    const rows = (await query(sql, [id])) as any[];
    return rows[0];
  },

  async update(id: string | number, data: any) {
    const sql = `
      UPDATE usuarios 
      SET username = ?, nombre = ?, email = ?, isAdmin = ?, password = ?
      WHERE id = ?
    `;
    return await query(sql, [
      data.username,
      data.nombre,
      data.email,
      data.isAdmin ? 1 : 0,
      data.password,
      id,
    ]);
  },

  async delete(id: string | number) {
    const sql = "DELETE FROM usuarios WHERE id = ?";
    return (await query(sql, [id])) as any;
  },

  async getByUsername(username: string) {
    const sql = "SELECT * FROM usuarios WHERE username = ?";
    const rows = (await query(sql, [username])) as any[];
    return rows[0];
  },
};
