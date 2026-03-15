import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./_app";
import { db } from "../../db";
import { users, sources, episodes } from "../../db/schema";
import { eq } from "drizzle-orm";

describe("Sources & Episodes Routers", () => {
  const testUserId = `test-user-${Date.now()}`;
  const testUser = {
    id: testUserId,
    email: `${testUserId}@example.com`,
    name: "Content Test User",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Basic cleanup
    await db.delete(users).where(eq(users.id, testUserId));
    await db.insert(users).values(testUser);
  });

  it("should manage sources CRUD", async () => {
    const caller = appRouter.createCaller({
      db,
      user: testUser as any,
      session: {} as any,
    });

    // Add
    const source = await caller.sources.add({
      name: "Test RSS",
      url: "https://example.com/rss",
      type: "rss",
    });

    expect(source.name).toBe("Test RSS");

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
      user: testUser as any,
      session: {} as any,
    });

    // Need a source first for foreign key
    const source = await caller.sources.add({
      name: "Episode Source",
      url: "https://example.com/rss",
      type: "rss",
    });

    // Insert a failed episode manually
    const [episode] = await db
      .insert(episodes)
      .values({
        sourceId: source.id,
        title: "Failed Episode",
        status: "failed",
        lastError: "Something went wrong",
        createdAt: new Date(),
      })
      .returning();

    // List
    const list = await caller.episodes.list();
    expect(list.length).toBe(1);
    expect(list[0].title).toBe("Failed Episode");

    // Retry
    const retry = await caller.episodes.retry({ id: episode.id });
    expect(retry.success).toBe(true);

    // Verify status updated
    const listAfterRetry = await caller.episodes.list();
    expect(listAfterRetry[0].status).toBe("pending");
  });
});
