import React from 'react';
import { Fingerprint, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function EntityResolutionTab() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <Fingerprint className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Entity Resolution Center</h2>
            <p className="text-sm text-stone-500">Cross-reference and validate discovered assets for exact entity matches.</p>
          </div>
        </div>
        <div className="flex bg-stone-100 rounded-lg p-1">
          <button className="px-3 py-1.5 text-xs font-medium bg-white shadow-sm rounded-md text-stone-800">
            Pending Queue
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-700">
            Resolved
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-stone-50/50 rounded-xl p-4 border border-stone-100 flex items-center justify-center">
        <div className="text-center text-stone-400">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Connect your LTM GitHub repository to stage discovery assets here.</p>
          <p className="text-xs mt-1">Review matches against name, location, phone, and website before merging to /inbox.</p>
        </div>
      </div>
    </div>
  );
}
