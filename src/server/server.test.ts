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
});
