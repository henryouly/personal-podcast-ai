import { describe, it, expect, vi } from 'vitest';
import { aiService } from './ai';

// Mock the GoogleGenerativeAI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel = vi.fn().mockImplementation(() => {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => "Mocked Podcast Script Response"
            }
          })
        };
      })
    }
  };
});

describe('AI Service', () => {
  it('should generate a podcast script from articles', async () => {
    const mockArticles = [
      { title: 'Article 1', summary: 'Sum 1', content: 'Content 1', url: 'url1' },
      { title: 'Article 2', summary: 'Sum 2', content: 'Content 2', url: 'url2' }
    ];

    const script = await aiService.generatePodcastScript('fake-api-key', mockArticles);
    
    expect(script).toBe("Mocked Podcast Script Response");
  });

  it('should throw error if API key is missing', async () => {
    await expect(aiService.generatePodcastScript('', [])).rejects.toThrow(/Gemini API Key is missing/);
  });
});
