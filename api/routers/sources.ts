import { z } from "zod";
import { router, protectedProcedure } from "../trpc.js";
import { sources } from "../../src/db/schema.js";
import { eq, and } from "drizzle-orm";

export const sourcesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.sources.findMany({
      where: eq(sources.userId, ctx.user.id),
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        url: z.string().url(),
        type: z.enum(["rss", "html"]),
        frequency: z.enum(["daily", "weekly"]).default("daily"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newSource] = await ctx.db
        .insert(sources)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();
      return newSource;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(sources)
        .where(and(eq(sources.id, input.id), eq(sources.userId, ctx.user.id)));
      return { success: true };
    }),
});
