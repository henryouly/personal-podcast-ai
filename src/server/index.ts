import { Hono } from "hono";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./routers/_app";
import { createContext } from "./context";
import { auth } from "../lib/auth";
import { rssService } from "../services/rss";

const app = new Hono();

// Auth base path
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// RSS Feed path
app.get("/api/rss/:token", async (c) => {
  const token = c.req.param("token");
  try {
    const xml = await rssService.generateFeed(token);
    return c.text(xml, 200, {
      "Content-Type": "application/xml",
    });
  } catch (error) {
    console.error("RSS Feed Generation Error:", error);
    return c.text("Unauthorized or Invalid Token", 401);
  }
});

// tRPC API path
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => createContext(c),
  });
});

export default app;
