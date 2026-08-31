import mysql from 'mysql2/promise';

const globalForDb = globalThis;

function getPool() {
  if (globalForDb.mysqlPool) {
    return globalForDb.mysqlPool;
  }

  const sslOption = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;
  let connectionConfig;

  if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
    const uri = process.env.DATABASE_URL || process.env.MYSQL_URL;
    connectionConfig = {
      uri,
      ssl: sslOption,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      connectTimeout: 10000,
      timezone: 'Z',
    };
  } else {
    connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 4000),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'designbeendb',
      ssl: sslOption,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      connectTimeout: 10000,
      timezone: 'Z',
    };
  }

  const pool = mysql.createPool(connectionConfig);
  globalForDb.mysqlPool = pool;
  return pool;
}

export const pool = getPool();

export async function query(sql, params = []) {
  return pool.execute(sql, params);
}
