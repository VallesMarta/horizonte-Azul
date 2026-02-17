import mysql, { Pool } from "mysql2/promise";

const globalForDb = global as unknown as { pool: Pool };

export const connectDB = async (): Promise<Pool> => {
  if (!globalForDb.pool) {
    const dbConfig = {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || "horizonteAzul",
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      // Activar SSL solo si no estamos en el contenedor local
      ssl:
        process.env.MYSQL_HOST !== "mysql" &&
        process.env.MYSQL_HOST !== "localhost"
          ? { rejectUnauthorized: true }
          : undefined,
    };

    globalForDb.pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log(`✅ Pool de MySQL creado para el host: ${dbConfig.host}`);
  }
  return globalForDb.pool;
};

export const getPool = (): Pool => {
  if (!globalForDb.pool) {
    throw new Error("DB no inicializada. Llama a connectDB() primero.");
  }
  return globalForDb.pool;
};

export const query = async (sql: string, params?: any[]) => {
  const pool = await connectDB();
  // Cambiamos execute por query para soportar transacciones (reservas)
  const [rows] = await pool.query(sql, params);
  return rows;
};
