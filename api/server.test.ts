import { describe, it, expect } from "vitest";
import app from "./index.js";

describe("Hono + tRPC Integration (API)", () => {
  it("should return 401 for unauthorized tRPC requests", async () => {
    // Testing a real procedure to ensure tRPC is mounted correctly at /api/trpc
    const res = await app.request("/api/trpc/user.getKeyStatus");
    expect(res.status).toBe(401); 
    const data = await res.json();
    // In tRPC 11, the error might be directly under data.error or data[0].error if batched
    expect(JSON.stringify(data)).toContain("UNAUTHORIZED");
  });

  it("should reach the Auth handler", async () => {
    const res = await app.request("/api/auth/get-session");
    // better-auth returns 200 with null or session object
    expect(res.status).toBe(200);
  });

  it("should return 401 for invalid RSS token", async () => {
    const res = await app.request("/api/rss/invalid-token");
    expect(res.status).toBe(401);
  });

  it("should return 200 and XML for valid RSS token", async () => {
    const { db } = await import("../src/db/index.js");
    const { users } = await import("../src/db/schema.js");
    const { eq } = await import("drizzle-orm");

    const testToken = "test-rss-token-api-test";
    const testUser = {
      id: "rss-user-id-api",
      email: "rss-api@example.com",
      name: "RSS User API",
      rssToken: testToken,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Setup
    await db.delete(users).where(eq(users.id, testUser.id));
    await db.insert(users).values(testUser);

    const res = await app.request(`/api/rss/${testToken}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/xml");

    const text = await res.text();
    expect(text).toContain("<rss");
    expect(text).toContain("PAP");

    // Cleanup
    await db.delete(users).where(eq(users.id, testUser.id));
  });
});
