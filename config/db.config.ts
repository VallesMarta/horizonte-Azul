import mysql, { Pool } from 'mysql2/promise';

// Tipado para evitar errores de TS con el objeto global
const globalForDb = global as unknown as { pool: Pool };

export const connectDB = async (): Promise<Pool> => {
  if (!globalForDb.pool) {
    globalForDb.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || 'horizonteAzul',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('✅ Pool de MySQL creado');
  }
  return globalForDb.pool;
};

// Función para obtener el pool directamente
export const getPool = (): Pool => {
  if (!globalForDb.pool) {
    throw new Error('DB no inicializada. Llama a connectDB() primero.');
  }
  return globalForDb.pool;
};

// Función de ayuda para no tener que llamar siempre al pool
export const query = async (sql: string, params?: any[]) => {
  const pool = await connectDB();
  const [rows] = await pool.execute(sql, params);
  return rows;
};