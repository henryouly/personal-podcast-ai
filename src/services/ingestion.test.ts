import { describe, it, expect, vi } from 'vitest';
import { ingestionService } from './ingestion';

// Mock the Parser from rss-parser
vi.mock('rss-parser', () => {
  return {
    default: class {
      parseURL = vi.fn().mockResolvedValue({
        items: [
          {
            title: 'Test Article 1',
            contentSnippet: 'Summary 1',
            content: 'Full Content 1',
            link: 'https://example.com/1',
            pubDate: '2026-03-14',
          },
          {
            title: 'Test Article 2',
            content: 'Full Content 2',
            link: 'https://example.com/2',
          }
        ]
      })
    }
  };
});

describe('Ingestion Service', () => {
  it('should fetch and normalize RSS feeds', async () => {
    const articles = await ingestionService.fetchRSS('https://mockfeed.com');
    
    expect(articles).toHaveLength(2);
    expect(articles[0]).toMatchObject({
      title: 'Test Article 1',
      summary: 'Summary 1',
      content: 'Full Content 1',
      url: 'https://example.com/1',
    });
    
    expect(articles[1].title).toBe('Test Article 2');
    expect(articles[1].summary).toBe('');
    expect(articles[1].content).toBe('Full Content 2');
  });
});
