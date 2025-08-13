import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()
const dbName = process.env.DB_NAME || 'hospital_db';

const configWithOutDB = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  database: 'postgres',
};

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: dbName,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

const defaultPool = new Pool(configWithOutDB)

const createDataBase = async () => {
  try {
    const query = await pool.query(`SELECT 1 FROM pg_database WHERE datname =$1`, [dbName])
    if (query.rowCount === 0) {
      await defaultPool.query(`CREATE DATABASE ${dbName}`)
      console.log(`✅ Database "${dbName}" created.`);
    } else {
      console.log(`ℹ️  Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
  } finally {
    await defaultPool.end();
  }
}
const createTables = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // auth schema and tables
    await client.query(`CREATE SCHEMA IF NOT EXISTS auth`)
    await client.query(`CREATE TABLE IF NOT EXISTS auth.accounts (
       id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        isVerified BOOLEAN DEFAULT FALSE,
        verification_code VARCHAR(50),
        verification_code_expiry TIMESTAMP,
        last_login TIMESTAMP,
        last_password_change TIMESTAMP,
        reset_password_token VARCHAR(255),
        reset_password_token_expiry TIMESTAMP,
        accountStatus VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    )
    // user and profile table
    await client.query(`CREATE SCHEMA IF NOT EXISTS "user"`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user".profile (
        id SERIAL PRIMARY KEY,
        account_id INTEGER REFERENCES auth.accounts(id),
        full_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        date_of_birth DATE,
        blood_group VARCHAR(10),
        medical_condition VARCHAR(225),
        current_medication VARCHAR(225),
        known_allergies VARCHAR(225),
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query('COMMIT');
    console.log("✅ All tables and schemas created successfully.");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Error creating tables:", error.message);
  } finally {
    client.release();
  }
}
export const initiateDatabase = async()=>{
  await createDataBase();
  await createTables();
}