import { query } from "@/config/db.config";
export type TipoNotificacion =
  | "respuesta_contacto"
  | "reserva_confirmada"
  | "reserva_pendiente"
  | "reserva_cancelada"
  | "sistema";

export interface Notificacion {
  id?: number;
  usuario_id: number;
  tipo: TipoNotificacion;
  titulo: string;
  cuerpo: string;
  leida?: boolean;
  enlace?: string | null;
  mensaje_contacto_id?: number | null;
  created_at?: Date;
}

export const NotificacionModel = {
  async crear(data: Notificacion) {
    const rows = await query<Notificacion>(
      `INSERT INTO notificaciones (usuario_id, tipo, titulo, cuerpo, enlace, mensaje_contacto_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.usuario_id,
        data.tipo,
        data.titulo,
        data.cuerpo,
        data.enlace ?? null,
        data.mensaje_contacto_id ?? null,
      ],
    );
    return rows[0];
  },

  async getByUsuario(usuario_id: number) {
    return query<Notificacion>(
      `SELECT * FROM notificaciones
       WHERE usuario_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [usuario_id],
    );
  },

  async contarNoLeidas(usuario_id: number): Promise<number> {
    const rows = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM notificaciones
       WHERE usuario_id = $1 AND leida = FALSE`,
      [usuario_id],
    );
    return parseInt(rows[0]?.count ?? "0", 10);
  },

  async marcarLeida(id: number, usuario_id: number) {
    const rows = await query<Notificacion>(
      `UPDATE notificaciones SET leida = TRUE
       WHERE id = $1 AND usuario_id = $2 RETURNING *`,
      [id, usuario_id],
    );
    return rows[0] ?? null;
  },

  async marcarTodasLeidas(usuario_id: number) {
    await query(
      `UPDATE notificaciones SET leida = TRUE WHERE usuario_id = $1`,
      [usuario_id],
    );
  },

  async eliminar(id: number, usuario_id: number) {
    await query(
      `DELETE FROM notificaciones WHERE id = $1 AND usuario_id = $2`,
      [id, usuario_id],
    );
  },

  async eliminarLeidas(usuario_id: number) {
    await query(
      `DELETE FROM notificaciones WHERE usuario_id = $1 AND leida = TRUE`,
      [usuario_id],
    );
  },

  async eliminarTodas(usuario_id: number) {
    await query(`DELETE FROM notificaciones WHERE usuario_id = $1`, [
      usuario_id,
    ]);
  },
};
