import React from 'react';
import { GitCommitHorizontal, RefreshCcw, CheckCheck, ShieldCheck } from 'lucide-react';
import { useSwarm } from '../../contexts/SwarmContext';

export default function LtmTab() {
  const { ltmStatus, ltmInput, setLtmInput, handleAutoDiscover, handleInitializeSwarm } = useSwarm();

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
        {ltmStatus !== 'success' && (
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
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {ltmStatus === 'success' ? (
          <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
               <CheckCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Memory Initialized & Validated</h3>
            <p className="text-sm text-emerald-700 max-w-md mx-auto mb-6">
              The Brand Guardian Agent has successfully processed the Context Summary. The Swarm is now aware of GrassRoots LLC's latest state, services, and branding guidelines.
            </p>
            <button 
              onClick={() => {
                // To reset, we need to update state in context, we would need to export a reset function 
                // Since I didn't export setLtmStatus, Let's just use window.location.reload() or we can add it to context later
                window.location.reload(); 
              }}
              className="text-sm text-emerald-600 hover:text-emerald-800 font-medium underline"
            >
              Reset Swarm State
            </button>
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
