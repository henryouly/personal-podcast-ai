import Parser from "rss-parser";
import * as cheerio from "cheerio";

export interface NormalizedArticle {
  title: string;
  summary: string;
  content: string;
  url: string;
  pubDate?: string;
}

// Lazy initialization of parser to help with mocking/testing
let _parser: Parser | null = null;
function getParser() {
  if (!_parser) _parser = new Parser();
  return _parser;
}

export const ingestionService = {
  /**
   * Fetch and normalize articles from an RSS feed
   */
  async fetchRSS(url: string): Promise<NormalizedArticle[]> {
    try {
      const parser = getParser();
      const feed = await parser.parseURL(url);
      return feed.items.map((item) => ({
        title: item.title || "No Title",
        summary: item.contentSnippet || item.summary || "",
        content: item.content || item.contentSnippet || "",
        url: item.link || "",
        pubDate: item.pubDate,
      }));
    } catch (error) {
      console.error(`Failed to fetch RSS from ${url}:`, error);
      throw new Error(`RSS Ingestion Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
  
  // ... rest of the file
  async scrapeHTML(url: string): Promise<NormalizedArticle> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const title = $("title").text() || $("h1").first().text() || "No Title";
      $("script, style, nav, footer, header").remove();
      
      const content = $("article").text() || $("main").text() || $("body").text();
      const summary = content.substring(0, 200) + "...";

      return {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        url,
      };
    } catch (error) {
      console.error(`Failed to scrape HTML from ${url}:`, error);
      throw new Error(`HTML Scraper Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
};
