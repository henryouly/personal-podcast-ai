import { db } from "../db";
import { episodes, sources, users } from "../db/schema";
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
    if (!user.elevenLabsKey) throw new Error("Google Cloud (stored as elevenlabs_key temporarily) API Key is missing.");

    // Note: Core reference used elevenlabs_key, but we transitioned to Google Cloud TTS.
    // I will use elevenLabsKey as the storage for the Google Cloud API Key for now to stay compatible with schema.

    // 2. Create a pending episode record
    const [episode] = await db.insert(episodes).values({
      sourceId: source.id,
      title: `Update: ${source.name} (${new Date().toLocaleDateString()})`,
      status: "pending",
      createdAt: new Date(),
    }).returning();

    // 3. Start async processing
    // In a real production app, this would be a background job (BullMQ, Vercel Cron, etc.)
    // For this prototype, we'll run it and catch errors.
    this.runPipeline(episode.id, source, user).catch(console.error);

    return episode;
  },

  async runPipeline(episodeId: number, source: any, user: any) {
    try {
      // 1. Ingest
      const articles = await ingestionService.fetchRSS(source.url);
      if (articles.length === 0) throw new Error("No articles found in feed");

      // 2. AI Script
      const script = await aiService.generatePodcastScript(user.geminiKey, articles.slice(0, 5));
      
      await db.update(episodes)
        .set({ script })
        .where(eq(episodes.id, episodeId));

      // 3. Audio Synthesis
      // Using user.elevenLabsKey as the placeholder for Google Cloud API Key per user's earlier schema
      const { audioUrl, storageKey } = await audioService.synthesizeAndUpload(
        user.elevenLabsKey, 
        script,
        episodeId
      );

      // 4. Finalize
      await db.update(episodes)
        .set({
          status: "done",
          audioUrl,
          storageKey,
        })
        .where(eq(episodes.id, episodeId));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown pipeline error";
      console.error(`Pipeline failed for episode ${episodeId}:`, errorMessage);

      await db.update(episodes)
        .set({
          status: "failed",
          lastError: errorMessage,
        })
        .where(eq(episodes.id, episodeId));
    }
  }
};
