import { db } from "../db";
import { episodes, sources, users, type User, type Source } from "../db/schema";
import { eq } from "drizzle-orm";
import { ingestionService } from "./ingestion";
import { aiService } from "./ai";
import { audioService } from "./audio";

export const pipelineService = {
  /**
   * Orchestrates the full news-to-audio pipeline for a given source.
   */
  async processSource(sourceId: number, userId: string) {
    // 1. Fetch source and user (for keys)
    const source = await db.query.sources.findFirst({
      where: eq(sources.id, sourceId),
    });

    if (!source || source.userId !== userId) {
      throw new Error("Source not found or unauthorized");
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) throw new Error("User not found");
    if (!user.geminiKey) throw new Error("Gemini API Key is missing. Please update your settings.");

    // 2. Create a pending episode record
    const [episode] = await db
      .insert(episodes)
      .values({
        sourceId: source.id,
        title: `Update: ${source.name} (${new Date().toLocaleDateString()})`,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    // 3. Start async processing
    // In a real production app, this would be a background job (BullMQ, Vercel Cron, etc.)
    // For this prototype, we'll run it and catch errors.
    this.runPipeline(episode.id, source, user).catch(console.error);

    return episode;
  },

  async runPipeline(episodeId: number, source: Source, user: User) {
    try {
      // 1. Ingest
      const articles = await ingestionService.fetchRSS(source.url);
      if (articles.length === 0) throw new Error("No articles found in feed");

      // 2. AI Script
      const script = await aiService.generatePodcastScript(
        user.geminiKey as string,
        articles.slice(0, 5),
        user.podcastLanguage || "English"
      );

      await db.update(episodes).set({ script }).where(eq(episodes.id, episodeId));

      // 3. Audio Synthesis
      const { audioUrl, storageKey } = await audioService.synthesizeAndUpload(
        script,
        episodeId,
        user.podcastLanguage || "English"
      );

      // 4. Finalize
      await db
        .update(episodes)
        .set({
          status: "done",
          audioUrl,
          storageKey,
        })
        .where(eq(episodes.id, episodeId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown pipeline error";
      console.error(`Pipeline failed for episode ${episodeId}:`, errorMessage);

      await db
        .update(episodes)
        .set({
          status: "failed",
          lastError: errorMessage,
        })
        .where(eq(episodes.id, episodeId));
    }
  },
};
