import React from 'react';
import { Share2, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { useSwarm } from '../../contexts/SwarmContext';

export default function InputTab() {
  const { addActivity, fieldNotes, setFieldNotes, handleDispatch, isGenerating } = useSwarm();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
        <Share2 className="w-6 h-6 text-emerald-600" />
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Incoming Field Data</h2>
          <p className="text-sm text-stone-500">Upload job pictures and rough notes for swarm triage.</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div 
           onClick={() => addActivity('System', 'Image upload simulated.')}
           className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:bg-stone-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group"
        >
          <div className="p-3 bg-stone-100 rounded-full group-hover:bg-emerald-50 transition-colors">
            <ImageIcon className="w-6 h-6 text-stone-400 group-hover:text-emerald-500" />
          </div>
          <div>
             <p className="text-sm font-medium text-stone-700 group-hover:text-emerald-700">Drag & Drop Job Pictures</p>
             <p className="text-xs text-stone-500 mt-1">Simulate upload to /inbox directory</p>
          </div>
        </div>

        <textarea 
          className="w-full h-40 bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          placeholder="Paste rough field notes here... (e.g., 'Finished the retaining wall on Elm st. Used sandstone blocks. Client happy. Rained all day but got it done.')"
          value={fieldNotes}
          onChange={(e) => setFieldNotes(e.target.value)}
        />
        
        <button 
          onClick={handleDispatch}
          disabled={!fieldNotes.trim() || isGenerating}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isGenerating ? 'Swarm Processing...' : 'Dispatch Processing Swarm'}
        </button>
      </div>
    </div>
  );
}
