import { router, publicProcedure } from "../trpc";
import { userRouter } from "./user";
import { sourcesRouter } from "./sources";
import { episodesRouter } from "./episodes";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  user: userRouter,
  sources: sourcesRouter,
  episodes: episodesRouter,
});

export type AppRouter = typeof appRouter;
