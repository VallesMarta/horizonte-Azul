import { query } from "@/config/db.config";

export const WishlistModel = {
  async add(usuarioId: number, viajeId: number) {
    const sql = "INSERT INTO wishlist (usuario_id, viaje_id) VALUES (?, ?)";
    return await query(sql, [usuarioId, viajeId]);
  },

  async remove(usuarioId: number, viajeId: number) {
    const sql = "DELETE FROM wishlist WHERE usuario_id = ? AND viaje_id = ?";
    return await query(sql, [usuarioId, viajeId]) as any;
  },

  async getByUsuarioId(usuarioId: string | number) {
    const sql = `
      SELECT w.*, v.paisDestino, v.aeropuertoDestino, v.img, v.precio 
      FROM wishlist w
      JOIN viajes v ON w.viaje_id = v.id
      WHERE w.usuario_id = ?
    `;
    return await query(sql, [usuarioId]) as any[];
  }
};