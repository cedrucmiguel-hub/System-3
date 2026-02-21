import pool from "./db.js";

async function testConnection() {
  try {
    console.log("Database URL:", process.env.DB_HOST);
    const res = await pool.query("SELECT NOW()");
    console.log("DB connected:", res.rows[0]);
  } catch (err) {
    console.error("DB connection error:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
