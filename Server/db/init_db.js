import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME || "hospital_db";

// Pool for checking/creating the database
const defaultPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  database: "postgres",
});

// Pool for working inside the hospital DB
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  database: dbName,
});

// Create the database if it doesn’t exist
const createDatabase = async () => {
  try {
    const query = await defaultPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    if (query.rowCount === 0) {
      await defaultPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created.`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
  }
};

// Create schemas and tables
const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // =============== AUTH SCHEMA ===============
    await client.query(`CREATE SCHEMA IF NOT EXISTS auth`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth.accounts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'patient',
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
      )
    `);

    // =============== USER SCHEMA ===============
    await client.query(`CREATE SCHEMA IF NOT EXISTS "user"`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user".profile (
        id SERIAL PRIMARY KEY,
        account_id INT REFERENCES auth.accounts(id) ON DELETE CASCADE,
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

    // =============== DOCTOR SCHEMA ===============
    await client.query(`CREATE SCHEMA IF NOT EXISTS doctor`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctor.details (
        id SERIAL PRIMARY KEY,
        account_id INT REFERENCES auth.accounts(id) ON DELETE CASCADE,
        specialization VARCHAR(100) NOT NULL,
        license_number VARCHAR(100) UNIQUE,
        years_of_experience INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =============== PAYMENT SCHEMA ===============
    await client.query(`CREATE SCHEMA IF NOT EXISTS payment`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment.transactions (
        id SERIAL PRIMARY KEY,
        account_id INT REFERENCES auth.accounts(id) ON DELETE CASCADE,
        amount NUMERIC(10,2) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'NGN',
        status TEXT CHECK (status IN ('pending','success','failed')) NOT NULL,
        payment_method TEXT,
        reference TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      )
    `);

    // =============== APPOINTMENT SCHEMA ===============
    await client.query(`CREATE SCHEMA IF NOT EXISTS appointment`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointment.bookings (
        id SERIAL PRIMARY KEY,
        profile_id INT NOT NULL REFERENCES "user".profile(id) ON DELETE CASCADE,
        doctor_id INT REFERENCES doctor.details(id) ON DELETE SET NULL,
        appointment_date TIMESTAMP NOT NULL,
        note TEXT,
        status VARCHAR(20) DEFAULT 'booked'
          CHECK (status IN ('booked', 'cancelled', 'rescheduled', 'in_progress', 'completed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // =============== CONSULTATION SCHEMA ===============
    await client.query(`CREATE SCHEMA IF NOT EXISTS consultation`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultation.records (
        id SERIAL PRIMARY KEY,
        appointment_id INT REFERENCES appointment.bookings(id) ON DELETE CASCADE,
        notes TEXT,
        prescriptions TEXT,
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query("COMMIT");
    console.log("✅ All schemas and tables created successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating tables:", error.message);
  } finally {
    client.release();
  }
};

export const initiateDatabase = async () => {
  await createDatabase();
  await createTables();
};