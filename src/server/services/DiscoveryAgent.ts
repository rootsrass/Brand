import { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class DiscoveryAgent {
  static async scan(req: Request, res: Response) {
    if (!process.env.GEMINI_API_KEY) {
      // Fallback if no key is present
      res.write(JSON.stringify({ log: '[INFO] No GEMINI_API_KEY. Using mock discovery...' }) + "\n");
      await delay(800);
      res.write(JSON.stringify({ log: '[WARN] Please add GEMINI_API_KEY in Settings for real AI Web Discovery.' }) + "\n");
      await delay(800);

      const data = {
        queue: [
          { 
            id: 1, type: 'Review', source: 'Google Local', content: '"They did an amazing job on our driveway expansion! Highly recommend." - Sarah T.', insight: 'Use for upcoming Paver Campaign.', confidence: 98,
            metadata: { locationMatch: true, nameMatch: true, phoneMatch: true, websiteMatch: true }
          }
        ]
      };
      
      res.write(JSON.stringify({ log: '[COMPLETE] Scan finished. Staging high-confidence items for human approval.', data }) + "\n");
      return res.end();
    }

    try {
      res.write(JSON.stringify({ log: '[INFO] Initializing Gemini AI with Google Search Grounding...' }) + "\n");
      
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Search the live web for recent mentions, reviews, or news about "GrassRoots" landscaping, tree service, or hardscaping in "New Smyrna Beach" or "Volusia County". 
Extract 3 realistic items for marketing. 

Return ONLY a JSON object with a "queue" array. Each item should have:
- id: unique number
- type: 'Review' | 'Mention' | 'Asset'
- source: e.g., 'Google Local', 'Nextdoor', 'Web'
- content: the actual snippet/review retrieved
- insight: why this is good for a marketing post
- confidence: number 1-100
- metadata: { locationMatch: true/false, nameMatch: true/false, phoneMatch: false, websiteMatch: false }`;

      res.write(JSON.stringify({ log: '[INFO] AI Agent dispatched to scan the open web...' }) + "\n");
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              queue: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    type: { type: Type.STRING },
                    source: { type: Type.STRING },
                    content: { type: Type.STRING },
                    insight: { type: Type.STRING },
                    confidence: { type: Type.INTEGER },
                    metadata: {
                      type: Type.OBJECT,
                      properties: {
                        locationMatch: { type: Type.BOOLEAN },
                        nameMatch: { type: Type.BOOLEAN },
                        phoneMatch: { type: Type.BOOLEAN },
                        websiteMatch: { type: Type.BOOLEAN }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.write(JSON.stringify({ log: '[SUCCESS] Web scan and Entity Resolution complete.' }) + "\n");
      
      const resultStr = response.text || "{}";
      const resultData = JSON.parse(resultStr);

      res.write(JSON.stringify({ 
        log: '[COMPLETE] Scan finished. Staging live search results for human approval.', 
        data: { queue: resultData.queue || [] } 
      }) + "\n");
      
    } catch (error) {
      console.error(error);
      res.write(JSON.stringify({ log: '[ERROR] AI Discovery failed. Is the API key valid?' }) + "\n");
    } finally {
      res.end();
    }
  }
}
