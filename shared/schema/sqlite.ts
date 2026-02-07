import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),

  email: text("email"),
  username: text("username"),

  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),

  avatarType: text("avatar_type").notNull().default("default"),
  avatarIcon: text("avatar_icon"),

  provider: text("provider").notNull().default("local"),

  birthDate: text("birth_date"),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const chatSessions = sqliteTable("chat_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  sessionId: text("session_id").notNull(),
  userId: text("user_id"),

  birthDate: text("birth_date"),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  sessionId: text("session_id").notNull(),
  userId: text("user_id"),

  role: text("role").notNull(),
  content: text("content").notNull(),

  metadata: text("metadata"), // JSON string

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const playlists = sqliteTable("playlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  sessionId: text("session_id").notNull(),
  userId: text("user_id"),

  name: text("name").notNull(),
  description: text("description"),

  songs: text("songs").notNull(), // JSON string

  weekStart: text("week_start").notNull(),
  weekEnd: text("week_end").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const astrologicalCharts = sqliteTable("astrological_charts", {
  id: integer("id").primaryKey({ autoIncrement: true }),

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

  planetaryPositions: text("planetary_positions").notNull(), // JSON
  housePositions: text("house_positions"),

  majorAspects: text("major_aspects"),
  interpretation: text("interpretation"),

  svgChart: text("svg_chart"),
  chartInfo: text("chart_info"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const guestRateLimits = sqliteTable("guest_rate_limits", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  email: text("email").notNull(),
  lastPlaylistGenerated: integer("last_playlist_generated", {
    mode: "timestamp",
  }),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export const dailyTransits = sqliteTable("daily_transits", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: text("user_id").notNull(),
  date: text("date").notNull(),

  transitData: text("transit_data").notNull(),
  personalizedAspects: text("personalized_aspects"),
  musicRecommendations: text("music_recommendations"),

  moonPhase: text("moon_phase"),
  moonIllumination: integer("moon_illumination"),
  moonSign: text("moon_sign"),
  lunarAspects: text("lunar_aspects"),

  createdAt: integer("created_at", { mode: "timestamp" })
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
