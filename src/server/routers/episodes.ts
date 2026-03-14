import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { episodes, sources } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const episodesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // We join with sources to ensure we only return episodes for the current user
    return await ctx.db
      .select({
        id: episodes.id,
        title: episodes.title,
        status: episodes.status,
        audioUrl: episodes.audioUrl,
        createdAt: episodes.createdAt,
        sourceName: sources.name,
      })
      .from(episodes)
      .innerJoin(sources, eq(episodes.sourceId, sources.id))
      .where(eq(sources.userId, ctx.user.id))
      .orderBy(desc(episodes.createdAt));
  }),

  retry: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Find the episode and ensure it belongs to the user
      const episode = await ctx.db
        .select({ id: episodes.id })
        .from(episodes)
        .innerJoin(sources, eq(episodes.sourceId, sources.id))
        .where(and(eq(episodes.id, input.id), eq(sources.userId, ctx.user.id)))
        .limit(1);

      if (episode.length === 0) {
        throw new Error("Episode not found or unauthorized");
      }

      await ctx.db
        .update(episodes)
        .set({
          status: "pending",
          retryCount: 0, // Reset for manual retry
          lastError: null,
        })
        .where(eq(episodes.id, input.id));

      return { success: true };
    }),
});
