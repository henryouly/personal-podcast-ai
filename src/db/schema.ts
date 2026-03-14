import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users (BetterAuth + API Keys)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  // BYOK: API Keys stored directly in user profile
  geminiKey: text("gemini_key"),
  openaiKey: text("openai_key"),
  elevenLabsKey: text("elevenlabs_key"),
  rssToken: text("rss_token").unique(),
});

// News Sources
export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(),      // 'rss' | 'html'
  frequency: text("frequency").default("daily"),
  lastCheckedAt: integer("last_checked_at", { mode: "timestamp" }),
});

// Episodes (Generated Content)
export const episodes = sqliteTable("episodes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("source_id").references(() => sources.id),
  title: text("title").notNull(),
  script: text("script"),
  audioUrl: text("audio_url"),
  storageKey: text("storage_key"),
  status: text("status").default("pending"),
  retryCount: integer("retry_count").default(0), // Track retries
  lastError: text("last_error"),                 // Error logs
  createdAt: integer("created_at", { mode: "timestamp" }),
});
