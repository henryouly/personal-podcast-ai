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

## Development Lifecycle

1. **[Prototype Phase]**: Configure Vite + tRPC + Drizzle.
2. **[Pipeline Integration]**: Build backend workers for news-to-audio processing.
3. **[RSS Serving]**: Implement XML endpoint generation.
4. **[UI/UX]**: Build user dashboard for source & API key management.
