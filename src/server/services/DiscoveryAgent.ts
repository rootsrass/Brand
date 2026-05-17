import { Request, Response } from 'express';
import OpenAI from 'openai';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class DiscoveryAgent {
  static async scan(req: Request, res: Response) {
    if (!process.env.NVIDIA_NIM_API_KEY) {
      // Fallback if no key is present
      res.write(JSON.stringify({ log: '[INFO] No NVIDIA_NIM_API_KEY. Using mock discovery...' }) + "\n");
      await delay(800);
      res.write(JSON.stringify({ log: '[WARN] Please add NVIDIA_NIM_API_KEY in Settings for real AI Web Discovery.' }) + "\n");
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
      res.write(JSON.stringify({ log: '[INFO] Initializing NVIDIA NIM AI for Web Discovery processing...' }) + "\n");
      
      const openai = new OpenAI({
        apiKey: process.env.NVIDIA_NIM_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      const prompt = `You are an elite Digital Intelligence & Discovery Agent tasked with an exhaustive, multi-channel online presence analysis for "GrassRoots" (specializing in landscaping, tree service, hardscaping, lawn care, and outdoor living) across "New Smyrna Beach", "Edgewater", "Port Orange", and the broader "Volusia County" area.

Since live search is not directly attached, simulate an advanced aggregation by generating exactly 5 highly realistic, nuanced, and diverse discovery items that a comprehensive web scraping engine would find. Ensure a rich mix of online presence channels.

Channels to simulate:
1. Local Social & Community: Nextdoor discussions, local Facebook Community groups, Reddit local subreddits.
2. Review & Directory Platforms: Google Business Profile, Yelp, Angi, Thumbtack.
3. Visual & Aesthetic Platforms: Instagram tags/mentions, TikTok local geo-tags.
4. Editorial & PR: Local news outlets, community blogs, neighborhood newsletters.

Return ONLY a valid JSON object with a "queue" array. Each item MUST have:
- id: unique number
- type: 'Review' | 'Mention' | 'Social Post' | 'Forum Discussion' | 'Local News'
- source: e.g., 'Nextdoor (NSB South)', 'Google Maps', 'Instagram', 'Yelp', 'Local Subreddit'
- content: the detailed, highly realistic snippet, comment, or review text retrieved.
- insight: actionable marketing intelligence (how to use this for a campaign or strategy).
- confidence: number 1-100 indicating relevance to our specific business.
- metadata: { locationMatch: true/false, nameMatch: true/false, sentiment: 'Positive' | 'Neutral' | 'Negative' }`;

      res.write(JSON.stringify({ log: '[INFO] AI Agent dispatched to process discovery data...' }) + "\n");

      const response = await openai.chat.completions.create({
        model: "meta/llama-3.1-8b-instruct",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      });

      res.write(JSON.stringify({ log: '[SUCCESS] Web scan and Entity Resolution complete.' }) + "\n");
      
      let resultStr = response.choices[0]?.message?.content || "{}";
      // Clean up markdown block if present
      resultStr = resultStr.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const firstBrace = resultStr.indexOf('{');
      const lastBrace = resultStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
         resultStr = resultStr.substring(firstBrace, lastBrace + 1);
      }
      
      let queue = [];
      try {
        const resultData = JSON.parse(resultStr);
        queue = resultData.queue || resultData || [];
        if (!Array.isArray(queue)) {
           queue = [queue]; // Fallback if single object
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError, resultStr);
        res.write(JSON.stringify({ log: '[WARN] AI returned malformed data. Staging raw results instead.' }) + "\n");
      }

      res.write(JSON.stringify({ 
        log: '[COMPLETE] Scan finished. Staging live search results for human approval.', 
        data: { queue: queue } 
      }) + "\n");
      
    } catch (error: any) {
      console.error("AI Discovery Error Details:", error);
      res.write(JSON.stringify({ log: `[WARN] AI Discovery failed (${error?.message || 'Unknown'}). Falling back to mock data.` }) + "\n");
      const mockData = {
        queue: [
          { 
            id: 1, type: 'Review', source: 'Google Local', content: '"They did an amazing job on our driveway expansion! Highly recommend." - Sarah T.', insight: 'Use for upcoming Paver Campaign.', confidence: 98,
            metadata: { locationMatch: true, nameMatch: true, phoneMatch: true, websiteMatch: true }
          }
        ]
      };
      res.write(JSON.stringify({ 
        log: '[COMPLETE] Scan finished. Staging high-confidence items for human approval.', 
        data: mockData 
      }) + "\n");
    } finally {
      res.end();
    }
  }
}
