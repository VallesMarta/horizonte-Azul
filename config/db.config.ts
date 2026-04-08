import { Pool, QueryResult } from "pg";

const globalForDb = global as unknown as { pgPool: Pool };

export const connectDB = async (): Promise<Pool> => {
  if (!globalForDb.pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString)
      throw new Error("❌ DATABASE_URL no encontrada en .env");

    globalForDb.pgPool = new Pool({
      connectionString,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test de conexión rápido
    globalForDb.pgPool.query("SELECT NOW()", (err) => {
      if (err) {
        console.error("❌ ERROR DE CONEXIÓN A POSTGRES:", err.message);
      } else {
        console.log("✅ CONEXIÓN EXITOSA AL SERVICIO 'postgres'");
      }
    });
  }
  return globalForDb.pgPool;
};

export const query = async <T = any>(
  sql: string,
  params: any[] = [],
): Promise<any> => {
  const pool = await connectDB();

  // Convertimos los "?" (MySQL) a "$1, $2..." (Postgres)
  let pgSql = sql;
  let count = 1;
  while (pgSql.includes("?")) {
    pgSql = pgSql.replace("?", `$${count}`);
    count++;
  }

  try {
    const res: QueryResult = await pool.query(pgSql, params);

    // Normalizamos para que los controladores (que esperan formato MySQL) funcionen:
    const rows: any = res.rows;

    // 1. Añadimos affectedRows para DELETE/UPDATE
    rows.affectedRows = res.rowCount || 0;

    // 2. Añadimos insertId si la query devuelve un ID (por el RETURNING id)
    if (res.rows.length > 0 && res.rows[0].id) {
      rows.insertId = res.rows[0].id;
    }

    return rows;
  } catch (err: any) {
    console.error("❌ Error en la Query SQL:", err.message);
    console.error("SQL con error:", pgSql);
    throw err;
  }
};
