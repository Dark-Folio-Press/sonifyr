import { db } from "./index";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding local SQLite database...");

  // Clear existing demo data (safe in dev)
  await db.execute(sql`
    DELETE FROM guest_rate_limits;
  `);

  // Insert demo rows
  await db.execute(sql`
    INSERT INTO guest_rate_limits (email, last_playlist_generated)
    VALUES
      ('demo@sonifyr.local', now()),
      ('guest@sonifyr.local', now() - interval '1 hour');
  `);

  console.log("✅ Seed complete!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
