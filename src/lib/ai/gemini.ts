import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const ai = new GoogleGenAI({
  apiKey: apiKey,
});

export const GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Utility to safely generate content with fallback when API key is not configured or fails
 */
export async function generateGeminiContent(prompt: string, systemInstruction?: string) {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: systemInstruction
        ? {
            systemInstruction: systemInstruction,
          }
        : undefined,
    });

    return response.text ?? null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}
