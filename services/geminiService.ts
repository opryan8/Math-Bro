import { GoogleGenAI } from "@google/genai";
import { Attachment, Message, Role, Language } from "../types";
import { GEMINI_MODEL, TRANSLATIONS } from "../constants";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const solveMathProblem = async (
  currentMessage: string,
  attachments: Attachment[],
  history: Message[],
  language: Language
): Promise<string> => {
  const t = TRANSLATIONS[language];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let retries = 0;
  const maxRetries = 2;

  while (retries <= maxRetries) {
    try {
      const relevantHistory = history.slice(-10).map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const parts: any[] = [];
      if (currentMessage) parts.push({ text: currentMessage });
      attachments.forEach(att => {
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });

      let langInstruction = language === 'ar' ? "Arabic" : (language === 'fr' ? "French" : "English");

      const systemInstruction = `You are "Math Bro", an expert Math and Geometry tutor. 
      1. Respond strictly in ${langInstruction}.
      2. Solve problems step-by-step. 
      3. If an image is provided, analyze the geometry, graphs, or handwritten equations carefully. 
      4. Use LaTeX formatting for math equations (wrap in single $ for inline, double $$ for block).
      5. Be encouraging, clear, and concise.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          ...relevantHistory,
          { role: 'user', parts: parts }
        ],
        config: {
          systemInstruction: systemInstruction,
          thinkingConfig: { thinkingBudget: 1024 }, // Slightly lower budget for faster response
          temperature: 0.1, // Even more deterministic
        }
      });

      return response.text || "Error: No response generated.";
    } catch (error: any) {
      console.error(`Gemini API Error (Attempt ${retries + 1}):`, error);
      
      const isQuotaError = error.message?.includes('429') || error.status === 429 || error.message?.includes('quota');
      
      if (isQuotaError && retries < maxRetries) {
        retries++;
        // Wait 2s then 4s
        await delay(1000 * Math.pow(2, retries));
        continue;
      }
      
      if (isQuotaError) {
        return `⚠️ ${t.error429}`;
      }
      
      return `Error: ${error.message || "Something went wrong."}`;
    }
  }
  return `⚠️ ${t.error429}`;
};
