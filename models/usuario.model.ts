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
      VALUES ($1, $2, $3, $4, $5, FALSE, $6, $7, $8, $9, $10)
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
        "fecNacimiento",
        "tipoDocumento",
        "numDocumento",
        "paisEmision",
        "fecCaducidadDocumento",
        "fotoPerfil",
        "stripe_customer_id"
      FROM usuarios 
      WHERE id = $1
    `;
    const rows = await query(sql, [id]);
    return rows[0];
  },

  async update(id: string | number, data: any) {
    const sql = `
      UPDATE usuarios 
      SET 
        username = $1, nombre = $2, apellidos = $3, email = $4, "isAdmin" = $5, password = $6,
        telefono = $7, "fecNacimiento" = $8, "tipoDocumento" = $9, "numDocumento" = $10, "paisEmision" = $11, 
        "fecCaducidadDocumento" = $12, "fotoPerfil" = $13
      WHERE id = $14
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
    const sql = "DELETE FROM usuarios WHERE id = $1";
    return await query(sql, [id]);
  },

  async getByUsername(username: string) {
    const sql = "SELECT * FROM usuarios WHERE username = $1";
    const rows = await query(sql, [username]);
    return rows[0];
  },

  // VINCULAR CUSTOMER ID DE STRIPE AL USUARIO
  async actualizarStripeCustomerId(id: string | number, customerId: string) {
    return await query(
      `UPDATE usuarios SET "stripe_customer_id" = $2 WHERE id = $1`,
      [id, customerId],
    );
  },
};
