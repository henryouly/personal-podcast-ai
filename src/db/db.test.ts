import { describe, it, expect } from 'vitest';
import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

describe('Database Integration', () => {
  it('should be able to insert and query a user', async () => {
    const testUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    };

    // Cleanup first
    await db.delete(users).where(eq(users.id, testUser.id));

    // Insert
    await db.insert(users).values(testUser);

    // Query
    const result = await db.query.users.findFirst({
      where: eq(users.id, testUser.id),
    });

    expect(result).toBeDefined();
    expect(result?.email).toBe(testUser.email);
    expect(result?.name).toBe(testUser.name);

    // Cleanup
    await db.delete(users).where(eq(users.id, testUser.id));
  });
});
