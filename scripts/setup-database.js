import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  const databaseName = process.env.DB_NAME || 'sys';
  const sslOption = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

  console.log(`Connecting to database '${databaseName}' on TiDB Cloud (${process.env.DB_HOST})...`);

  let connectionOptions;
  if (process.env.DATABASE_URL) {
    connectionOptions = {
      uri: process.env.DATABASE_URL,
      ssl: sslOption,
      multipleStatements: true,
    };
  } else {
    connectionOptions = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 4000),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: databaseName,
      ssl: sslOption,
      multipleStatements: true,
    };
  }

  const connection = await mysql.createConnection(connectionOptions);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await connection.query(`USE \`${databaseName}\``);
  } catch (err) {
    console.log('Notice during database check:', err.message);
  }

  const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
  const seedPath = path.join(process.cwd(), 'database', 'seed.sql');

  const schema = await fs.readFile(schemaPath, 'utf8');
  const seed = await fs.readFile(seedPath, 'utf8');

  console.log('Applying database schema tables...');
  await connection.query(schema);

  console.log('Seeding initial data & admin user...');
  await connection.query(seed);

  await connection.end();

  console.log(`\n✅ Database '${databaseName}' initialized successfully on TiDB Cloud!`);
}

setupDatabase().catch((error) => {
  console.error(`Database setup failed: ${error.message}`);
  process.exitCode = 1;
});
