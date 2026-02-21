import http from "node:http";
import pool from "./db.js";

const PORT = 3000;

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body, null, 2));
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    try {
      const result = await pool.query("SELECT NOW() AS db_time");
      return sendJson(res, 200, {
        status: "OK",
        dbTime: result.rows[0].db_time,
      });
    } catch (error) {
      return sendJson(res, 500, {
        status: "ERROR",
        message: "Database connection failed",
        details: error.message,
      });
    }
  }

  return sendJson(res, 404, { status: "NOT_FOUND" });
});

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
