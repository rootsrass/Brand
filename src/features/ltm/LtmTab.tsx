import React from 'react';
import { GitCommitHorizontal, RefreshCcw, CheckCheck, ShieldCheck } from 'lucide-react';
import { useContentStore } from '../../stores/contentStore';

export default function LtmTab() {
  const ltmStatus = useContentStore(state => state.ltmStatus);
  const ltmInput = useContentStore(state => state.ltmInput);
  const setLtmInput = useContentStore(state => state.setLtmInput);
  const handleAutoDiscover = useContentStore(state => state.handleAutoDiscover);
  const handleInitializeSwarm = useContentStore(state => state.handleInitializeSwarm);
  const handleGithubSync = useContentStore(state => state.handleGithubSync);
  const isGithubSyncing = useContentStore(state => state.isGithubSyncing);
  const handleGithubSetup = useContentStore(state => state.handleGithubSetup);
  const isGithubSettingUp = useContentStore(state => state.isGithubSettingUp);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <GitCommitHorizontal className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-lg font-semibold text-stone-800">GitHub Protocol: Memory State</h2>
            <p className="text-sm text-stone-500">Provide the Context Summary or let the Swarm discover it.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {ltmStatus !== 'success' && (
            <>
              <button
                onClick={handleGithubSetup}
                disabled={isGithubSettingUp || isGithubSyncing || ltmStatus === 'processing'}
                className="text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGithubSettingUp ? 'Initializing...' : 'Auto-Initialize Workspace'}
              </button>
              <button
                onClick={handleGithubSync}
                disabled={isGithubSettingUp || isGithubSyncing || ltmStatus === 'processing'}
                className="text-sm bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGithubSyncing ? 'Syncing...' : 'Connect GitHub Repo'}
              </button>
              <button
                onClick={handleAutoDiscover}
                disabled={ltmStatus !== 'idle'}
                className="text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ltmStatus === 'discovering' ? (
                   <>
                     <div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                     Scanning...
                   </>
                ) : (
                  <>
                    <RefreshCcw className="w-4 h-4" />
                    Auto-Discover Online Presence
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {ltmStatus === 'success' ? (
          <div className="flex-1 overflow-auto flex flex-col gap-4">
            <div className="bg-emerald-50 shrink-0 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                 <CheckCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Memory Initialized & Validated</h3>
              <p className="text-sm text-emerald-700 max-w-md mx-auto mb-6">
                The Brand Guardian Agent has successfully processed the Context Summary. The Swarm is now aware of GrassRoots LLC's latest state, services, and branding guidelines.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium underline"
              >
                Reset Swarm State
              </button>
            </div>
            
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 flex flex-col mt-auto">
              <div className="flex justify-between items-center mb-4">
                 <div>
                   <h3 className="font-semibold text-stone-800">End-of-Session Commit</h3>
                   <p className="text-sm text-stone-500">Generate a markdown log of today's activities to push to /memory_logs/ in GitHub.</p>
                 </div>
                 <button
                   onClick={useContentStore(state => state.handleGenerateCommit)}
                   disabled={useContentStore(state => state.isGeneratingCommit)}
                   className="bg-stone-800 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                 >
                   {useContentStore(state => state.isGeneratingCommit) ? 'Generating...' : 'Generate Commit Log'}
                 </button>
              </div>
              {useContentStore(state => state.commitLog) && (
                <div className="mt-2 bg-stone-900 text-stone-300 p-4 rounded-lg overflow-auto max-h-48 font-mono text-xs whitespace-pre-wrap">
                  {useContentStore(state => state.commitLog)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <textarea 
              className="flex-1 w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Paste current Brand Recognition File or GitHub LTM Context Summary here..."
              value={ltmInput}
              onChange={(e) => setLtmInput(e.target.value)}
              disabled={ltmStatus === 'processing'}
            />
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shrink-0 mt-2 mb-2">
              <h3 className="text-sm font-bold text-orange-900 flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Connection Troubleshooting
              </h3>
              <div className="text-xs text-orange-800 space-y-3">
                <div>
                  <strong className="block mb-1">GitHub Connection Failed?</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Check your AI Studio Settings (top right): Ensure <code className="font-mono bg-orange-100 px-1 rounded">GITHUB_PAT</code> is a valid Personal Access Token with repo scope.</li>
                    <li>Ensure the Repository exists and is accessible by the specified token.</li>
                    <li>Ensure the <code className="font-mono bg-orange-100 px-1 rounded">master_profile.txt</code> exists (use the "Auto-Initialize" button to create one).</li>
                  </ul>
                </div>
                <div>
                  <strong className="block mb-1">NVIDIA NIM API Error / Generating Fake Data?</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Check your AI Studio Settings: Add a valid <code className="font-mono bg-orange-100 px-1 rounded">NVIDIA_NIM_API_KEY</code>.</li>
                    <li>You can request a key from build.nvidia.com. Without this key, AI features fail or fallback.</li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              onClick={handleInitializeSwarm}
              disabled={!ltmInput.trim() || ltmStatus === 'processing'}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {ltmStatus === 'processing' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Brand Guardian Processing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Initialize Swarm Memory
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
