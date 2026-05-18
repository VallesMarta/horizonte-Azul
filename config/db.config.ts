import { Pool, types } from "pg";

// 1. CONFIGURACIÓN DE TIPOS (Mantiene los precios como números)
types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

// 2. DETECCIÓN DE ENTORNO
const isNeon = process.env.DATABASE_URL?.includes("neon.tech");

// 3. CONFIGURACIÓN DEL POOL
// Gestiona automáticamente la conexión según el entorno (Cloud vs Local)
const pool = new Pool({
  connectionString: isNeon
    ? process.env.DATABASE_URL
    : "postgresql://adminha:adminha@postgres:5432/horizonteAzul",
  ssl: isNeon ? { rejectUnauthorized: false } : false,
});

export const query = async <T = any>(
  queryText: string,
  params: any[] = [],
): Promise<T[]> => {
  try {
    let finalQuery = queryText;

    // 4. PARCHE DE COMPATIBILIDAD (Solo para Docker)
    // Si no es Neon, arreglamos el COALESCE de un solo argumento al vuelo
    if (!isNeon) {
      finalQuery = queryText.replace(
        /COALESCE\s*\(\s*\(([\s\S]*?)\)\s*\)/g,
        "COALESCE(($1), 0)",
      );
    }

    const result = await pool.query(finalQuery, params);

    // 5. RETORNO SEGURO DE FILAS
    return result && result.rows ? (result.rows as T[]) : [];
  } catch (error: any) {
    // LOG DETALLADO PARA EMERGENCIAS
    console.error("❌ ERROR DB:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error(
        "👉 Error de conexión: Revisa que el servicio en docker-compose se llame 'postgres'",
      );
    }
    throw error;
  }
};
