import React from 'react';
import { FolderTree, FolderOpen, FileText } from 'lucide-react';

export default function WorkspaceTab() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
        <FolderTree className="w-6 h-6 text-emerald-600" />
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Workspace Explorer</h2>
          <p className="text-sm text-stone-500">github.com/rootsrass/Brand.git structure.</p>
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
                  <FolderOpen className="w-4 h-4 text-emerald-600" /> metrics
                </div>
                <ul className="pl-6 mt-2 space-y-2 border-l border-stone-300 ml-2">
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> 
                    <div>
                      <span>active_campaigns.md</span>
                      <p className="text-xs text-stone-500 mt-1 font-sans">Running tally of currently executed marketing campaigns.</p>
                    </div>
                  </li>
                </ul>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 font-semibold">
                  <FolderOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                      <span className="font-semibold">discovery_queue</span>
                      <p className="text-xs text-stone-500 mt-1 font-sans">Discovery Agent places scraped online assets here for human approval.</p>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 font-semibold">
                  <FolderOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                      <span className="font-semibold">field_notes</span>
                      <p className="text-xs text-stone-500 mt-1 font-sans">Drop raw job descriptions and field text here...</p>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 font-semibold">
                  <FolderOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                      <span className="font-semibold">media</span>
                      <p className="text-xs text-stone-500 mt-1 font-sans">Drop before-and-after pictures or videos here...</p>
                  </div>
                </div>
              </li>
            </ul>
          </li>
          <li className="pt-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
              <FolderOpen className="w-4 h-4" /> /campaigns
            </div>
            <ul className="pl-6 space-y-2 border-l border-stone-300 ml-2">
              <li className="flex items-start gap-2">
                <div>
                  <p className="text-xs text-stone-500 mt-1 font-sans">Organized by season and platform (e.g., /campaigns/spring-mulch/)</p>
                </div>
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
                  <span>[YYYY-MM-DD].md</span>
                  <p className="text-xs text-stone-500 mt-1 font-sans">AI generates end-of-session LTM commit logs here.</p>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
