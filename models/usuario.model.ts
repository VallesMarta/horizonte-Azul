import { query } from "@/config/db.config";

export const UsuarioModel = {
  async getAll() {
    const sql = `
        SELECT 
            id, username, nombre, apellidos, email, "isAdmin", "fotoPerfil", "fecNacimiento",
            (SELECT COUNT(*) FROM reservas WHERE usuario_id = usuarios.id) AS total_reservas
        FROM usuarios
    `;
    return await query(sql);
  },

  async create(data: any) {
    const sqlInsert = `
      INSERT INTO usuarios (
        username, password, nombre, apellidos, email, "isAdmin", 
        telefono, "fecNacimiento", "tipoDocumento", "numDocumento", "paisEmision"
      ) 
      VALUES (?, ?, ?, ?, ?, FALSE, ?, ?, ?, ?, ?)
      RETURNING id, username, email, "isAdmin"
    `;

    const nacimientoLimpio =
      data.fecNacimiento && data.fecNacimiento !== ""
        ? data.fecNacimiento
        : null;

    const rows = await query(sqlInsert, [
      data.username,
      data.password,
      data.nombre || data.username,
      data.apellidos || "",
      data.email,
      data.telefono || null,
      nacimientoLimpio,
      data.tipoDocumento || "DNI",
      data.numDocumento || null,
      data.paisEmision || null,
    ]);
    return rows[0];
  },

  async getById(id: string | number) {
    const sql = `
      SELECT 
        id, 
        username, 
        nombre, 
        apellidos,
        email, 
        "isAdmin",
        password,
        telefono,
        "fecNacimiento" AS "fecNacimiento",
        "tipoDocumento" AS "tipoDocumento",
        "numDocumento" AS "numDocumento",
        "paisEmision" AS "paisEmision",
        "fecCaducidadDocumento" AS "fecCaducidadDocumento",
        "fotoPerfil" AS "fotoPerfil"
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
        telefono = ?, "fecNacimiento" = ?, "tipoDocumento" = ?, "numDocumento" = ?, "paisEmision" = ?, 
        "fecCaducidadDocumento" = ?, "fotoPerfil" = ?
      WHERE id = ?
    `;

    const fechaLimpia =
      data.fecCaducidadDocumento && data.fecCaducidadDocumento !== ""
        ? data.fecCaducidadDocumento
        : null;

    const nacimientoLimpio =
      data.fecNacimiento && data.fecNacimiento !== ""
        ? data.fecNacimiento
        : null;

    return await query(sql, [
      data.username,
      data.nombre,
      data.apellidos,
      data.email,
      data.isAdmin === true,
      data.password,
      data.telefono,
      nacimientoLimpio,
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
