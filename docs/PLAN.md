# Project Implementation Plan - Personal Broadcast System (PAP)

This document outlines the step-by-step roadmap for building the PAP platform, an automated SaaS for generating personalized AI podcasts.

## 1. Technical Stack

### Core Frameworks & Libraries
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Frontend & Tooling**: [Vite](https://vitejs.dev/) (React + TypeScript)
- **API Layer**: [tRPC](https://trpc.io/) (End-to-end typesafe APIs)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [BetterAuth](https://better-auth.com/) (with SQLite adapter)

### Database & Storage
- **ORM**: [Drizzle-ORM](https://orm.drizzle.team/)
- **Database**: [SQLite](https://sqlite.org/) (via [Turso/libSQL](https://turso.tech/) for production-ready serverless SQLite)
- **Object Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (for audio assets)

### AI & Processing
- **LLMs**: Gemini 1.5 Pro / OpenAI GPT-4o (User-provided keys)
- **TTS**: ElevenLabs (User-provided keys)
- **Scraping**: RSS Parser + Fetch API

---

## 2. Implementation Phases

### Phase 1: Foundation & Scaffolding
- **1.1. Project Init**: Scaffold Vite project with TypeScript and TailwindCSS.
- **1.2. Database Setup**:
    - Configure Drizzle with SQLite.
    - Implement `users`, `sources`, and `episodes` schemas.
    - Set up migration scripts (`drizzle-kit`).
- **1.3. Auth Integration**:
    - Initialize BetterAuth.
    - Build basic Login/Sign-up pages using Tailwind and Lucide.

### Phase 2: Backend Architecture (tRPC)
- **2.1. tRPC Server**: Set up the tRPC router and context (integrating auth).
- **2.2. User Router**: Implement `updateKeys` and `getKeyStatus` for BYOK management.
- **2.3. Sources Router**: CRUD operations for news feeds (RSS/HTML).
- **2.4. Episodes Router**: Status tracking and manual retry logic.

### Phase 3: The Generation Pipeline
- **3.1. Ingestion Engine**: Service to poll RSS feeds and extract content.
- **3.2. Script Generation**: 
    - Create a wrapper for Gemini/OpenAI that uses the `user_id`'s stored keys.
    - Implement prompt templates for podcast-style narration.
- **3.3. Audio Synthesis**: 
    - Integrate ElevenLabs TTS.
    - Implement Vercel Blob upload logic and store URLs in the `episodes` table.

### Phase 4: RSS & Resilience
- **4.1. Resilience Logic**: 
    - Implement the `retry_count` and `last_error` tracking.
    - Set up a background worker (or Vercel Cron) to trigger pending jobs.
- **4.2. XML Generation**: 
    - Implement the `/api/rss/:token` endpoint to serve standard iTunes-compatible podcast feeds.

### Phase 5: Dashboard & UX
- **5.1. Source Manager**: UI to add/validate RSS feeds and scrape targets.
- **5.2. Episode Feed**: A real-time dashboard showing generation progress and audio playback.
- **5.3. Settings & Keys**: Secure UI for managing API keys and preferences.

---

## 3. Development Standards
- **Strict Typing**: No `any` types; leverage tRPC for full-stack type safety.
- **Error Handling**: Use the `last_error` column in the database to provide user-facing feedback for failed AI generations.
- **Atomic Commits**: Small, verified changes following the phase structure.
