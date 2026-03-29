import { router, publicProcedure } from "../trpc.js";
import { episodesRouter } from "./episodes.js";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  hello: publicProcedure.query(() => {
    return { message: "hello world" };
  }),
  episodes: episodesRouter,
});

export type AppRouter = typeof appRouter;
