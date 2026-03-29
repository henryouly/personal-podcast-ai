import { describe, it, expect } from "vitest";
import { appRouter } from "./_app.js";
import { db } from "../../src/db/index.js";
import { users, type User, type Session } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";

describe("User Router (API)", () => {
  it("should fail if unauthorized user tries to access updateKeys", async () => {
    // Create a caller with no context (simulating unauthenticated)
    const caller = appRouter.createCaller({
      db,
      user: null,
      session: null,
    });

    await expect(
      caller.user.updateKeys({
        geminiKey: "test-key",
      })
    ).rejects.toThrow(/UNAUTHORIZED/);
  });

  it("should successfully update keys for an authorized user", async () => {
    const testUserId = "test-user-id-api-user-router";
    const testUser = {
      id: testUserId,
      email: "user-router-api@example.com",
      name: "User Router API Test",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Setup user
    await db.delete(users).where(eq(users.id, testUserId));
    await db.insert(users).values(testUser);

    const caller = appRouter.createCaller({
      db,
      user: testUser as unknown as User,
      session: {} as unknown as Session,
    });

    const updateResult = await caller.user.updateKeys({
      geminiKey: "new-gemini-key-api",
    });

    expect(updateResult.success).toBe(true);

    const status = await caller.user.getKeyStatus();
    expect(status.gemini).toBe(true);
    expect(status.openai).toBe(false);

    // Cleanup
    await db.delete(users).where(eq(users.id, testUserId));
  });
});
