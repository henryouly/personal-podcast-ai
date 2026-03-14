import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { episodes, sources } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { pipelineService } from "../../services/pipeline";

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

  trigger: protectedProcedure
    .input(z.object({ sourceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await pipelineService.processSource(input.sourceId, ctx.user.id);
    }),

  retry: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Find the episode and ensure it belongs to the user
      const episode = await ctx.db
        .select({ id: episodes.id, sourceId: episodes.sourceId })
        .from(episodes)
        .innerJoin(sources, eq(episodes.sourceId, sources.id))
        .where(and(eq(episodes.id, input.id), eq(sources.userId, ctx.user.id)))
        .limit(1);

      if (episode.length === 0) {
        throw new Error("Episode not found or unauthorized");
      }

      // Reset record
      await ctx.db
        .update(episodes)
        .set({
          status: "pending",
          retryCount: 0,
          lastError: null,
        })
        .where(eq(episodes.id, input.id));

      // Re-trigger pipeline
      // Fetch source and user again inside runPipeline via pipelineService would be better
      // But for simplicity we'll just re-trigger the source processing if needed, 
      // or just re-run the pipeline logic.
      
      const source = await ctx.db.query.sources.findFirst({
        where: eq(sources.id, episode[0].sourceId)
      });
      
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id)
      });

      pipelineService.runPipeline(input.id, source, user).catch(console.error);

      return { success: true };
    }),
});
