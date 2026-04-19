import { query } from "@/config/db.config";

export type EstadoVuelo =
  | "programado"
  | "abordando"
  | "en_vuelo"
  | "completado"
  | "cancelado";

export const VueloModel = {
  // Para el usuario — solo vuelos futuros y operativos
  async getByViajeId(viajeId: string | number) {
    return await query(
      `
      SELECT 
        id, viaje_id, tipo, estado,
        "fecSalida", "horaSalida", "fecLlegada", "horaLlegada",
        "plazasTotales", "plazasDisponibles", precio_ajustado,
        created_at, updated_at
      FROM vuelos 
      WHERE viaje_id = $1 
        AND "fecSalida" >= CURRENT_DATE
        AND estado NOT IN ('completado', 'cancelado')
      ORDER BY "fecSalida" ASC, tipo ASC
    `,
      [viajeId],
    );
  },

  // Para el admin — todos los vuelos incluidos completados
  async getByViajeIdAdmin(viajeId: string | number) {
    // Marcar como completados los vuelos pasados automáticamente
    await query(
      `
    UPDATE vuelos
    SET estado = 'completado'
    WHERE viaje_id = $1
      AND "fecSalida" < CURRENT_DATE
      AND estado NOT IN ('completado', 'cancelado')
  `,
      [viajeId],
    );

    return await query(
      `
    SELECT 
      id, viaje_id, tipo, estado,
      "fecSalida", "horaSalida", "fecLlegada", "horaLlegada",
      "plazasTotales", "plazasDisponibles", precio_ajustado,
      created_at, updated_at
    FROM vuelos 
    WHERE viaje_id = $1 
    ORDER BY "fecSalida" DESC, tipo ASC
  `,
      [viajeId],
    );
  },

  async getById(id: string | number) {
    const rows = await query(
      `
      SELECT 
        v.*, 
        vi."paisOrigen", vi."aeropuertoOrigen", vi."iataOrigen",
        vi."paisDestino", vi."aeropuertoDestino", vi."iataDestino"
      FROM vuelos v
      JOIN viajes vi ON vi.id = v.viaje_id
      WHERE v.id = $1
    `,
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    viaje_id: number;
    fecSalida: string;
    horaSalida: string;
    fecLlegada: string;
    horaLlegada: string;
    plazasTotales?: number;
    plazasDisponibles?: number;
    precio_ajustado: number;
    tipo: string;
    estado?: EstadoVuelo;
  }) {
    const rows = await query(
      `
      INSERT INTO vuelos 
        (viaje_id, "fecSalida", "horaSalida", "fecLlegada", "horaLlegada",
         "plazasTotales", "plazasDisponibles", precio_ajustado, tipo, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
      [
        data.viaje_id,
        data.fecSalida,
        data.horaSalida,
        data.fecLlegada,
        data.horaLlegada,
        data.plazasTotales ?? 150,
        data.plazasDisponibles ?? data.plazasTotales ?? 150,
        data.precio_ajustado ?? 0,
        data.tipo ?? "ida",
        data.estado ?? "programado",
      ],
    );
    return rows[0];
  },

  async update(
    id: string | number,
    data: Partial<{
      fecSalida: string;
      horaSalida: string;
      fecLlegada: string;
      horaLlegada: string;
      plazasTotales: number;
      precio_ajustado: number;
      tipo: string;
      estado: EstadoVuelo;
    }>,
  ) {
    const rows = await query(
      `
    UPDATE vuelos SET
      "fecSalida"     = COALESCE($1, "fecSalida"),
      "horaSalida"    = COALESCE($2, "horaSalida"),
      "fecLlegada"    = COALESCE($3, "fecLlegada"),
      "horaLlegada"   = COALESCE($4, "horaLlegada"),
      "plazasTotales" = COALESCE($5, "plazasTotales"),
      precio_ajustado = COALESCE($6, precio_ajustado),
      tipo            = COALESCE($7, tipo),
      estado          = COALESCE($8::estado_vuelo_enum, estado::estado_vuelo_enum)
    WHERE id = $9
    RETURNING *
  `,
      [
        data.fecSalida ?? null,
        data.horaSalida ?? null,
        data.fecLlegada ?? null,
        data.horaLlegada ?? null,
        data.plazasTotales ?? null,
        data.precio_ajustado ?? null,
        data.tipo ?? null,
        data.estado ?? null,
        id,
      ],
    );
    return rows[0];
  },

  async delete(id: string | number) {
    return await query(`DELETE FROM vuelos WHERE id = $1 RETURNING id`, [id]);
  },

  async decrementarPlazas(id: string | number, cantidad: number) {
    const rows = await query(
      `
      UPDATE vuelos 
      SET "plazasDisponibles" = "plazasDisponibles" - $1
      WHERE id = $2 AND "plazasDisponibles" >= $1
      RETURNING id, "plazasDisponibles"
    `,
      [cantidad, id],
    );
    return rows[0] || null;
  },

  async restaurarPlazas(id: string | number, cantidad: number) {
    return await query(
      `
      UPDATE vuelos 
      SET "plazasDisponibles" = LEAST("plazasDisponibles" + $1, "plazasTotales")
      WHERE id = $2
      RETURNING id, "plazasDisponibles"
    `,
      [cantidad, id],
    );
  },
};
