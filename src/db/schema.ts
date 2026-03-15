import { pgTable, text, integer, timestamp, boolean, serial } from "drizzle-orm/pg-core";

// --- BetterAuth Standard Tables ---

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),

  // --- Custom PAP Fields (BYOK + RSS) ---
  geminiKey: text("gemini_key"),
  openaiKey: text("openai_key"),
  elevenLabsKey: text("elevenlabs_key"),
  rssToken: text("rss_token").unique(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  token: text("token").unique().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }),
});

// --- PAP Application Tables ---

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // 'rss' | 'html'
  frequency: text("frequency").default("daily"),
  lastCheckedAt: timestamp("last_checked_at", { mode: "date" }),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => sources.id),
  title: text("title").notNull(),
  script: text("script"),
  audioUrl: text("audio_url"),
  storageKey: text("storage_key"),
  status: text("status").default("pending"),
  retryCount: integer("retry_count").default(0),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { mode: "date" }),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type Episode = typeof episodes.$inferSelect;
