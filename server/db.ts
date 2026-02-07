import process from "process";

const DB_MODE = process.env.DB_MODE ?? "sqlite";

let db: any;

if (DB_MODE === "sqlite") {
  console.log("DB_MODE=sqlite — using local SQLite database");

  const Database = (await import("better-sqlite3")).default;
  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const schema = await import("../shared/schema/sqlite");

  const sqlite = new Database("sonifyr.dev.db");

  db = drizzle(sqlite, { schema });
} else {
  console.log("DB_MODE=postgres — using PostgreSQL");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set when DB_MODE=postgres");
  }

  const { Pool } = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const schema = await import("../shared/schema/postgres");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  db = drizzle(pool, { schema });
}

export { db };
