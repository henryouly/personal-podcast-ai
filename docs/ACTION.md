# Action Log - Phase 1.1: Project Initialization & UI Setup

## [2026-03-14] Starting Phase 1.1

**Goal**: Initialize the Vite project, set up TailwindCSS, and prepare the foundation.

### Status Update

- [x] 1. Scaffold the Vite Project (using pnpm)
- [x] 2. Install Core Dependencies (lucide-react, clsx, tailwind-merge, tailwindcss v4)
- [x] 3. Initialize TailwindCSS (PostCSS configuration)
- [x] 4. Configure Global CSS
- [x] 5. Project Cleanup
- [x] 6. Verification (Successful build with Vite 5)

### Notes

- Encountered Node.js version conflict with Vite 8 (Node 22.11.0 vs required 22.12+).
- Downgraded Vite to v5.4.21 for compatibility.
- Configured Tailwind 4 via `@tailwindcss/postcss`.

---

## [2026-03-14] Starting Phase 1.2

**Goal**: Configure Drizzle ORM, define the SQLite schema, and set up migration workflows.

### Status Update

- [x] 1. Install Database Dependencies (drizzle-orm, @libsql/client, drizzle-kit)
- [x] 2. Define the Schema (src/db/schema.ts)
- [x] 3. Configure Drizzle (drizzle.config.ts)
- [x] 4. Initialize Database Client (src/db/index.ts)
- [x] 5. Setup Environment Variables (.env)
- [x] 6. Generate Migrations (Successfully generated drizzle/0000_left_turbo.sql)

---

## [2026-03-14] Starting Phase 1.3

**Goal**: Integrate BetterAuth with the Drizzle schema and build the initial authentication UI.

### Status Update

- [x] 1. Install BetterAuth & Router Dependencies (better-auth, react-router-dom)
- [x] 2. Configure BetterAuth Server (src/lib/auth.ts)
- [x] 3. Initialize BetterAuth Client (src/lib/auth-client.ts)
- [x] 4. Create Auth UI Components (LoginForm, SignupForm with Tailwind/Lucide)
- [x] 5. Setup Basic Routing (Integrated React Router in App.tsx)
- [x] 6. Verification (Manual UI check and routing validation)

### Notes

- Configured BetterAuth to use the Drizzle adapter with the SQLite `users` table.
- Added `BETTER_AUTH_SECRET` and `VITE_APP_URL` to `.env`.
- Implemented responsive Login/Signup forms with loading states.

---

## [2026-03-14] Starting Phase 1.4

**Goal**: Set up Vitest and write initial tests for the database schema and authentication UI.

### Status Update

- [x] 1. Install Testing Dependencies (vitest v1, happy-dom, react-testing-library)
- [x] 2. Configure Vitest (vite.config.ts with happy-dom)
- [x] 3. Create Test Setup (src/test/setup.ts)
- [x] 4. Database Integration Test (src/db/db.test.ts - Verified CRUD)
- [x] 5. Component Testing (LoginForm.test.tsx - Verified rendering and inputs)
- [x] 6. Verification (All tests passing)

### Notes

- Successfully upgraded to Vite 7.3.1 and Vitest 4.0.18 using `@vitejs/plugin-react@5.1.4`.
- Integrated `@tailwindcss/vite@4.2.1` for native Tailwind v4 support in Vite.
- All tests passing with `happy-dom` and current Node.js 22.11.0.

---

## [2026-03-14] Starting Phase 2.1

**Goal**: Set up the tRPC server with Hono and define the core API architecture.

### Status Update

- [x] 1. Install tRPC & Hono Dependencies (hono, @trpc/server, zod, etc.)
- [x] 2. Define tRPC Context (src/server/context.ts - includes DB & Auth)
- [x] 3. Initialize tRPC Server (src/server/trpc.ts - public/protected procedures)
- [x] 4. Create Root Router (src/server/routers/\_app.ts)
- [x] 5. Setup Hono Server with Vite (src/server/index.ts & vite.config.ts)
- [x] 6. Verification (Successful build and typesafe backend scaffolding)

### Notes

- Integrated `better-auth` handler and tRPC middleware into a single Hono instance.
- Configured `@hono/vite-dev-server` to proxy `/api/*` requests to the Hono entry point.

---

## [2026-03-14] Starting Phase 2.2

**Goal**: Implement the User router for BYOK (Bring Your Own Key) management.

### Status Update

- [x] 1. Implement User Router (src/server/routers/user.ts)
- [x] 2. Integrate User Router into Root Router (src/server/routers/\_app.ts)
- [x] 3. Verification (Successfully tested updateKeys and getKeyStatus procedures)

---

## [2026-03-14] Starting Phase 2.3

**Goal**: Implement the Sources and Episodes routers for managing news feeds and generated content.

### Status Update

- [x] 1. Implement Sources Router (src/server/routers/sources.ts - List, Add, Delete)
- [x] 2. Implement Episodes Router (src/server/routers/episodes.ts - List, Retry)
- [x] 3. Integrate Routers into Root Router (src/server/routers/\_app.ts)
- [x] 4. Verification (Unit Tests verified CRUD and authorization)

### Notes

- Sources and Episodes are filtered by `userId` to ensure data isolation.
- Implemented `retry` procedure to reset episode status to `pending`.

---

## [2026-03-14] Starting Phase 3.1

**Goal**: Build the ingestion service to fetch and normalize content from news sources.

### Status Update

- [x] 1. Install Scraping Dependencies (rss-parser, cheerio)
- [x] 2. Implement Ingestion Service (src/services/ingestion.ts)
- [x] 3. Verification (Unit Tests passing with mocked Parser)

### Notes

- Implemented `NormalizedArticle` interface for consistent data structure.
- Included heuristics for HTML scraping as a fallback/alternative to RSS.
- Configured Vitest to correctly mock the `rss-parser` class constructor.

---

## [2026-03-14] Starting Phase 3.2

**Goal**: Integrate gemini-3.1-flash-lite-preview to generate podcast scripts from news content.

### Status Update

- [x] 1. Install Google Generative AI SDK
- [x] 2. Implement Gemini Service (src/services/ai.ts)
- [x] 3. Define Podcast Prompt Template
- [x] 4. Verification (Unit Test with mocked Gemini response)

### Notes

- Standardized on `gemini-3.1-flash-lite-preview` per latest requirements.
- Completed unit tests for AI script generation.

---

## [2026-03-14] Starting Phase 3.3

**Goal**: Integrate Google Cloud TTS and Vercel Blob storage for audio synthesis and management.

### Status Update

- [x] 1. Install Google Cloud TTS & Vercel Blob SDKs
- [x] 2. Implement Audio Service (src/services/audio.ts)
- [x] 3. Verification (Unit Tests verified synthesis and upload)

### Notes

- Implemented high-quality `en-US-Neural2-D` voice as default.
- Integrated Vercel Blob for persistent storage of `.mp3` assets.
- Confirmed BYOK support by passing the API key to the `TextToSpeechClient` constructor.

---

## [2026-03-14] Starting Phase 4.1 & 4.2

**Goal**: Orchestrate the generation pipeline and implement the RSS feed endpoint.

### Status Update

- [x] 1. Implement Pipeline Service (src/services/pipeline.ts)
- [x] 2. Add `episodes.trigger` tRPC procedure
- [x] 3. Install xmlbuilder2
- [x] 4. Implement RSS XML Endpoint (GET /api/rss/:token)
- [x] 5. Verification (Integration Tests verified RSS serving and 401 handling)

### Notes

- Orchestrated the full ingestion-to-audio flow in `pipelineService`.
- Added `rssToken` to the `users` table to allow secure, non-authenticated access by podcast players.
- Verified that `trigger` manually starts the background processing.

---

## [2026-03-14] Starting Phase 5

**Goal**: Build the frontend dashboard for source management, episode monitoring, and settings.

### Status Update

- [x] 1. Initialize tRPC Client & Providers (src/lib/trpc.ts, src/main.tsx)
- [x] 2. Build Source Manager UI (src/components/dashboard/SourceManager.tsx)
- [x] 3. Build Episode Feed & Monitoring (src/components/dashboard/EpisodeFeed.tsx)
- [x] 4. Build Settings & Keys UI (src/components/dashboard/Settings.tsx)
- [x] 5. Verification (Successful build and UI structure implemented)

### Notes

- Integrated a comprehensive `DashboardLayout` with sidebar navigation.
- Implemented real-time polling in `EpisodeFeed` for pending generations.
- Fixed several TypeScript errors related to unused imports and nullable database fields.
- Resolved `SQLITE_BUSY` test failures by disabling `fileParallelism` in Vitest.
- All 16 tests across 8 files are passing.

---

## [2026-03-15] Starting Phase 6: Polish, Tooling & Bug Fixes

**Goal**: Refine the UI, fix environment and build issues, and enforce codebase formatting.

### Status Update

- [x] 1. Landing Page Redesign (Added modern gradients and refined typography in `App.tsx`)
- [x] 2. Tailwind v4 Fix (Updated `src/index.css` to use `@import "tailwindcss";`)
- [x] 3. Vercel Blob Environment Fix (Added `BLOB_READ_WRITE_TOKEN` to `.env.example` and `.env`)
- [x] 4. Dev Server Performance Fix (Moved `dotenv/config` from `server/index.ts` to `vite.config.ts` to prevent HMR slowdowns)
- [x] 5. Vercel Blob Access Rights (Confirmed public access is required for RSS feeds to work with podcast clients)
- [x] 6. Settings UI Fix (Updated `getKeyStatus` API to return `rssToken` and display the actual feed URL in the dashboard)
- [x] 7. Code Formatter Setup (Installed Prettier and `eslint-config-prettier`, created `.prettierrc` and `.prettierignore`)
- [x] 8. Codebase Linting (Resolved 12 ESLint errors including unused variables, implicit any types, and React Refresh component exports)

### Notes

- Resolved an issue where RSS feeds and HTML fetch operations were being rate-limited (429 errors), although User-Agent overrides were later reverted to prioritize standard fetching unless strictly necessary.
- Improved TypeScript strictness by exporting and using proper schema types (`User`, `Source`, `Episode`) instead of `any` across the tRPC routers and tests.
