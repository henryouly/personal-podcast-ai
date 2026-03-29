import { router, publicProcedure } from "../trpc.js";
import { episodesRouter } from "./episodes.js";
import { sourcesRouter } from "./sources.js";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  hello: publicProcedure.query(() => {
    return { message: "hello world" };
  }),
  episodes: episodesRouter,
  sources: sourcesRouter,
});

export type AppRouter = typeof appRouter;
