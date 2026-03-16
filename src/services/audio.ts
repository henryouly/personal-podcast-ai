import { EdgeTTS } from "edge-tts-universal";
import { put } from "@vercel/blob";

export interface AudioSynthesisResult {
  audioUrl: string;
  storageKey: string;
}

export const audioService = {
  /**
   * Synthesize a podcast script into audio using Microsoft Edge TTS and upload to Vercel Blob
   */
  async synthesizeAndUpload(script: string, episodeId: number): Promise<AudioSynthesisResult> {
    // en-US-AvaNeural is a very high quality, natural voice from Edge TTS
    const tts = new EdgeTTS(script, "en-US-AvaNeural");

    try {
      // 1. Generate Speech
      const { audio } = await tts.synthesize();

      if (!audio) {
        throw new Error("TTS failed to generate audio content");
      }

      // 2. Upload to Vercel Blob
      const filename = `episodes/episode-${episodeId}-${Date.now()}.mp3`;
      const { url, pathname } = await put(filename, audio, {
        access: "public",
        contentType: "audio/mpeg",
      });

      return {
        audioUrl: url,
        storageKey: pathname,
      };
    } catch (error) {
      console.error("Audio Synthesis/Upload Error:", error);
      throw new Error(
        `Audio Service Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
