import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NormalizedArticle } from "./ingestion";

export const aiService = {
  /**
   * Transform news articles into a podcast script using gemini-3.1-flash-lite-preview
   */
  async generatePodcastScript(
    apiKey: string,
    articles: NormalizedArticle[],
    language: string = "English"
  ): Promise<string> {
    if (!apiKey) throw new Error("Gemini API Key is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
      You are an expert podcast scriptwriter and personal narrator. 
      Your task is to transform the following news articles into a single, cohesive, and engaging podcast script.
      
      CONSTRAINTS:
      - The podcast script must be in language ${language}.
      - Use a conversational, friendly, and informative tone.
      - Start with a brief "Welcome back to your personalized news update." in ${language}.
      - Smoothly transition between articles.
      - Do not include technical metadata (like [Music starts] or [Host name]).
      - Focus on the key insights and why they matter.
      - End with a summary and a closing message in ${language}. 
      
      ARTICLES:
      ${articles.map((a, i) => `ARTICLE ${i + 1}:\nTitle: ${a.title}\nContent: ${a.content}`).join("\n\n")}
      
      SCRIPT:
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error("Gemini returned an empty response");

      return text;
    } catch (error) {
      console.error("Gemini Script Generation Error:", error);
      throw new Error(
        `AI Generation Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
