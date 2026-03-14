# Core Reference - Personal Broadcast System (PAP)

## 1. Database Schema (Drizzle ORM)
This schema is designed for SQLite (compatible with Turso/libSQL).

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// User (BetterAuth + API Keys)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  // BYOK: API Keys stored directly in user profile
  geminiKey: text("gemini_key"),
  openaiKey: text("openai_key"),
  elevenLabsKey: text("elevenlabs_key"),
});

// News Sources
export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true}),
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
```

## 2. API Design (tRPC Routers)
- `router.user`: Profile management, API Key updates (`updateKeys`), and key status checks (`getKeyStatus`).
- `router.sources`: Manage RSS/Web sources (CRUD).
- `router.episodes`: Manage generation status, playback, and manual retries.
  - `retryGeneration`: Reset status to 'pending' and increment `retryCount`.

## 3. Resilience & Error Handling
- **Retry Mechanism**: If an LLM/TTS generation task fails, the system increments `retryCount`. 
- **Max Retries**: Limit automatic retries (e.g., 3 attempts). After failure, status becomes `failed` and logs error in `lastError`.
- **User Intervention**: Users can manually re-trigger failed episodes via Dashboard.

## 4. Object Storage & Asset Management
- **Storage Strategy**: Vercel Blob for audio. 
- **Cleanup**: Periodic cron job deletes records (and Blob assets) older than defined retention threshold.

## 5. RSS Generation Logic
- Endpoint: `GET /api/rss/:rssToken`
- Logic: Queries `episodes` table for `status='done'`.
