# Personal Broadcast System (PAP)

An automated SaaS platform for generating personalized AI podcasts from your favorite news sources.

## Overview

- **Tech Stack**: Vite (React), tRPC, Drizzle ORM, BetterAuth, SQLite (Turso).
- **Core Concept**: BYOK (Bring Your Own Key) SaaS. Users register and provide their own API Keys (Gemini/OpenAI) to trigger AI processing.

## Getting Started

See the [Project Documentation](CORE_REFERENCE.md) for full technical implementation details, including:

- Database Schema (Drizzle ORM)
- API/tRPC Router architecture
- RSS Generation flow

## Environment Setup

To run this application locally, you must create a `.env` file based on `.env.example`.

### Required Variables:

- **`DATABASE_URL`**: E.g., `file:local.db` or a Turso remote URL.
- **`DATABASE_AUTH_TOKEN`**: Required if using a remote Turso database.
- **`BLOB_READ_WRITE_TOKEN`**: Required to upload podcast `.mp3` files to Vercel Blob.
  > **Crucial Note:** When creating the Vercel Blob store, you **must** configure it with **Public** access. If it is Private, podcast players will be denied access to stream the audio files from your generated RSS feed.

## Development Lifecycle

1. **[Prototype Phase]**: Configure Vite + tRPC + Drizzle.
2. **[Pipeline Integration]**: Build backend workers for news-to-audio processing.
3. **[RSS Serving]**: Implement XML endpoint generation.
4. **[UI/UX]**: Build user dashboard for source & API key management.
