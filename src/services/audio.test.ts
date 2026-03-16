import { describe, it, expect, vi } from "vitest";
import { audioService } from "./audio";

// Mock edge-tts-universal
vi.mock("edge-tts-universal", () => {
  return {
    EdgeTTS: class {
      synthesize = vi.fn().mockResolvedValue({ audio: new Blob(["mock-audio-data"]) });
    },
  };
});

// Mock @vercel/blob
vi.mock("@vercel/blob", () => {
  return {
    put: vi.fn().mockResolvedValue({
      url: "https://blob.example.com/audio.mp3",
      pathname: "episodes/audio.mp3",
    }),
  };
});

describe("Audio Service", () => {
  it("should synthesize script and upload to blob", async () => {
    const result = await audioService.synthesizeAndUpload("This is a test script", 123);

    expect(result.audioUrl).toBe("https://blob.example.com/audio.mp3");
    expect(result.storageKey).toBe("episodes/audio.mp3");
  });
});
