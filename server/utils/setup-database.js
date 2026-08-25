const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  const databaseName = process.env.DB_NAME || 'designbeen';
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.changeUser({ database: databaseName });

  const schema = await fs.readFile(path.join(__dirname, '..', '..', 'database', 'schema.sql'), 'utf8');
  const seed = await fs.readFile(path.join(__dirname, '..', '..', 'database', 'seed.sql'), 'utf8');
  await connection.query(schema);
  await connection.query(seed);
  await connection.end();

  console.log(`Database ${databaseName} initialized successfully.`);
}

setupDatabase().catch((error) => {
  console.error(`Database setup failed: ${error.message}`);
  process.exitCode = 1;
});
