import React from 'react';
import { useUIStore } from './stores/uiStore';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PromptTab from './features/core/PromptTab';
import WorkspaceTab from './features/core/WorkspaceTab';
import LtmTab from './features/ltm/LtmTab';
import DiscoveryTab from './features/discovery/DiscoveryTab';
import InputTab from './features/content/InputTab';
import OutputTab from './features/content/OutputTab';
import CalendarTab from './features/calendar/CalendarTab';

function MainShell() {
  const activeTab = useUIStore(state => state.activeTab);

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Sidebar />
        
        {/* Workspace Area */}
        <section className="lg:col-span-3">
          {activeTab === 'prompt' && <PromptTab />}
          {activeTab === 'workspace' && <WorkspaceTab />}
          {activeTab === 'ltm' && <LtmTab />}
          {activeTab === 'discovery' && <DiscoveryTab />}
          {activeTab === 'input' && <InputTab />}
          {activeTab === 'output' && <OutputTab />}
          {activeTab === 'calendar' && <CalendarTab />}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <MainShell />
  );
}
