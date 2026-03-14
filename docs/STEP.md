# Phase 1.1: Project Initialization & UI Setup

This step focuses on scaffolding the core Vite application, configuring TypeScript, and setting up the styling engine (TailwindCSS) along with essential UI dependencies.

## Execution Steps

### 1. Scaffold the Vite Project
Initialize the project using the Vite React-TS template.
```bash
pnpm create vite . --template react-ts
```

### 2. Install Core Dependencies
Install the required packages for the UI and basic functionality.
```bash
pnpm install
pnpm add lucide-react clsx tailwind-merge
pnpm add -D tailwindcss postcss autoprefixer
```

### 3. Initialize TailwindCSS
Generate the configuration files and set up the content paths.
- Run `npx tailwindcss init -p`
- Update `tailwind.config.js`:
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  ```

### 4. Configure Global CSS
Include Tailwind directives in your main CSS file.
- Update `src/index.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 5. Project Cleanup
Remove default boilerplate files that aren't needed.
- Delete `src/App.css`.
- Clean up `src/App.tsx` to a minimal "Hello World" state.

### 6. Verification
Ensure the development server starts and Tailwind is working.
- Run `pnpm dev`.
- Verify that a `text-3xl font-bold underline` class applies correctly to a test element.

## Dependencies Breakdown
- **lucide-react**: Icon library.
- **clsx / tailwind-merge**: Utilities for dynamic and conflict-free Tailwind class management.
- **tailwindcss / postcss / autoprefixer**: The core styling engine.

---

# Phase 1.2: Database Setup (Drizzle + SQLite)

This step involves configuring the database layer using Drizzle ORM and SQLite (via the libSQL client for Turso compatibility), and defining the initial schema.

## Execution Steps

### 1. Install Database Dependencies
Install Drizzle ORM, the libSQL client, and environment variable management.
```bash
pnpm add drizzle-orm @libsql/client dotenv
pnpm add -D drizzle-kit
```

### 2. Define the Schema
Create `src/db/schema.ts` and implement the `users`, `sources`, and `episodes` tables as defined in the core reference.
- Use `sqliteTable` from `drizzle-orm/sqlite-core`.
- Ensure proper foreign key relationships (`references`).

### 3. Configure Drizzle
Create `drizzle.config.ts` in the project root to manage migrations and schema location.
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:local.db",
  },
});
```

### 4. Initialize Database Client
Create `src/db/index.ts` to export the database instance.
- Configure it to use `@libsql/client`.
- Support both local SQLite files and remote Turso URLs.

### 5. Setup Environment Variables
Create a `.env` file (and `.env.example`) to store sensitive database credentials.
- `DATABASE_URL="file:local.db"`
- `DATABASE_AUTH_TOKEN=""` (for Turso)

### 6. Generate Migrations
Run the Drizzle Kit generator to verify the schema and prepare for deployment.
```bash
pnpm drizzle-kit generate
```

## Dependencies Breakdown
- **drizzle-orm**: Typesafe ORM for TypeScript.
- **@libsql/client**: High-performance SQLite/Turso client.
- **drizzle-kit**: CLI tool for migration management and schema pushing.

---

# Phase 1.3: Auth Integration (BetterAuth)

This step involves setting up BetterAuth with the Drizzle adapter for secure user management and creating the initial authentication UI.

## Execution Steps

### 1. Install BetterAuth Dependencies
Install the core BetterAuth package and the client-side library.
```bash
pnpm add better-auth
```

### 2. Configure BetterAuth Server
Create `src/lib/auth.ts` to initialize BetterAuth with the Drizzle adapter.
- Configure the `users` table as the base for authentication.
- Set up the SQLite adapter using the `db` instance from `src/db`.

### 3. Initialize BetterAuth Client
Create `src/lib/auth-client.ts` to manage authentication states on the frontend.
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_APP_URL // Ensure this is set in .env
});
```

### 4. Create Auth UI Components
Build basic Login and Signup forms using TailwindCSS and Lucide icons.
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/SignupForm.tsx`

### 5. Setup Routing for Auth
Configure React Router (or a simple state-based toggle for now) to show the Login/Signup views.
- `pnpm add react-router-dom`

### 6. Verification
Ensure the auth client can reach the (future) backend endpoint and that the UI responds to input.

## Dependencies Breakdown
- **better-auth**: Modern authentication library for TypeScript.
- **react-router-dom**: Standard routing for React applications.

---

# Phase 1.4: Testing & Validation (Vitest)

This step involves setting up Vitest to verify the database schema, auth client configuration, and UI component rendering.

## Execution Steps

### 1. Install Testing Dependencies
Install Vitest and React Testing Library utilities.
```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### 2. Configure Vitest
Update `vite.config.ts` to include the test environment configuration.
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
// ... existing imports

export default defineConfig({
  // ... existing config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### 3. Create Test Setup
Create `src/test/setup.ts` to include global test utilities like `jest-dom` matchers.

### 4. Database Integration Test
Create `src/db/db.test.ts` to verify:
- Database connection (local SQLite).
- Table existence and basic CRUD operations via Drizzle.

### 5. UI Component Test
Create `src/components/auth/LoginForm.test.tsx` to verify:
- Component renders correctly.
- Input fields are functional.

### 6. Verification
Run the test suite and ensure all tests pass.
```bash
pnpm vitest run
```

## Dependencies Breakdown
- **vitest**: A native-Vite test runner.
- **jsdom / happy-dom**: Browser environments for Node.js (for UI testing).
- **@testing-library/react**: Utilities for testing React components.

---

# Phase 2: Backend Architecture (tRPC)

This phase involves setting up the typesafe API layer using tRPC and Hono, integrating authentication, and building the core routers.

## Phase 2.1: tRPC Server Setup

### 1. Install tRPC & Hono Dependencies
Install the core tRPC, Hono, and React Query dependencies.
```bash
pnpm add hono @hono/vite-dev-server @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
```

### 2. Define tRPC Context
Create `src/server/context.ts` to manage the tRPC context, including the database instance and authenticated user session.

### 3. Initialize tRPC Server
Create `src/server/trpc.ts` to initialize the tRPC instance and define base procedures (public vs. protected).

### 4. Create Root Router
Create `src/server/routers/_app.ts` as the primary entry point for all sub-routers.

### 5. Setup Hono Server with Vite
Create `src/server/index.ts` to host the tRPC middleware using Hono and configure the Vite dev server to handle API requests.

---

## Phase 2.2: User Router (BYOK)

### 1. Implement User Router
Create `src/server/routers/user.ts` with procedures:
- `updateKeys`: Update Gemini/OpenAI/ElevenLabs keys.
- `getKeyStatus`: Check which keys are configured.

### 2. Integration
Add the user router to the root router in `_app.ts`.

---

## Phase 2.3: Sources & Episodes Routers

### 1. Implement Sources Router
Create `src/server/routers/sources.ts` for CRUD operations on RSS/HTML feeds.

### 2. Implement Episodes Router
Create `src/server/routers/episodes.ts` for listing generated content and manual retries.

## Dependencies Breakdown
- **hono**: Lightweight web framework for the backend.
- **@trpc/server**: Typesafe API server implementation.
- **@trpc/react-query**: React hooks for tRPC via TanStack Query.
- **zod**: Schema validation for API inputs.

---

# Phase 3: The Generation Pipeline

This phase involves building the core logic for fetching news, generating podcast scripts using AI, and synthesizing audio.

## Phase 3.1: Ingestion Engine

### 1. Install Scraping Dependencies
Install the required packages for parsing RSS feeds and scraping HTML.
```bash
pnpm add rss-parser cheerio
```

### 2. Implement Ingestion Service
Create `src/services/ingestion.ts` to handle:
- Fetching and parsing RSS feeds.
- Basic HTML scraping for non-RSS sources.
- Normalizing content into a common format (title, summary, full text).

## Phase 3.2: AI Script Generation (Gemini BYOK)

### 1. Install Google Generative AI SDK
```bash
pnpm add @google/generative-ai
```

### 2. Implement Gemini Service
Create `src/services/ai.ts` to provide an interface for generating scripts.
- Use `GoogleGenerativeAI` with the user's stored key.
- Pass context (list of news articles) to the model `gemini-3.1-flash-lite-preview`.

### 3. Define Prompt Templates
Create prompts that instruct Gemini to transform news articles into a natural, engaging podcast script for a personal narrator.

## Phase 3.3: TTS & Asset Management (Google Cloud TTS)

### 1. Install Google Cloud TTS & Blob SDKs
```bash
pnpm add @google-cloud/text-to-speech @vercel/blob
```

### 2. Implement Audio Synthesis
Create `src/services/audio.ts` to:
- Call Google Cloud TTS API using the user's provided credentials.
- Upload the resulting audio buffer to Vercel Blob storage.
- Update the `episodes` table with the `audioUrl` and `status='done'`.

---

# Phase 4: RSS & Resilience

This phase involves orchestrating the generation pipeline, implementing retry logic, and serving the final podcast XML feed.

## Phase 4.1: Pipeline Orchestration & Resilience

### 1. Implement Pipeline Service
Create `src/services/pipeline.ts` to orchestrate the full flow:
- `processSource(sourceId)`: Fetches news -> Generates script -> Synthesizes audio.
- Updates the `episodes` table at each stage (pending -> done).
- Implements retry logic: If any stage fails, increment `retryCount` and log `lastError`.

### 2. Implement Background Trigger
Add a tRPC procedure `episodes.trigger` to manually start the process for a specific source.

## Phase 4.2: XML Generation (The Podcast Feed)

### 1. Install XML Builder
```bash
pnpm add xmlbuilder2
```

### 2. Implement RSS Feed Router
Create `src/server/routers/rss.ts` (or a dedicated Hono route) to serve the XML feed.
- Endpoint: `GET /api/rss/:token`
- Logic:
    - Validate the `:token` (associated with a user).
    - Fetch all `done` episodes for that user.
    - Build a standard iTunes-compatible XML feed using `xmlbuilder2`.

---

# Phase 5: Dashboard & UX

This phase involves building the frontend components to manage news sources, monitor generation progress, and configure user API keys.

## Phase 5.1: tRPC Client Setup & Hooks

### 1. Initialize tRPC Client
Create `src/lib/trpc.ts` to initialize the tRPC client and React Query hooks.

### 2. Configure Providers
Update `main.tsx` to wrap the application in `QueryClientProvider` and tRPC's `Provider`.

## Phase 5.2: Source Manager UI

### 1. Build Source List & Form
Create `src/components/dashboard/SourceManager.tsx`:
- List existing news sources.
- Form to add new RSS/HTML sources.
- "Delete" functionality.

## Phase 5.3: Episode Feed & Monitoring

### 1. Build Episode Dashboard
Create `src/components/dashboard/EpisodeFeed.tsx`:
- Display a list of episodes with their current status (pending, done, failed).
- "Trigger" button to start a manual update for a source.
- "Retry" button for failed episodes.
- Simple audio player for "done" episodes.

## Phase 5.4: Settings & Keys

### 1. Build Settings Page
Create `src/components/dashboard/Settings.tsx`:
- Form to update Gemini and Google Cloud API keys.
- Display and "Copy" button for the personal RSS feed URL.

## Dependencies Breakdown
- **@trpc/react-query**: React hooks for tRPC.
- **@tanstack/react-query**: Powerful asynchronous state management.
