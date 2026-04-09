import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const query = async <T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> => {
  try {
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