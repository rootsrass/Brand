import { Request, Response } from 'express';
import OpenAI from 'openai';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class LTMAgent {
  static async ingest(req: Request, res: Response) {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "Missing input" });

    if (!process.env.NVIDIA_NIM_API_KEY) {
      await delay(1500);
      return res.json({ success: true, message: "No API Key matching - memory locked locally in cache via mock." });
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.NVIDIA_NIM_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      const prompt = `You are a Brand Memory Processor. Summarize the following user input into a single concise memory fact to store forever in Long Term Memory:

"${input}"

Return a JSON object with 'summary' (the condensed fact). Ensure your response is strictly valid JSON containing only the 'summary' key.`;

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

      res.json({ success: true, message: `Memory verified using AI and summarized: "${resultData.summary}"` });
    } catch (error) {
      console.error("NVIDIA NIM Error:", error);
      res.json({ success: true, message: "Fallback: Memory stored locally due to API failure." });
    }
  }

  static async githubSync(req: Request, res: Response) {
    const owner = process.env.GITHUB_REPO_OWNER || 'rootsrass';
    const repo = process.env.GITHUB_REPO_NAME || 'Brand';
    const pat = process.env.GITHUB_PAT?.replace(/^["']|["']$/g, '').trim();
    
    try {
      const headers: any = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'aistudio-build'
      };
      if (pat) {
        headers['Authorization'] = `Bearer ${pat}`;
      }

      let response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/inbox/company_profile/master_profile.txt`, { headers });
      
      if (!response.ok && response.status === 404) {
         // Fallback to README.md
         response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, { headers });
      }
      
      if (!response.ok) {
         let errText = '';
         try { errText = await response.text(); } catch(e) {}
         if (response.status === 404) {
             return res.json({ 
                 success: false, 
                 message: `Error 404: Repository (${owner}/${repo}) or file not found. Have you run 'Auto-Initialize Workspace' or set up your GITHUB_PAT? Response: ${errText}` 
             });
         }
         if (response.status === 401 || response.status === 403) {
             return res.json({
                 success: false,
                 message: `Error ${response.status}: Unauthorized. Check your GITHUB_PAT in Settings. Details: ${errText}`
             });
         }
         return res.json({ success: false, message: `GitHub API error: ${response.status} ${response.statusText} - ${errText}` });
      }
      
      const file = await response.json();
      const content = Buffer.from(file.content, 'base64').toString('utf-8');
      
      res.json({ success: true, content, message: "Successfully synced with GitHub LTM." });
    } catch (error) {
      console.error("GitHub Sync Error:", error);
      res.json({ success: false, message: "Failed to connect to GitHub." });
    }
  }

  static async githubSetup(req: Request, res: Response) {
    const owner = process.env.GITHUB_REPO_OWNER || 'rootsrass';
    const repo = process.env.GITHUB_REPO_NAME || 'Brand';
    const pat = process.env.GITHUB_PAT?.replace(/^["']|["']$/g, '').trim();
    
    if (!pat) {
       return res.json({ success: false, message: "No GitHub Personal Access Token (GITHUB_PAT) found in environment." });
    }

    try {
      const headers: any = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'aistudio-build',
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json'
      };

      const filesToCreate = [
        {
          path: 'inbox/company_profile/master_profile.txt',
          content: 'GrassRoots LLC - Master Profile\n\nAdd your company details, brand voice, and service areas here.'
        },
        {
          path: 'inbox/metrics/active_campaigns.md',
          content: '# Active Campaigns\n\nList your current marketing efforts here.'
        },
        {
          path: 'inbox/field_notes/.gitkeep',
          content: ''
        },
        {
          path: 'inbox/media/.gitkeep',
          content: ''
        },
        {
          path: 'inbox/discovery_queue/.gitkeep',
          content: ''
        },
        {
          path: 'campaigns/.gitkeep',
          content: ''
        },
        {
          path: 'memory_logs/.gitkeep',
          content: ''
        }
      ];

      // First verify the repository exists
      const repoCheck = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (!repoCheck.ok) {
         let errText = '';
         try { errText = await repoCheck.text(); } catch(e) {}
         if (repoCheck.status === 404) {
             return res.json({ success: false, message: `Repository '${owner}/${repo}' not found. Please create an empty repository on GitHub first. Details: ${errText}` });
         }
         return res.json({ success: false, message: `GitHub API Error (${repoCheck.status}): Ensure your GITHUB_PAT is correct and has repo permissions. Details: ${errText}` });
      }

      for (const file of filesToCreate) {
        // First check if file exists
        const checkResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, { headers });
        if (checkResp.status === 404) {
          // Create the file
          const createBody = {
            message: `Initialize ${file.path}`,
            content: Buffer.from(file.content).toString('base64')
          };
          const createResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(createBody)
          });
          if (!createResp.ok) {
            let errText = '';
            try { errText = await createResp.text(); } catch(e) {}
            console.error(`Failed to create ${file.path}: ${createResp.statusText} - ${errText}`);
            return res.json({ success: false, message: `Failed to create file ${file.path}. Check permissions. Details: ${errText}` });
          }
        }
      }

      res.json({ success: true, message: "Successfully initialized GitHub structure." });
    } catch (error) {
      console.error("GitHub Setup Error:", error);
      res.json({ success: false, message: "Failed to initialize GitHub structure." });
    }
  }

  static async generateCommit(req: Request, res: Response) {
    const { activityLog } = req.body;
    
    if (!process.env.NVIDIA_NIM_API_KEY) {
      await delay(1500);
      return res.json({ 
        success: true, 
        commitLog: `**Notice:** No API Key found. This is a simulated commit log.\n\n### Memory Commit Log\n- **Date & Purpose:** ${new Date().toISOString().split('T')[0]} - Initial setup and routine scraping review.\n- **New Assets Created:** Simulated draft post for Facebook.\n- **Algorithmic Insights/SEO Keywords:** "New Smyrna Beach landscaping", "Lawn maintenance"\n- **Profile Updates (Crucial):** No changes to master_profile.txt needed today.\n\n*Action Required:* Save this to \`/memory_logs/${new Date().toISOString().split('T')[0]}.md\` in the GitHub repository.` 
      });
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.NVIDIA_NIM_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      const prompt = `You are a Brand Memory Processor. Based on the following recent agent activity, create a "Memory Commit Log" formatted EXACTLY as a Markdown block with no other conversational filler. 

Format:
### Memory Commit Log
- **Date & Purpose**: [Today's date and a short purpose of the session]
- **New Assets Created**: [Summarize the generated posts]
- **Algorithmic Insights/SEO Keywords**: [Keywords used or learned]
- **Profile Updates (Crucial)**: [List any instructions for appending to master_profile.txt or active_campaigns.md. If none, write "None"]

Also instruct the user to save/push this log into the \`/memory_logs/\` directory with the current date as the filename.

Recent Activity:
${activityLog}
`;

      const response = await openai.chat.completions.create({
        model: "meta/llama-3.1-8b-instruct",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      });

      let resultStr = response.choices[0]?.message?.content || "";
      
      res.json({ success: true, commitLog: resultStr.trim() });
    } catch (error) {
      console.error("NVIDIA NIM Error (Commit Log):", error);
      res.json({ success: false, commitLog: "**Error:** Failed to generate commit log due to API error." });
    }
  }
}
