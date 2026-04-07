import { query } from "@/config/db.config";

export const UsuarioModel = {
  async getAll() {
    const sql = `
        SELECT 
            id, username, nombre, apellidos, email, "isAdmin", "fotoPerfil",
            (SELECT COUNT(*) FROM reservas WHERE usuario_id = usuarios.id) AS total_reservas
        FROM usuarios
    `;
    return await query(sql);
  },

  async create(data: any) {
    const sqlInsert = `
      INSERT INTO usuarios (username, password, nombre, apellidos, email, "isAdmin") 
      VALUES (?, ?, ?, ?, ?, FALSE)
      RETURNING id, username, email, "isAdmin"
    `;
    // Manejo de nulos para evitar errores en el registro básico
    const rows = await query(sqlInsert, [
      data.username,
      data.password,
      data.nombre || data.username, // Fallback al username si no hay nombre
      data.apellidos || "", // Opcional
      data.email,
    ]);
    return rows[0];
  },

  async getById(id: string | number) {
    const sql = `
      SELECT 
        id, username, nombre, apellidos, email, "isAdmin", password, 
        telefono, "tipoDocumento", "numDocumento", "paisEmision", 
        "fecCaducidadDocumento", "fotoPerfil",
        (SELECT COUNT(*) FROM reservas WHERE usuario_id = usuarios.id) AS total_reservas,
        created_at 
      FROM usuarios 
      WHERE id = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0];
  },

  async update(id: string | number, data: any) {
    const sql = `
      UPDATE usuarios 
      SET 
        username = ?, nombre = ?, apellidos = ?, email = ?, "isAdmin" = ?, password = ?,
        telefono = ?, "tipoDocumento" = ?, "numDocumento" = ?, "paisEmision" = ?, 
        "fecCaducidadDocumento" = ?, "fotoPerfil" = ?
      WHERE id = ?
    `;

    // Limpieza de fecha para evitar errores de PostgreSQL (Date vs String vacío)
    const fechaLimpia =
      data.fecCaducidadDocumento && data.fecCaducidadDocumento !== ""
        ? data.fecCaducidadDocumento
        : null;

    return await query(sql, [
      data.username,
      data.nombre,
      data.apellidos,
      data.email,
      data.isAdmin === true,
      data.password,
      data.telefono,
      data.tipoDocumento,
      data.numDocumento,
      data.paisEmision,
      fechaLimpia,
      data.fotoPerfil,
      id,
    ]);
  },

  async delete(id: string | number) {
    const sql = "DELETE FROM usuarios WHERE id = ?";
    return await query(sql, [id]);
  },

  async getByUsername(username: string) {
    const sql = "SELECT * FROM usuarios WHERE username = ?";
    const rows = await query(sql, [username]);
    return rows[0];
  },
};
