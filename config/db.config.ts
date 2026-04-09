import { neon, neonConfig } from "@neondatabase/serverless";
import { types } from 'pg';

// 1. CONFIGURACIÓN DE TIPOS (Type Parser)
// El ID 1700 corresponde al tipo NUMERIC/DECIMAL en PostgreSQL.
// Esto hace que "150.00" (string en DB) llegue como 150.0 (number en JS).
types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

// Opcional: Recomendado para despliegues en Vercel Edge
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);

export const query = async <T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> => {
  try {
    // Nota: El driver serverless de Neon a veces devuelve directamente las filas
    // o un objeto de resultado dependiendo de cómo se invoque.
    const result = await sql.query(queryText, params);

    /**
     * BLINDAJE ANTI-ERROR:
     * Si 'result' tiene una propiedad 'rows', devolvemos esa.
     * Si 'result' ya es un array, lo devolvemos tal cual.
     * Si no hay nada, devolvemos un array vacío.
     */
    if (result && (result as any).rows) {
      return (result as any).rows as T[];
    }

    if (Array.isArray(result)) {
      return result as T[];
    }

    return [] as T[];
    
  } catch (error: any) {
    console.error("❌ ERROR DB:", error.message);
    console.error("SQL:", queryText);
    throw error;
  }
};