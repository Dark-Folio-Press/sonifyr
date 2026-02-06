import { z } from "zod";

/* ─────────────────────────────
   Core shared primitives
   ───────────────────────────── */

export type ID = number;
export type UUID = string;
export type ISODate = string;

/* ─────────────────────────────
   User
   ───────────────────────────── */

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  username: z.string().optional(),

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),

  avatarType: z.enum(["default", "icon", "upload"]).default("default"),
  avatarIcon: z.string().optional(),

  provider: z.enum(["local", "google", "discord"]).default("local"),
  providerId: z.string().optional(),

  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthLocation: z.string().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

/* ─────────────────────────────
   Chat sessions & messages
   ───────────────────────────── */

export const ChatSessionSchema = z.object({
  id: ID.optional(),
  sessionId: z.string(),
  userId: z.string().optional(),

  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthLocation: z.string().optional(),

  createdAt: z.date(),
});

export type ChatSession = z.infer<typeof ChatSessionSchema>;

export const ChatMessageSchema = z.object({
  id: ID.optional(),
  sessionId: z.string(),
  userId: z.string().optional(),

  role: z.enum(["user", "assistant"]),
  content: z.string(),

  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/* ─────────────────────────────
   Playlists
   ───────────────────────────── */

export const SongSchema = z.object({
  title: z.string(),
  artist: z.string(),
  day: z.string(),
  dayOfWeek: z.string(),
  astrologicalInfluence: z.string(),

  spotifyId: z.string().optional(),
  youtubeId: z.string().optional(),
  appleId: z.string().optional(),
  deezerId: z.string().optional(),
});

export type Song = z.infer<typeof SongSchema>;

export const PlaylistSchema = z.object({
  id: ID.optional(),
  sessionId: z.string(),
  userId: z.string().optional(),

  name: z.string(),
  description: z.string().optional(),

  songs: z.array(SongSchema),

  weekStart: z.string(),
  weekEnd: z.string(),

  createdAt: z.date(),
});

export type Playlist = z.infer<typeof PlaylistSchema>;

/* ─────────────────────────────
   Astrology
   ───────────────────────────── */

export const PlanetaryPositionsSchema = z.record(z.number());
export const HousePositionsSchema = z.record(z.number());

export const AstrologicalChartSchema = z.object({
  id: ID.optional(),
  userId: z.string(),

  birthDate: z.string(),
  birthTime: z.string(),
  birthLocation: z.string(),

  latitude: z.string().optional(),
  longitude: z.string().optional(),
  timezone: z.string().optional(),

  sunSign: z.string(),
  moonSign: z.string().optional(),
  risingSign: z.string().optional(),

  planetaryPositions: PlanetaryPositionsSchema,
  housePositions: HousePositionsSchema.optional(),

  majorAspects: z.record(z.any()).optional(),
  interpretation: z.record(z.any()).optional(),

  svgChart: z.string().optional(),
  chartInfo: z.record(z.any()).optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AstrologicalChart = z.infer<typeof AstrologicalChartSchema>;

/* ─────────────────────────────
   Guest rate limits
   ───────────────────────────── */

export const GuestRateLimitSchema = z.object({
  id: ID.optional(),
  email: z.string().email(),
  lastPlaylistGenerated: z.date().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GuestRateLimit = z.infer<typeof GuestRateLimitSchema>;

/* ─────────────────────────────
   Daily transits
   ───────────────────────────── */

export const DailyTransitSchema = z.object({
  id: ID.optional(),
  userId: z.string(),
  date: z.string(),

  transitData: z.record(z.any()),
  personalizedAspects: z.record(z.any()).optional(),
  musicRecommendations: z.record(z.any()).optional(),

  moonPhase: z.string().optional(),
  moonIllumination: z.number().optional(),
  moonSign: z.string().optional(),
  lunarAspects: z.record(z.any()).optional(),

  createdAt: z.date(),
});

export type DailyTransit = z.infer<typeof DailyTransitSchema>;
