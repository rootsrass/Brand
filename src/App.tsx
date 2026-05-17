import { useState } from 'react';
import { 
  TreePine, 
  BookOpen, 
  Share2, 
  ShieldCheck, 
  GitCommitHorizontal, 
  Send,
  Image as ImageIcon,
  Terminal,
  Copy,
  CheckCheck,
  FolderTree,
  FileText,
  FolderOpen,
  MessageSquare
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('prompt');
  const [systemOnline, setSystemOnline] = useState(true);
  const [copied, setCopied] = useState(false);

  const masterPrompt = `**[SYSTEM INITIALIZATION]**
You are "EcoManage AI" (or a persona of your choosing), the Lead Digital and Social Media Manager and Marketing Strategist for "GrassRoots Tree Landscape and Loader Services LLC", a local contracting company based in New Smyrna Beach, Florida, USA.

**[COMPANY PROFILE & ASSETS]**
- **Business Name:** GrassRoots Tree Landscape and Loader Services LLC
- **Location:** Nexus is New Smyrna Beach, Florida, USA. (Targeting New Smyrna Beach, Edgewater, Port Orange, Ponce Inlet, and greater Volusia County).
- **Core Services:** Tree Service, Landscaping Installation, Pavers, Irrigation, Retaining Walls, and Outdoor Living experiences.
- **Brand Tone:** Professional, ruggedly reliable, community-oriented, and highly expert.
- **Actionable Assets:** Active existing website [INSERT_WEBSITE_URL_HERE], Phone: [INSERT_PHONE_HERE]. Always use these for Call-To-Actions (CTAs) to prevent hallucinations.

**[CORE OBJECTIVE]**
Generate maximum local brand recognition and organic lead generation without any paid advertising spend. Your mandate is 100% free organic traffic. You will create and distribute updates, job pictures, and articles across Google Local Business, Google Organic, Facebook, Instagram, Bing, Yelp, Nextdoor, and Networx.
You will also evaluate more social media sites that the company would benefit from.

**[AGENT SWARM ARCHITECTURE]**
To execute this mission efficiently, you will operate as the Manager and spin up specialized sub-agents. When a task requires their expertise, you will adopt their persona or simulate their output:

1. **Copywriter Agent**: Transforms rough field notes into polished, engaging articles and posts.
2. **Omnichannel Distro Agent**: Optimizes content formats perfectly for specific platforms:
    - *Facebook/Nextdoor:* Community-focused, conversational, neighborly trust.
    - *Instagram/TikTok:* Highly visual, behind-the-scenes, engaging short-form text.
    - *Google Local/Bing (SEO):* Keyword-dense (e.g., "Tree service in New Smyrna Beach"), service-first, authoritative.
3. **Brand Guardian Agent**: Cross-checks all generated content against existing brand recognition files to ensure voice, tone, and visual guidelines are strictly maintained. Do not hallucinate company services.
4. **Digital Discovery & Scraping Agent**: Manages external intelligence gathering by actively scanning the internet for GrassRoots LLC's existing online footprint (previously posted pictures, reviews, legacy content, and directory listings). It stages discovered assets into \`/inbox/swap_file/discovery_queue/\` for human approval before they are fully ingested into the AI's LTM.

**[LONG-TERM MEMORY & GITHUB PROTOCOL]**
To ensure continuity, prevent hallucinations, and maintain a perfectly consistent brand voice across sessions, you will use a GitHub repository as your Master Workspace and Long-Term Memory (LTM). 
**Target Repository:** https://github.com/rootsrass/MediaManager.git

* **Initialization Step**: At the start of every session, you must ask for or read the current "Context Summary" from the GitHub repository. Note: If you do not have direct web-scraping access, explicitly ask me to paste the contents of the latest context file.
* **Execution Step**: Draft content, campaigns, and strategies referencing this LTM and the local Florida context.
* **Commit Step**: At the end of every session or task completion, you MUST generate a "Memory Commit Log" formatted exactly as a Markdown block. It must contain:
    - **New Content Created:** Links or summaries of posts.
    - **Platforms Targeted:** Which platforms received updates.
    - **Insights/SEO Keywords Used:** Keywords targeted in this session.
    - **Next Steps:** Recommended future actions.
    Instruct me to save/push this log into the \`/memory_logs\` directory.

**[GITHUB WORKSPACE BEST PRACTICES]**
As the Lead Media Manager, managing this GitHub workspace effectively is critical to the success of GrassRoots LLC. Adhere to these principles:
- **Single Source of Truth:** Treat the repository as the ultimate brain of the operation. Any new insight regarding local New Smyrna SEO keywords, successful post formats, or brand tweaks must be documented here.
- **Directory Ingestion:** There will be a dedicated directory in the repository (e.g., \`/inbox\`) where the company owner will drop raw field notes, job pictures, and brand recognition updates. You will systematically process items from this "inbox", transform them into optimized social media assets, and package them for distribution.
- **Asset Versioning:** When refining a post or article, maintain clear iteration logs so we can track what copy resonates best locally.
- **Campaign Architecture:** Organize the repository logically by platform, season (e.g., hurricane prep for trees, spring landscaping), and campaign type for easy retrieval and auditing.

**[OPERATING PROCEDURES]**
1. Acknowledge this prompt by stating your understanding of the role, the organic-traffic mandate tailored for GrassRoots LLC in New Smyrna Beach, and the specific GitHub repository structure. Say: "System Online: Local Media Swarm Initialized."
2. Ask me to provide the link or text of the first "Brand Recognition File", your "GitHub LTM State", and [WEBSITE/CONTACT] info to establish baseline memory.
3. Ask for the first batch of job pictures or rough articles from the GitHub inbox directory to begin processing.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-900 text-emerald-50 p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-800 rounded-lg">
            <TreePine className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">EcoManage AI Command Center</h1>
            <p className="text-emerald-300 text-xs font-mono uppercase tracking-wider">GrassRoots LLC Media Swarm // v1.1</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-800">
          <div className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
          {systemOnline ? 'SYSTEM ONLINE' : 'OFFLINE'}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-2">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 px-2">Swarm Modules</h2>
          
          <button 
            onClick={() => setActiveTab('prompt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'prompt' ? 'bg-white shadow-sm border border-stone-200 text-emerald-800 font-medium' : 'hover:bg-stone-200 text-stone-600'}`}
          >
            <Terminal className="w-5 h-5" />
            Master System Prompt
          </button>

          <button 
            onClick={() => setActiveTab('workspace')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'workspace' ? 'bg-white shadow-sm border border-stone-200 text-emerald-800 font-medium' : 'hover:bg-stone-200 text-stone-600'}`}
          >
            <FolderTree className="w-5 h-5" />
            Repository Workspace
          </button>

          <button 
            onClick={() => setActiveTab('ltm')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'ltm' ? 'bg-white shadow-sm border border-stone-200 text-emerald-800 font-medium' : 'hover:bg-stone-200 text-stone-600'}`}
          >
            <BookOpen className="w-5 h-5" />
            Brand LTM State
          </button>
          
          <button 
            onClick={() => setActiveTab('input')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'input' ? 'bg-white shadow-sm border border-stone-200 text-emerald-800 font-medium' : 'hover:bg-stone-200 text-stone-600'}`}
          >
            <ImageIcon className="w-5 h-5" />
            Field Notes & Media
          </button>

          <button 
            onClick={() => setActiveTab('output')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'output' ? 'bg-white shadow-sm border border-stone-200 text-emerald-800 font-medium' : 'hover:bg-stone-200 text-stone-600'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Generated Output
          </button>

          <div className="pt-4 pb-2">
            <div className="h-px bg-stone-200 w-full" />
          </div>
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 px-2">Active Agents</h2>

          <div className="space-y-1">
            <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span>Copywriter Agent</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>Omnichannel Distro</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              <span>Brand Guardian</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
              <span>Digital Discovery Agent</span>
            </div>
          </div>
        </aside>

        {/* Workspace Area */}
        <section className="lg:col-span-3">
          {activeTab === 'prompt' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-stone-800">Master System Prompt</h2>
                    <p className="text-sm text-stone-500">The synthesized initialization prompt for the EcoManage AI Swarm.</p>
                  </div>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors text-sm font-medium"
                >
                  {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-stone-900 rounded-xl p-6 relative group">
                <pre className="text-stone-300 font-mono text-sm whitespace-pre-wrap font-medium">
                  {masterPrompt}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <FolderTree className="w-6 h-6 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-semibold text-stone-800">Workspace Explorer</h2>
                  <p className="text-sm text-stone-500">github.com/rootsrass/MediaManager.git structure.</p>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-stone-50 rounded-xl p-6 border border-stone-200 font-mono text-sm text-stone-700">
                <ul className="space-y-2">
                  <li>
                    <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                      <FolderOpen className="w-4 h-4" /> /inbox
                    </div>
                    <ul className="pl-6 space-y-2 border-l border-stone-300 ml-2">
                      <li>
                        <div className="flex items-center gap-2 font-semibold">
                          <FolderOpen className="w-4 h-4 text-emerald-600" /> company_profile
                        </div>
                        <ul className="pl-6 mt-2 space-y-2 border-l border-stone-300 ml-2">
                          <li className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> 
                            <div>
                              <span>master_profile.txt</span>
                              <p className="text-xs text-stone-500 mt-1 font-sans">Contains core business details, service area, website, and phone number. AI pulls base context from here.</p>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li className="pt-2">
                        <div className="flex items-center gap-2 font-semibold">
                          <FolderOpen className="w-4 h-4 text-emerald-600" /> swap_file
                        </div>
                        <ul className="pl-6 mt-2 space-y-2 border-l border-stone-300 ml-2">
                          <li className="flex items-start gap-2">
                            <FolderOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-semibold">discovery_queue</span>
                                <p className="text-xs text-stone-500 mt-1 font-sans">Discovery Agent places scraped online assets here for human approval.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" /> 
                            <div>
                              <span className="italic text-stone-500">Drop raw job pictures and field notes here...</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li className="pt-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                      <FolderOpen className="w-4 h-4" /> /memory_logs
                    </div>
                    <ul className="pl-6 space-y-2 border-l border-stone-300 ml-2">
                      <li className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> 
                        <div>
                          <span>README.md</span>
                          <p className="text-xs text-stone-500 mt-1 font-sans">AI generates end-of-session LTM commit logs here.</p>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ltm' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <GitCommitHorizontal className="w-6 h-6 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-semibold text-stone-800">GitHub Protocol: Memory State</h2>
                  <p className="text-sm text-stone-500">Provide the Context Summary to initialize the swarm.</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <textarea 
                  className="flex-1 w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Paste current Brand Recognition File or GitHub LTM Context Summary here..."
                />
                <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Initialize Swarm Memory
                </button>
              </div>
            </div>
          )}

          {activeTab === 'input' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <Share2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-semibold text-stone-800">Incoming Field Data</h2>
                  <p className="text-sm text-stone-500">Upload job pictures and rough notes for processing.</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:bg-stone-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-8 h-8 text-stone-400" />
                  <p className="text-sm font-medium text-stone-700">Drop job pictures here</p>
                  <p className="text-xs text-stone-500">Supports JPG, PNG (Max 5MB)</p>
                </div>

                <textarea 
                  className="w-full h-48 bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Paste rough field notes here... (e.g., 'Finished the retaining wall on Elm st. Used sandstone blocks. Client happy. Rained all day but got it done.')"
                />
                
                <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Dispatch to Swarm
                </button>
              </div>
            </div>
          )}

          {activeTab === 'output' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-semibold text-stone-800">Generated Assets & Logs</h2>
                  <p className="text-sm text-stone-500">Copy optimized posts and your end-of-session Memory Commit Logs.</p>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-stone-50 rounded-xl p-6 border border-stone-200">
                <div className="flex flex-col gap-6">
                  {/* Mock content item */}
                  <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">FACEBOOK / NEXTDOOR</span>
                      <button className="text-stone-400 hover:text-emerald-600"><Copy className="w-4 h-4" /></button>
                    </div>
                    <p className="text-sm text-stone-700 whitespace-pre-wrap">
                      Another beautiful driveway expansion completed right here in New Smyrna Beach! 🌴 
                      {"\n\n"}
                      We used premium sandstone pavers to totally transform the entrance, adding serious curb appeal just in time for summer. 
                      {"\n\n"}
                      Need a property facelift or tree service in Volusia county? Give us a call at [INSERT PHONE] or visit our website. 
                      {"\n\n"}
                      #NewSmyrnaBeach #VolusiaCounty #Landscaping #Pavers
                    </p>
                  </div>
                  
                  {/* Mock commit log item */}
                  <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-emerald-400 font-mono">MEMORY COMMIT LOG</span>
                      <button className="text-stone-400 hover:text-emerald-400"><Copy className="w-4 h-4" /></button>
                    </div>
                    <pre className="text-xs text-stone-300 font-mono whitespace-pre-wrap">
                      # Memory Commit: 2026-05-17
                      {"\n"}
                      **New Content Created:**
                      - 1x Facebook conversational post (Sandstone Paver Driveway)
                      - 1x Instagram visual post (Sandstone Paver Driveway)
                      {"\n"}
                      **Platforms Targeted:** Facebook, Nextdoor, Instagram
                      {"\n"}
                      **Insights/SEO Keywords Used:** "driveway expansion", "sandstone pavers", "New Smyrna Beach", "Volusia county landscape"
                      {"\n"}
                      **Next Steps:** Recommend gathering video of the next retaining wall project for TikTok/Reels test.
                    </pre>
                  </div>

                </div>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
