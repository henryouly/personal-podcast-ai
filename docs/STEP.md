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
- **jsdom**: A browser environment for Node.js (for UI testing).
- **@testing-library/react**: Utilities for testing React components.
