import { Request, Response } from 'express';
import OpenAI from 'openai';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class SwarmOrchestrator {
  static async dispatch(req: Request, res: Response) {
    const { fieldNotes } = req.body;
    if (!fieldNotes) return res.status(400).json({ error: "Missing fieldNotes" });

    // Fallback if no NVIDIA NIM key is provided
    if (!process.env.NVIDIA_NIM_API_KEY) {
      console.warn("No NVIDIA_NIM_API_KEY found. Falling back to simple processing.");
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
          content: `**Notice:** Please add NVIDIA_NIM_API_KEY to Settings to enable real AI processing.\n\nSimulated post based on field notes.`,
          status: 'pending'
        }
      });
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.NVIDIA_NIM_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      const prompt = `You are a professional Copywriter & Brand Guardian for GrassRoots LLC, a local landscaping company in New Smyrna Beach. 
Generate a high-converting, local-focused social media post based on these notes: "${fieldNotes}".
Also generate an internal commit log summarizing the actions.

Return ONLY a valid JSON object matching this schema:
{
  "platform": "Suggested platform, e.g., FACEBOOK, INSTAGRAM, NEXTDOOR",
  "content": "The actual post content with hashtags.",
  "commitLog": "A markdown bulleted list of what was created, insights used, and next steps for the team."
}`;

      const response = await openai.chat.completions.create({
        model: "meta/llama-3.1-8b-instruct",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      });

      let resultStr = response.choices[0]?.message?.content || "{}";
      
      // Clean up markdown block if present
      resultStr = resultStr.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const firstBrace = resultStr.indexOf('{');
      const lastBrace = resultStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
         resultStr = resultStr.substring(firstBrace, lastBrace + 1);
      }

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
    } catch (error: any) {
      console.error("NVIDIA NIM API Error:", error);
      res.json({
        post: {
          id: Date.now(),
          platform: 'INSTAGRAM / TIKTOK',
          content: `Transforming spaces! 🌿✨\n\n${fieldNotes.slice(0, 50)}...\n\nSwipe to see the before and after! 👉\n\n#Landscaping #Hardscape #NewSmyrnaBeach #GrassRootsLLC`,
          status: 'pending'
        },
        log: {
          id: Date.now() + 1,
          date: new Date().toISOString().split('T')[0],
          content: `**Notice:** AI Error (${error?.message || 'Unknown'}). Falling back to simulated post.`,
          status: 'pending'
        }
      });
    }
  }
}
