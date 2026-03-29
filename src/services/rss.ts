import { create } from "xmlbuilder2";
import { db } from "../db/index.js";
import { episodes, sources, users } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";

export const rssService = {
  /**
   * Generates a standard iTunes-compatible RSS feed for a user's episodes.
   */
  async generateFeed(rssToken: string) {
    // 1. Find user by token
    const user = await db.query.users.findFirst({
      where: eq(users.rssToken, rssToken),
    });

    if (!user) throw new Error("Invalid RSS Token");

    // 2. Fetch all 'done' episodes for this user
    const userEpisodes = await db
      .select({
        id: episodes.id,
        title: episodes.title,
        audioUrl: episodes.audioUrl,
        createdAt: episodes.createdAt,
        sourceName: sources.name,
      })
      .from(episodes)
      .innerJoin(sources, eq(episodes.sourceId, sources.id))
      .where(and(eq(sources.userId, user.id), eq(episodes.status, "done")))
      .orderBy(desc(episodes.createdAt));

    // 3. Build XML
    const feedObject = {
      rss: {
        "@version": "2.0",
        "@xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
        "@xmlns:content": "http://purl.org/rss/1.0/modules/content/",
        channel: {
          title: `PAP - ${user.name || user.email}'s Broadcast`,
          link: "https://pap.ai",
          description: "Your personalized AI-narrated news broadcast.",
          language: "en-us",
          "itunes:author": "PAP",
          "itunes:explicit": "no",
          "itunes:type": "episodic",
          "itunes:category": { "@text": "News" },
          item: userEpisodes.map((ep) => ({
            title: ep.title,
            description: `Generated from ${ep.sourceName}`,
            pubDate: ep.createdAt?.toUTCString(),
            guid: { "@isPermaLink": "false", "#": `ep-${ep.id}` },
            enclosure: {
              "@url": ep.audioUrl,
              "@length": "0",
              "@type": "audio/mpeg",
            },
            "itunes:duration": "0",
            "itunes:explicit": "no",
          })),
        },
      },
    };

    const doc = create(feedObject);
    return doc.end({ prettyPrint: true });
  },
};
