import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const sslEnabled = String(process.env.DB_SSL ?? "true").toLowerCase() !== "false";
const ssl = sslEnabled ? { rejectUnauthorized: false } : undefined;

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
const expectedProjectRef = String(process.env.SUPABASE_PROJECT_REF || "").trim();

const extractRefFromUser = (user) => {
  const match = String(user || "").match(/^postgres\.([a-z0-9]+)/i);
  return match ? match[1] : "";
};

const pool = connectionString
  ? new Pool({ connectionString, ssl })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "postgres",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl,
    });

const activeRef = extractRefFromUser(process.env.DB_USER);
if (expectedProjectRef && activeRef && expectedProjectRef !== activeRef) {
  throw new Error(
    `Supabase project mismatch: .env DB_USER points to '${activeRef}', but SUPABASE_PROJECT_REF is '${expectedProjectRef}'.`
  );
}

pool.on("connect", () => {
  const host = process.env.DB_HOST || "from DATABASE_URL";
  const ref = activeRef || "unknown";
  console.log(`[DB] Connected host=${host} project_ref=${ref}`);
});

export default pool;
