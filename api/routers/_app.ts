import { router } from "../trpc.js";
import { episodesRouter } from "./episodes.js";
import { sourcesRouter } from "./sources.js";
import { userRouter } from "./user.js";

export const appRouter = router({
  episodes: episodesRouter,
  sources: sourcesRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
