import { query } from "@/config/db.config";

export const WishlistModel = {
  async add(usuarioId: number, viajeId: number) {
    return await query(
      `
      INSERT INTO wishlist (usuario_id, viaje_id)
      VALUES ($1, $2)
      ON CONFLICT (usuario_id, viaje_id) DO NOTHING
      RETURNING *
    `,
      [usuarioId, viajeId],
    );
  },

  async remove(usuarioId: number, viajeId: number) {
    return await query(
      `
      DELETE FROM wishlist 
      WHERE usuario_id = $1 AND viaje_id = $2
      RETURNING *
    `,
      [usuarioId, viajeId],
    );
  },

  async getByUsuarioId(usuarioId: number | string) {
    return await query(
      `
    SELECT 
      w.usuario_id,
      w.viaje_id,
      v."paisOrigen",
      v."aeropuertoOrigen",
      v."iataOrigen",
      v."paisDestino",
      v."aeropuertoDestino",
      v."iataDestino",
      v.img,
      v.descripcion,
      COALESCE(
        (SELECT MIN(precio_ajustado) 
         FROM vuelos 
         WHERE viaje_id = v.id AND "fecSalida" >= CURRENT_DATE),
        0
      ) AS precio_oferta
    FROM wishlist w
    JOIN viajes v ON w.viaje_id = v.id
    WHERE w.usuario_id = $1
    ORDER BY v."paisDestino" ASC
  `,
      [usuarioId],
    );
  },

  async isInWishlist(usuarioId: number, viajeId: number) {
    const rows = await query(
      `
      SELECT 1 FROM wishlist 
      WHERE usuario_id = $1 AND viaje_id = $2
    `,
      [usuarioId, viajeId],
    );
    return rows.length > 0;
  },
};
