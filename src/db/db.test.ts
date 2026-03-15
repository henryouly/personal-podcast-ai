import { describe, it, expect } from 'vitest';
import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

describe('Database Integration', () => {
  it('should be able to insert and query a user', async () => {
    const testUserId = `test-user-${Date.now()}`;
    const testUser = {
      id: testUserId,
      email: `${testUserId}@example.com`,
      name: 'Test User',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert
    await db.insert(users).values(testUser);

    // Query
    const result = await db.query.users.findFirst({
      where: eq(users.id, testUserId),
    });

    expect(result).toBeDefined();
    expect(result?.email).toBe(testUser.email);
    expect(result?.name).toBe(testUser.name);

    // Cleanup
    await db.delete(users).where(eq(users.id, testUserId));
  });
});
