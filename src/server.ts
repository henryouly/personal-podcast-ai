import { Hono } from "hono";

const app = new Hono();

// Test hello endpoint
app.get("/api/hello", (c) => c.json({ message: "hello world" }));

export default app;
