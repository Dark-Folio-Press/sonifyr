import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "@shared/schema";
import process from "process";

const dbMode = process.env.DB_MODE ?? "sqlite";

let db: any;

/* ─────────────────────────────
   SQLITE (local dev / contributors)
   ───────────────────────────── */
if (dbMode === "sqlite") {
  console.log("🟢 Using SQLite (local dev mode)");

  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const Database = (await import("better-sqlite3")).default;

  const sqlite = new Database("sonifyr.dev.db");

  db = drizzle(sqlite, { schema });

}

/* ─────────────────────────────
   POSTGRES (Neon / production)
   ───────────────────────────── */
else {
  console.log("🟣 Using Postgres (Neon)");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for postgres mode");
  }

  const ws = (await import("ws")).default;
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-serverless");

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  db = drizzle({ client: pool, schema });

  // Postgres-only startup DDL
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS guest_rate_limits (
      id serial PRIMARY KEY,
      email varchar NOT NULL UNIQUE,
      last_playlist_generated timestamp,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    )
  `);
}

/* ───────────────────────────── */

export { db };
