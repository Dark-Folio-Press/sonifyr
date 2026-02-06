import { db } from "./index";
import { sql } from "drizzle-orm";

if (process.env.NODE_ENV === "production") {
  throw new Error("❌ Seeding is disabled in production");
}

async function seed() {
  console.log("🌱 Seeding local SQLite database...");

  // Clear existing demo data (safe in dev)
  await db.execute(sql`
    DELETE FROM guest_rate_limits;
  `);

   // ✅ PORTABLE INSERT demo rows
  const now = new Date();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);


  await db.execute(sql`
    INSERT INTO guest_rate_limits (email, last_playlist_generated)
    VALUES
      ('demo@sonifyr.local', ${now}),
      ('guest@sonifyr.local', ${oneHourAgo});
  `);

  console.log("✅ Seed complete!");
}

seed()
  .then(() => {
    console.log("🌱 Seed finished successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
