import { pool } from "./init_db.js"

export const connectDB = async ()=>{
  try {
    const client = await pool.connect()
    console.log("✅ Postgres Database connected successfully 🌐");
    client.release()
  } catch (error) {
    console.error("❌ Error connecting to Postgres database:", error.message);
  }
}