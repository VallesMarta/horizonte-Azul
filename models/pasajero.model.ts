import { query } from "@/config/db.config";

export const PasajeroModel = {
  async crearBulk(
    pasajeros: {
      reserva_id: number;
      nombre: string;
      apellidos: string;
      tipoDocumento: string;
      numDocumento: string;
      fecCaducidadDocumento: string | null;
      fecNacimiento: string | null;
      esAdulto: boolean;
    }[],
  ) {
    const results = [];

    for (const p of pasajeros) {
      const rows = await query(
        `
        INSERT INTO pasajeros (
          reserva_id, 
          nombre, 
          apellidos, 
          "tipoDocumento", 
          "numDocumento", 
          "fecCaducidadDocumento", 
          "fecNacimiento", 
          "esAdulto"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
        [
          p.reserva_id,
          p.nombre,
          p.apellidos,
          p.tipoDocumento,
          p.numDocumento,
          p.fecCaducidadDocumento || null,
          p.fecNacimiento || null,
          p.esAdulto,
        ],
      );

      results.push(rows[0]);
    }

    return results;
  },

  async getByReservaId(reservaId: number | string) {
    return await query(
      `
      SELECT * FROM pasajeros 
      WHERE reserva_id = $1 
      ORDER BY "esAdulto" DESC, id ASC
    `,
      [reservaId],
    );
  },
};
