import { Hono } from "hono";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./routers/_app";
import { createContext } from "./context";
import { auth } from "../lib/auth";

const app = new Hono();

// Auth base path
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// tRPC API path
app.use(
    "/api/trpc/*",
    async (c) => {
        return fetchRequestHandler({
            endpoint: "/api/trpc",
            req: c.req.raw,
            router: appRouter,
            createContext: () => createContext(c),
        });
    }
);

export default app;
