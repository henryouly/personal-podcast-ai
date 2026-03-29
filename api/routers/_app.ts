import { router, publicProcedure } from "../trpc.js";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  hello: publicProcedure.query(() => {
    return { message: "hello world" };
  }),
});

export type AppRouter = typeof appRouter;
