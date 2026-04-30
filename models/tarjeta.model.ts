import { query } from "@/config/db.config";

export const TarjetaModel = {
  // Obtener todas las tarjetas de un usuario
  async getByUsuarioId(usuarioId: string | number) {
    const sql = `
      SELECT 
        id, 
        stripe_payment_method_id AS "stripePaymentMethodId", 
        brand, 
        last4, 
        exp_month AS "expMonth", 
        exp_year AS "expYear"
      FROM tarjetas_usuario 
      WHERE usuario_id = $1 
      ORDER BY created_at DESC
    `;
    return await query(sql, [usuarioId]);
  },
  
  async create(data: any) {
    const sql = `
    INSERT INTO tarjetas_usuario (
      usuario_id, stripe_payment_method_id, last4, brand, exp_month, exp_year, nombre_titular
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
    const rows = await query(sql, [
      data.usuarioId,
      data.paymentMethodId,
      data.last4,
      data.brand,
      data.expMonth,
      data.expYear,
      data.nombreTitular,
    ]);
    return rows[0];
  },
  async updateStatus(
    usuarioId: number | string,
    paymentMethodId: string,
    esPredeterminada: boolean,
  ) {
    // 1. Si vamos a poner esta como predeterminada, quitamos el check a todas las demás
    if (esPredeterminada) {
      await query(
        `UPDATE tarjetas_usuario SET es_predeterminada = false WHERE usuario_id = $1`,
        [usuarioId],
      );
    }

    // 2. Actualizamos la tarjeta en cuestión
    const sql = `
      UPDATE tarjetas_usuario 
      SET es_predeterminada = $1 
      WHERE usuario_id = $2 AND stripe_payment_method_id = $3
      RETURNING *
    `;
    const rows = await query(sql, [
      esPredeterminada,
      usuarioId,
      paymentMethodId,
    ]);
    return rows[0];
  },

  async remove(usuarioId: string | number, paymentMethodId: string) {
    const sql = `
      DELETE FROM tarjetas_usuario 
      WHERE usuario_id = $1 AND stripe_payment_method_id = $2
      RETURNING *
    `;
    return await query(sql, [usuarioId, paymentMethodId]);
  },
};
