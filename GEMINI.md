# Gemini CLI Context

## Project Guidelines

*   **Language**: All code must be written in TypeScript.
*   **Style**: Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) strictly.
*   **Immutability**: Prioritize immutability in all data structures to ensure predictable state management.
*   **Documentation**: Ensure all functions and exported symbols are thoroughly documented with JSDoc comments.
*   **Module Resolution**: The project uses `NodeNext`/`Node16` resolution. All relative imports **MUST** include explicit `.js` extensions (e.g., `import { foo } from "./bar.js"`).

## Architectural Architecture (Vercel Deployment)

*   **Backend Location**: All server-side logic (Hono, tRPC Routers, Auth) resides in the `api/` directory. This is mandatory for Vercel to correctly identify and build Serverless Functions.
*   **Frontend Location**: React components, client-side hooks, and UI logic reside in `src/`.
*   **Shared Logic**: Common utilities, services (AI, Audio, Ingestion), and Database schemas reside in `src/services/` and `src/db/`.
*   **tRPC Client**: The tRPC React Query client resides in `src/lib/trpc.ts` but imports its types from `api/routers/_app.js`.
*   **Build Pipeline**: The production build consists of `tsc -b` (type checking) followed by `vite build`.

## Tone and Style

*   **Professionalism**: Maintain a professional and concise tone at all times.
*   **Clarity**: Avoid informal language, fluff, or excessive emojis.
*   **Actionable**: Focus on providing clear, actionable code blocks and technical explanations.
