import { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class SwarmOrchestrator {
  static async dispatch(req: Request, res: Response) {
    const { fieldNotes } = req.body;
    if (!fieldNotes) return res.status(400).json({ error: "Missing fieldNotes" });

    // Fallback if no Gemini key is provided
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found. Falling back to simple processing.");
      await delay(2500);
      return res.json({
        post: {
          id: Date.now(),
          platform: 'INSTAGRAM / TIKTOK',
          content: `Transforming spaces! 🌿✨\n\n${fieldNotes.slice(0, 50)}...\n\nSwipe to see the before and after! 👉\n\n#Landscaping #Hardscape #NewSmyrnaBeach #GrassRootsLLC`,
          status: 'pending'
        },
        log: {
          id: Date.now() + 1,
          date: new Date().toISOString().split('T')[0],
          content: `**Notice:** Please add GEMINI_API_KEY to Settings to enable real AI processing.\n\nSimulated post based on field notes.`,
          status: 'pending'
        }
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `You are a professional Copywriter & Brand Guardian for GrassRoots LLC, a local landscaping company in New Smyrna Beach. 
Generate a high-converting, local-focused social media post based on these notes: "${fieldNotes}".
Also generate an internal commit log summarizing the actions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING, description: "Suggested platform, e.g., FACEBOOK, INSTAGRAM, NEXTDOOR" },
              content: { type: Type.STRING, description: "The actual post content with hashtags." },
              commitLog: { type: Type.STRING, description: "A markdown bulleted list of what was created, insights used, and next steps for the team." }
            },
            required: ["platform", "content", "commitLog"]
          }
        }
      });

      const resultStr = response.text || "{}";
      const resultData = JSON.parse(resultStr);

      const generatedPost = {
        id: Date.now(),
        platform: resultData.platform || 'FACEBOOK',
        content: resultData.content || 'Content generation failed.',
        status: 'pending'
      };

      const commitLog = {
        id: Date.now() + 1,
        date: new Date().toISOString().split('T')[0],
        content: resultData.commitLog || 'Commit log generation failed.',
        status: 'pending'
      };

      res.json({ post: generatedPost, log: commitLog });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate content using AI." });
    }
  }
}
