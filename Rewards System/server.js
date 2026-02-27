import http from "node:http";
import pool from "./db.js";

const PORT = Number(process.env.PORT || 3000);

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(JSON.stringify(body, null, 2));
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const dbProjectRef =
  (String(process.env.DB_USER || "").match(/^postgres\.([a-z0-9]+)/i) || [])[1] || "unknown";

const toIsoDate = (value) => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toISOString().slice(0, 10);
};

const mapMember = (row, transactions = []) => {
  const monthKey = new Date().toISOString().slice(0, 7);
  const earnedThisMonth = transactions
    .filter((t) => t.date?.startsWith(monthKey) && Number(t.points) > 0)
    .reduce((sum, t) => sum + Number(t.points), 0);
  const redeemedThisMonth = Math.abs(
    transactions
      .filter((t) => t.date?.startsWith(monthKey) && Number(t.points) < 0)
      .reduce((sum, t) => sum + Number(t.points), 0)
  );

  return {
    memberId: row.member_id,
    fullName: row.full_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    tier: row.tier ?? "Bronze",
    memberSince: row.member_since ?? "",
    status: row.status ?? "Active",
    points: Number(row.points ?? 0),
    pendingPoints: Number(row.pending_points ?? 0),
    lifetimePoints: Number(row.lifetime_points ?? 0),
    expiringPoints: Number(row.expiring_points ?? 0),
    daysUntilExpiry: Number(row.days_until_expiry ?? 0),
    surveysCompleted: Number(row.surveys_completed ?? 0),
    profileImage:
      row.profile_image ??
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=300&q=80",
    earnedThisMonth,
    redeemedThisMonth,
    transactions,
  };
};

const getTransactions = async (memberId, limit = 200) => {
  const query = `
    SELECT id, tx_date, description, type, points, category, receipt_id, balance
    FROM point_transactions
    WHERE member_id = $1
    ORDER BY tx_date DESC, id DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [memberId, limit]);
  return result.rows.map((row) => ({
    id: String(row.id),
    date: toIsoDate(row.tx_date),
    description: row.description,
    type: row.type,
    points: Number(row.points),
    category: row.category ?? "General",
    receiptId: row.receipt_id ?? null,
    balance: Number(row.balance ?? 0),
  }));
};

const getNextMemberId = async (client) => {
  const result = await client.query(`
    SELECT member_id
    FROM member_accounts
    WHERE member_id ~* '^ZUS[0-9]+$'
    ORDER BY CAST(SUBSTRING(member_id FROM 4) AS bigint) DESC
    LIMIT 1
  `);

  if (!result.rows.length) return "ZUS2024001";

  const current = String(result.rows[0].member_id);
  const digits = current.slice(3);
  const next = String(Number(digits) + 1).padStart(digits.length, "0");
  return `ZUS${next}`;
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });

  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && url.pathname === "/") {
      const result = await pool.query("SELECT NOW() AS db_time");
      return sendJson(res, 200, { status: "OK", dbTime: result.rows[0].db_time });
    }

    if (req.method === "GET" && url.pathname === "/api/debug/db-verification") {
      const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
      const who = await pool.query("select current_database() as db, current_user as db_user");
      const counts = await pool.query(`
        select
          (select count(*)::int from public.member_accounts) as member_count,
          (select count(*)::int from public.auth_users) as auth_count,
          (select count(*)::int from public.point_transactions) as tx_count
      `);

      let member = [];
      if (email) {
        const memberRes = await pool.query(
          "select member_id, full_name, email from public.member_accounts where lower(email)=lower($1)",
          [email]
        );
        member = memberRes.rows;
      }

      return sendJson(res, 200, {
        status: "OK",
        projectRefFromDbUser: dbProjectRef,
        dbTarget: who.rows[0],
        counts: counts.rows[0],
        memberByEmail: member,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/login") {
      const body = await parseBody(req);
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");

      if (!username || !password) {
        return sendJson(res, 400, { status: "ERROR", message: "Username and password are required." });
      }

      const result = await pool.query(
        `
          SELECT username, role, member_id
          FROM auth_users
          WHERE LOWER(username) = LOWER($1) AND password = $2
          LIMIT 1
        `,
        [username, password]
      );

      if (!result.rows.length) {
        return sendJson(res, 401, { status: "ERROR", message: "Invalid username or password." });
      }

      const user = result.rows[0];
      return sendJson(res, 200, {
        status: "OK",
        token: `db-${Date.now()}`,
        user: {
          username: user.username,
          role: user.role,
          memberId: user.member_id,
        },
      });
    }

    if (req.method === "POST" && url.pathname === "/api/register") {
      const body = await parseBody(req);
      const fullName = String(body.fullName || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const usernameInput = String(body.username || "").trim().toLowerCase();

      if (!fullName || !email || !password) {
        return sendJson(res, 400, {
          status: "ERROR",
          message: "fullName, email, and password are required.",
        });
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const memberId = await getNextMemberId(client);
        const username = usernameInput || memberId.toLowerCase();

        const usernameCheck = await client.query(
          "SELECT 1 FROM auth_users WHERE LOWER(username) = LOWER($1)",
          [username]
        );
        if (usernameCheck.rows.length) {
          await client.query("ROLLBACK");
          return sendJson(res, 409, { status: "ERROR", message: "Username already exists." });
        }

        const memberSince = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        await client.query(
          `
            INSERT INTO member_accounts (
              member_id, full_name, email, member_since, status, tier,
              points, pending_points, lifetime_points, expiring_points,
              days_until_expiry, earned_this_month, redeemed_this_month,
              profile_complete, has_downloaded_app, surveys_completed
            )
            VALUES (
              $1, $2, $3, $4, 'Active', 'Bronze',
              0, 0, 0, 0,
              0, 0, 0,
              false, false, 0
            )
          `,
          [memberId, fullName, email, memberSince]
        );

        await client.query(
          `INSERT INTO auth_users (username, password, role, member_id) VALUES ($1, $2, 'member', $3)`,
          [username, password, memberId]
        );

        await client.query("COMMIT");

        const memberResult = await pool.query("SELECT * FROM member_accounts WHERE member_id = $1 LIMIT 1", [memberId]);
        return sendJson(res, 201, {
          status: "OK",
          user: { username, role: "member", memberId },
          profile: mapMember(memberResult.rows[0], []),
        });
      } catch (error) {
        await client.query("ROLLBACK");
        if (String(error.message || "").toLowerCase().includes("unique")) {
          return sendJson(res, 409, { status: "ERROR", message: "Email already exists." });
        }
        throw error;
      } finally {
        client.release();
      }
    }

    if (req.method === "GET" && url.pathname === "/api/members") {
      const q = (url.searchParams.get("query") || "").trim();

      const result = await pool.query(
        `
          SELECT member_id, full_name, email, tier, status, points
          FROM member_accounts
          WHERE $1 = ''
             OR member_id ILIKE '%' || $1 || '%'
             OR full_name ILIKE '%' || $1 || '%'
             OR email ILIKE '%' || $1 || '%'
          ORDER BY full_name ASC
          LIMIT 50
        `,
        [q]
      );

      return sendJson(res, 200, { status: "OK", members: result.rows });
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/members/") && url.pathname.endsWith("/dashboard")) {
      const memberId = decodeURIComponent(url.pathname.split("/")[3] || "");
      if (!memberId) return sendJson(res, 400, { status: "ERROR", message: "Member ID is required." });

      const memberResult = await pool.query("SELECT * FROM member_accounts WHERE member_id = $1 LIMIT 1", [memberId]);
      if (!memberResult.rows.length) return sendJson(res, 404, { status: "ERROR", message: "Member not found." });

      const transactions = await getTransactions(memberId);
      return sendJson(res, 200, { status: "OK", profile: mapMember(memberResult.rows[0], transactions) });
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/members/") && url.pathname.endsWith("/transactions")) {
      const memberId = decodeURIComponent(url.pathname.split("/")[3] || "");
      if (!memberId) return sendJson(res, 400, { status: "ERROR", message: "Member ID is required." });
      const transactions = await getTransactions(memberId);
      return sendJson(res, 200, { status: "OK", transactions });
    }

    if (req.method === "POST" && url.pathname.startsWith("/api/members/") && url.pathname.endsWith("/award")) {
      const memberId = decodeURIComponent(url.pathname.split("/")[3] || "");
      if (!memberId) return sendJson(res, 400, { status: "ERROR", message: "Member ID is required." });

      const body = await parseBody(req);
      const points = Number(body.points || 0);
      if (!Number.isFinite(points) || points === 0) {
        return sendJson(res, 400, { status: "ERROR", message: "Valid non-zero points are required." });
      }

      const description = String(body.description || "Points adjustment");
      const category = String(body.category || "Bonus");
      const type = points > 0 ? "earned" : "redeemed";
      const date = new Date().toISOString().slice(0, 10);

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const memberResult = await client.query(
          "SELECT * FROM member_accounts WHERE member_id = $1 LIMIT 1 FOR UPDATE",
          [memberId]
        );

        if (!memberResult.rows.length) {
          await client.query("ROLLBACK");
          return sendJson(res, 404, { status: "ERROR", message: "Member not found." });
        }

        const member = memberResult.rows[0];
        const currentPoints = Number(member.points || 0);
        const nextPoints = currentPoints + points;
        if (nextPoints < 0) {
          await client.query("ROLLBACK");
          return sendJson(res, 400, { status: "ERROR", message: "Not enough points." });
        }

        const lifetimePoints = Number(member.lifetime_points || 0) + (points > 0 ? points : 0);
        const earnedThisMonth = Number(member.earned_this_month || 0) + (points > 0 ? points : 0);
        const redeemedThisMonth = Number(member.redeemed_this_month || 0) + (points < 0 ? Math.abs(points) : 0);

        await client.query(
          `
            UPDATE member_accounts
            SET points = $2,
                lifetime_points = $3,
                earned_this_month = $4,
                redeemed_this_month = $5
            WHERE member_id = $1
          `,
          [memberId, nextPoints, lifetimePoints, earnedThisMonth, redeemedThisMonth]
        );

        await client.query(
          `
            INSERT INTO point_transactions (member_id, tx_date, description, type, points, category, receipt_id, balance)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
          [memberId, date, description, type, points, category, body.receiptId || null, nextPoints]
        );

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      const member = await pool.query("SELECT * FROM member_accounts WHERE member_id = $1 LIMIT 1", [memberId]);
      const transactions = await getTransactions(memberId);
      return sendJson(res, 200, {
        status: "OK",
        message: "Points updated successfully.",
        profile: mapMember(member.rows[0], transactions),
      });
    }

    return sendJson(res, 404, { status: "NOT_FOUND" });
  } catch (error) {
    return sendJson(res, 500, {
      status: "ERROR",
      message: "Request failed.",
      details: error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
