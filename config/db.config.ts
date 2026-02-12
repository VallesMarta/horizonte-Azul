import mysql, { Pool } from "mysql2/promise";

const globalForDb = global as unknown as { pool: Pool };

export const connectDB = async (): Promise<Pool> => {
  if (!globalForDb.pool) {
    let dbConfig;
    let isUrl = false;

    if (process.env.DATABASE_URL) {
      dbConfig = process.env.DATABASE_URL;
      isUrl = true;
    } else {
      dbConfig = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || "horizonteAzul",
        port: 3306,
        // IMPORTANTE: Azure requiere SSL
        ssl: {
          rejectUnauthorized: true,
        },
      };
      isUrl = false;
    }

    if (isUrl) {
      globalForDb.pool = mysql.createPool(dbConfig as string);
    } else {
      globalForDb.pool = mysql.createPool({
        ...(dbConfig as object),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    console.log("✅ Pool de MySQL creado");
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
  const [rows] = await pool.execute(sql, params);
  return rows;
};
