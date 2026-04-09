import { query } from "@/config/db.config";

export const AuthModel = {
  async registrarSesion(usuarioId: number, token: string, expiraEn: Date) {
    // Usamos $1, $2, $3 y comillas dobles para el campo con mayúscula
    const sql =
      'INSERT INTO tokens_activos (usuario_id, token, "expiraEn") VALUES ($1, $2, $3)';
    return await query(sql, [usuarioId, token, expiraEn]);
  },

  async esSesionActiva(token: string) {
    const sql = "SELECT id FROM tokens_activos WHERE token = $1";
    const rows = await query(sql, [token]);
    return rows.length > 0;
  },

  async eliminarSesion(token: string) {
    const sql = "SELECT id FROM tokens_activos WHERE token = $1";
    const sesiones = await query(sql, [token]);
    
    if (sesiones.length === 0) return 0;

    const deleteSql = "DELETE FROM tokens_activos WHERE token = $1";
    await query(deleteSql, [token]);
    
    // Devolvemos 1 porque si llegó aquí, la sesión existía y se borró
    return 1;
  },
};