import mysql from 'mysql2/promise';

const globalForDb = global;

function getPool() {
  if (globalForDb.mysqlPool) {
    return globalForDb.mysqlPool;
  }

  let connectionConfig;

  if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
    const uri = process.env.DATABASE_URL || process.env.MYSQL_URL;
    connectionConfig = {
      uri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z',
    };
  } else {
    connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'designbeen',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z',
    };
  }

  const pool = mysql.createPool(connectionConfig);

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.mysqlPool = pool;
  }

  return pool;
}

export const pool = getPool();

export async function query(sql, params = []) {
  return pool.execute(sql, params);
}
