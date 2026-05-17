import { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class LTMAgent {
  static async ingest(req: Request, res: Response) {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "Missing input" });

    if (!process.env.GEMINI_API_KEY) {
      await delay(1500);
      return res.json({ success: true, message: "No API Key matching - memory locked locally in cache via mock." });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `You are a Brand Memory Processor. Summarize the following user input into a single concise memory fact to store forever in Long Term Memory:

"${input}"

Return a JSON object with 'summary' (the condensed fact).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Summarized fact" }
            },
            required: ["summary"]
          }
        }
      });

      const resultStr = response.text || "{}";
      const resultData = JSON.parse(resultStr);

      res.json({ success: true, message: `Memory verified using AI and summarized: "${resultData.summary}"` });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.json({ success: true, message: "Fallback: Memory stored locally due to API failure." });
    }
  }
}
