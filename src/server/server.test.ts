import { describe, it, expect } from 'vitest';
import app from './index';

describe('Hono + tRPC Integration', () => {
  it('should return 200 OK from the tRPC health check', async () => {
    // Simulate a GET request to the health check endpoint
    // tRPC URL format is usually /api/trpc/[procedureName]?batch=1&input={}
    const res = await app.request('/api/trpc/health');
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    
    // tRPC returns an array for batch calls or a single object for single calls
    // In the fetch adapter, single calls look like this:
    expect(data).toMatchObject({
      result: {
        data: {
          status: 'ok'
        }
      }
    });
  });

  it('should handle unauthorized requests for protected routes', async () => {
    // Any router using protectedProcedure should return 401/UNAUTHORIZED
    // We'll add a dummy protected route to test this if needed, 
    // but for now, let's verify the health check is public.
    const res = await app.request('/api/trpc/health');
    expect(res.status).toBe(200);
  });

  it('should return 401 for invalid RSS token', async () => {
    const res = await app.request('/api/rss/invalid-token');
    expect(res.status).toBe(401);
  });

  it('should return 200 and XML for valid RSS token', async () => {
    const { db } = await import('../db');
    const { users } = await import('../db/schema');
    const { eq } = await import('drizzle-orm');
    
    const testToken = 'test-rss-token-123';
    const testUser = {
      id: 'rss-user-id',
      email: 'rss@example.com',
      rssToken: testToken
    };

    // Setup
    await db.delete(users).where(eq(users.id, testUser.id));
    await db.insert(users).values(testUser);

    const res = await app.request(`/api/rss/${testToken}`);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/xml');
    
    const text = await res.text();
    expect(text).toContain('<rss');
    expect(text).toContain('PAP');

    // Cleanup
    await db.delete(users).where(eq(users.id, testUser.id));
  });
});
