import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const userRouter = router({
  // Update BYOK keys
  updateKeys: protectedProcedure
    .input(
      z.object({
        geminiKey: z.string().optional(),
        openaiKey: z.string().optional(),
        elevenLabsKey: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          geminiKey: input.geminiKey,
          openaiKey: input.openaiKey,
          elevenLabsKey: input.elevenLabsKey,
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),

  // Get status of keys (configured or not)
  getKeyStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        geminiKey: true,
        openaiKey: true,
        elevenLabsKey: true,
        rssToken: true,
      },
    });

    return {
      gemini: !!user?.geminiKey,
      openai: !!user?.openaiKey,
      elevenLabs: !!user?.elevenLabsKey,
      rssToken: user?.rssToken,
    };
  }),
});
