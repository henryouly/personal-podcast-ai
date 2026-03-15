import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { put } from "@vercel/blob";

export interface AudioSynthesisResult {
  audioUrl: string;
  storageKey: string;
}

export const audioService = {
  /**
   * Synthesize a podcast script into audio using Google Cloud TTS and upload to Vercel Blob
   */
  async synthesizeAndUpload(
    apiKey: string,
    script: string,
    episodeId: number
  ): Promise<AudioSynthesisResult> {
    if (!apiKey) throw new Error("Google Cloud API Key is missing");

    // Initialize client with user provided API Key
    const client = new TextToSpeechClient({ apiKey });

    const request = {
      input: { text: script },
      voice: { languageCode: "en-US", name: "en-US-Neural2-D" }, // High quality neural voice
      audioConfig: { audioEncoding: "MP3" as const },
    };

    try {
      // 1. Generate Speech
      const [response] = await client.synthesizeSpeech(request);
      const audioContent = response.audioContent;

      if (!audioContent) {
        throw new Error("TTS failed to generate audio content");
      }

      // 2. Upload to Vercel Blob
      const filename = `episodes/episode-${episodeId}-${Date.now()}.mp3`;
      const { url, pathname } = await put(filename, audioContent as Buffer, {
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
