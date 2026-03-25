import { query } from "@/config/db.config";

export const AuthModel = {
    
  async registrarSesion(usuarioId: number, token: string, expiraEn: Date) {
    const sql = "INSERT INTO tokens_activos (usuario_id, token, expira_en) VALUES (?, ?, ?)";
    return await query(sql, [usuarioId, token, expiraEn]);
  },

  async esSesionActiva(token: string) {
    const sql = "SELECT id FROM tokens_activos WHERE token = ?";
    const rows = await query(sql, [token]) as any[];
    return rows.length > 0;
  },

  async eliminarSesion(token: string) {
    const sql = "DELETE FROM tokens_activos WHERE token = ?";
    const result: any = await query(sql, [token]);
    // Devolvemos cuántas filas se borraron (0 o 1)
    return result.affectedRows; 
}
};