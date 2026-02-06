import {
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),

  email: text("email"),
  username: text("username"),

  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),

  avatarType: text("avatar_type").notNull().default("default"),
  avatarIcon: text("avatar_icon"),

  provider: text("provider").notNull().default("local"),
  providerId: text("provider_id"),

  birthDate: text("birth_date"),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location"),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),

  sessionId: text("session_id").notNull().unique(),
  userId: text("user_id"),

  birthDate: text("birth_date"),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location"),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),

  sessionId: text("session_id").notNull(),
  userId: text("user_id"),

  role: text("role").notNull(),
  content: text("content").notNull(),

  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),

  sessionId: text("session_id").notNull(),
  userId: text("user_id"),

  name: text("name").notNull(),
  description: text("description"),

  songs: jsonb("songs").notNull(),

  weekStart: text("week_start").notNull(),
  weekEnd: text("week_end").notNull(),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const astrologicalCharts = pgTable("astrological_charts", {
  id: serial("id").primaryKey(),

  userId: text("user_id").notNull(),

  birthDate: text("birth_date").notNull(),
  birthTime: text("birth_time").notNull(),
  birthLocation: text("birth_location").notNull(),

  latitude: text("latitude"),
  longitude: text("longitude"),
  timezone: text("timezone"),

  sunSign: text("sun_sign").notNull(),
  moonSign: text("moon_sign"),
  risingSign: text("rising_sign"),

  planetaryPositions: jsonb("planetary_positions").notNull(),
  housePositions: jsonb("house_positions"),

  majorAspects: jsonb("major_aspects"),
  interpretation: jsonb("interpretation"),

  svgChart: text("svg_chart"),
  chartInfo: jsonb("chart_info"),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const guestRateLimits = pgTable(
  "guest_rate_limits",
  {
    id: serial("id").primaryKey(),

    email: text("email").notNull(),
    lastPlaylistGenerated: timestamp("last_playlist_generated", { mode: "date" }),

    createdAt: timestamp("created_at", { mode: "date" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: index("guest_rate_limits_email_idx").on(table.email),
  })
);
export const dailyTransits = pgTable("daily_transits", {
  id: serial("id").primaryKey(),

  userId: text("user_id").notNull(),
  date: text("date").notNull(),

  transitData: jsonb("transit_data").notNull(),
  personalizedAspects: jsonb("personalized_aspects"),
  musicRecommendations: jsonb("music_recommendations"),

  moonPhase: text("moon_phase"),
  moonIllumination: integer("moon_illumination"),
  moonSign: text("moon_sign"),
  lunarAspects: jsonb("lunar_aspects"),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const userRelations = relations(users, ({ many }) => ({
  chatSessions: many(chatSessions),
  chatMessages: many(chatMessages),
  playlists: many(playlists),
  astrologicalCharts: many(astrologicalCharts),
  dailyTransits: many(dailyTransits),
}));
