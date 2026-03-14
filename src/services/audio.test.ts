import { describe, it, expect, vi } from 'vitest';
import { audioService } from './audio';

// Mock @google-cloud/text-to-speech
vi.mock('@google-cloud/text-to-speech', () => {
  return {
    TextToSpeechClient: class {
      synthesizeSpeech = vi.fn().mockResolvedValue([{
        audioContent: Buffer.from('mock-audio-data')
      }])
    }
  };
});

// Mock @vercel/blob
vi.mock('@vercel/blob', () => {
  return {
    put: vi.fn().mockResolvedValue({
      url: 'https://blob.example.com/audio.mp3',
      pathname: 'episodes/audio.mp3'
    })
  };
});

describe('Audio Service', () => {
  it('should synthesize script and upload to blob', async () => {
    const result = await audioService.synthesizeAndUpload(
      'fake-google-key',
      'This is a test script',
      123
    );

    expect(result.audioUrl).toBe('https://blob.example.com/audio.mp3');
    expect(result.storageKey).toBe('episodes/audio.mp3');
  });

  it('should throw error if API key is missing', async () => {
    await expect(audioService.synthesizeAndUpload('', 'script', 1)).rejects.toThrow(/Google Cloud API Key is missing/);
  });
});
