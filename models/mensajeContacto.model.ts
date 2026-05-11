import { query } from "@/config/db.config";

export interface MensajeContacto {
  id?: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  usuario_id?: number | null;
  leido?: boolean;
  respondido?: boolean;
  respuesta?: string | null;
  fecha_respuesta?: Date | null;
  created_at?: Date;
}

export interface MensajeHilo {
  id: number;
  contacto_id: number;
  autor: "usuario" | "admin";
  contenido: string;
  created_at: string;
}

export const MensajeContactoModel = {
  async crear(data: MensajeContacto) {
    // 1. Crear la cabecera
    const rows = await query<MensajeContacto>(
      `INSERT INTO mensajes_contacto (nombre, email, asunto, usuario_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.nombre, data.email, data.asunto, data.usuario_id ?? null],
    );
    const contacto = rows[0];

    // 2. Insertar el primer mensaje en el hilo
    await query(
      `INSERT INTO contacto_mensajes (contacto_id, autor, contenido)
     VALUES ($1, 'usuario', $2)`,
      [contacto.id, data.mensaje],
    );

    return contacto;
  },

  async getAll() {
    return query(
      `SELECT mc.*,
            u.username,
            (SELECT contenido FROM contacto_mensajes
             WHERE contacto_id = mc.id
             ORDER BY created_at DESC LIMIT 1) AS ultimo_mensaje,
            (SELECT autor FROM contacto_mensajes
             WHERE contacto_id = mc.id
             ORDER BY created_at DESC LIMIT 1) AS ultimo_autor
     FROM mensajes_contacto mc
     LEFT JOIN usuarios u ON u.id = mc.usuario_id
     ORDER BY mc.created_at DESC`,
    );
  },
  async getById(id: number) {
    const rows = await query<MensajeContacto>(
      `SELECT * FROM mensajes_contacto WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async marcarLeido(id: number) {
    const rows = await query<MensajeContacto>(
      `UPDATE mensajes_contacto SET leido = TRUE WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0];
  },

  async responder(id: number) {
    const rows = await query<MensajeContacto>(
      `UPDATE mensajes_contacto
     SET respondido = TRUE
     WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0];
  },

  async eliminar(id: number) {
    await query(`DELETE FROM mensajes_contacto WHERE id = $1`, [id]);
  },
  async getHilo(contacto_id: number) {
    return query<MensajeHilo>(
      `SELECT * FROM contacto_mensajes
       WHERE contacto_id = $1
       ORDER BY created_at ASC`,
      [contacto_id],
    );
  },

  async añadirAlHilo(
    contacto_id: number,
    autor: "usuario" | "admin",
    contenido: string,
  ) {
    const rows = await query<MensajeHilo>(
      `INSERT INTO contacto_mensajes (contacto_id, autor, contenido)
       VALUES ($1, $2, $3) RETURNING *`,
      [contacto_id, autor, contenido],
    );
    return rows[0];
  },
  async getMisConsultas(usuario_id: number) {
    return query(
      `SELECT mc.id, mc.asunto, mc.leido, mc.respondido, mc.created_at,
            cm_last.contenido AS ultimo_mensaje,
            cm_last.autor     AS ultimo_autor
     FROM mensajes_contacto mc
     LEFT JOIN LATERAL (
         SELECT contenido, autor
         FROM contacto_mensajes
         WHERE contacto_id = mc.id
         ORDER BY created_at DESC
         LIMIT 1
     ) cm_last ON true
     WHERE mc.usuario_id = $1
     ORDER BY mc.created_at DESC`,
      [usuario_id],
    );
  },
  async getHiloUsuario(contacto_id: number, usuario_id: number) {
    // Verificar que pertenece al usuario
    const rows = await query(
      `SELECT id FROM mensajes_contacto WHERE id = $1 AND usuario_id = $2`,
      [contacto_id, usuario_id],
    );
    if (!rows[0]) return null;

    return query<MensajeHilo>(
      `SELECT * FROM contacto_mensajes
     WHERE contacto_id = $1
     ORDER BY created_at ASC`,
      [contacto_id],
    );
  },
  async marcarPendiente(id: number) {
    await query(
      `UPDATE mensajes_contacto SET respondido = FALSE WHERE id = $1`,
      [id],
    );
  },
};
