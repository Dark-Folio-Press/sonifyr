import process from "process";

const DB_MODE = process.env.DB_MODE ?? "sqlite";

let db: any;

/* ─────────────────────────────
   SQLITE (local dev / contributors)
   ───────────────────────────── */
if (DB_MODE === "sqlite") {
  console.log("🟢 DB_MODE=sqlite — using local SQLite database");

  const Database = (await import("better-sqlite3")).default;
  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const schema = await import("../shared/schema/sqlite");

  const sqlite = new Database("sonifyr.dev.db");

  db = drizzle(sqlite, { schema });
}

/* ─────────────────────────────
   POSTGRES (Neon / production)
   ───────────────────────────── */
else {
  console.log("🟣 DB_MODE=postgres — using Neon/Postgres");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set when DB_MODE=postgres");
  }

  const ws = (await import("ws")).default;
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-serverless");
  const schema = await import("../shared/schema/postgres");

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  db = drizzle({ client: pool, schema });
}

export { db };
