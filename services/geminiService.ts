
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSweetNote = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Write a one-sentence, extremely cute and cheesy Valentine\'s note for someone special. Keep it short and sweet, under 15 words.',
      config: {
        temperature: 0.9,
      }
    });
    return response.text || "You make my heart skip a beat! 💖";
  } catch (error) {
    console.error("Error generating note:", error);
    return "You're the sprinkles on my cupcake! 🧁";
  }
};
