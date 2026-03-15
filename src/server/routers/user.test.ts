import { describe, it, expect } from 'vitest';
import { appRouter } from './_app';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

describe('User Router', () => {
  it('should fail if unauthorized user tries to access updateKeys', async () => {
    // Create a caller with no context (simulating unauthenticated)
    const caller = appRouter.createCaller({
      db,
      user: null,
      session: null,
    });

    await expect(caller.user.updateKeys({
      geminiKey: 'test-key'
    })).rejects.toThrow(/UNAUTHORIZED/);
  });

  it('should successfully update keys for an authorized user', async () => {
    const testUserId = 'test-user-id-user-router';
    const testUser = {
      id: testUserId,
      email: 'user-router@example.com',
      name: 'User Router Test',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Setup user
    await db.delete(users).where(eq(users.id, testUserId));
    await db.insert(users).values(testUser);

    const caller = appRouter.createCaller({
      db,
      user: testUser as any,
      session: {} as any,
    });

    const updateResult = await caller.user.updateKeys({
      geminiKey: 'new-gemini-key',
    });

    expect(updateResult.success).toBe(true);

    const status = await caller.user.getKeyStatus();
    expect(status.gemini).toBe(true);
    expect(status.openai).toBe(false);

    // Cleanup
    await db.delete(users).where(eq(users.id, testUserId));
  });
});
