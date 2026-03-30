import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./_app.js";
import { db } from "../../src/db/index.js";
import { users, episodes, sources, type User, type Session } from "../../src/db/schema.js";
import { eq, inArray } from "drizzle-orm";

describe("Sources & Episodes Routers (API)", () => {
  const testUserId = `test-user-api-${Date.now()}`;
  const testUser = {
    id: testUserId,
    email: `${testUserId}@example.com`,
    name: "Content Test User API",
    geminiKey: "dummy-key",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Basic cleanup in reverse order of foreign keys
    const userSources = await db
      .select({ id: sources.id })
      .from(sources)
      .where(eq(sources.userId, testUserId));
    if (userSources.length > 0) {
      const sourceIds = userSources.map((s) => s.id);
      await db.delete(episodes).where(inArray(episodes.sourceId, sourceIds));
      await db.delete(sources).where(eq(sources.userId, testUserId));
    }
    await db.delete(users).where(eq(users.id, testUserId));
    await db.insert(users).values(testUser);
  });

  it("should manage sources CRUD", async () => {
    const caller = appRouter.createCaller({
      db,
      user: testUser as unknown as User,
      session: {} as unknown as Session,
    });

    // Add
    const source = await caller.sources.add({
      name: "Test RSS API",
      url: "https://example.com/rss",
      type: "rss",
    });

    expect(source.name).toBe("Test RSS API");

    // List
    const list = await caller.sources.list();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(source.id);

    // Delete
    await caller.sources.delete({ id: source.id });
    const listAfterDelete = await caller.sources.list();
    expect(listAfterDelete.length).toBe(0);
  });

  it("should list and retry episodes", async () => {
    const caller = appRouter.createCaller({
      db,
      user: testUser as unknown as User,
      session: {} as unknown as Session,
    });

    // Need a source first for foreign key
    const source = await caller.sources.add({
      name: "Episode Source API",
      url: "https://example.com/rss",
      type: "rss",
    });

    // Insert a failed episode manually
    const [episode] = await db
      .insert(episodes)
      .values({
        sourceId: source.id,
        title: "Failed Episode API",
        status: "failed",
        lastError: "Something went wrong",
        createdAt: new Date(),
      })
      .returning();

    // List
    const list = await caller.episodes.list();
    expect(list.length).toBe(1);
    expect(list[0].title).toBe("Failed Episode API");

    // Retry
    const retry = await caller.episodes.retry({ id: episode.id });
    expect(retry.success).toBe(true);

    // Verify status updated
    const listAfterRetry = await caller.episodes.list();
    expect(listAfterRetry[0].status).toBe("pending");
  });

  it("should trigger pipeline for a source", async () => {
    const caller = appRouter.createCaller({
      db,
      user: testUser as unknown as User,
      session: {} as unknown as Session,
    });

    const source = await caller.sources.add({
      name: "Trigger Source API",
      url: "https://example.com/rss",
      type: "rss",
    });

    // We don't want to actually run the whole AI pipeline in tests,
    // but we can verify the trigger creates the episode record.
    const result = await caller.episodes.trigger({ sourceId: source.id });
    expect(result.id).toBeDefined();
    expect(result.status).toBe("pending");
    expect(result.sourceId).toBe(source.id);

    const list = await caller.episodes.list();
    expect(list.some((e) => e.id === result.id)).toBe(true);
  });
});
