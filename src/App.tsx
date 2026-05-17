import React from 'react';
import { SwarmProvider, useSwarm } from './contexts/SwarmContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PromptTab from './components/tabs/PromptTab';
import WorkspaceTab from './components/tabs/WorkspaceTab';
import LtmTab from './components/tabs/LtmTab';
import DiscoveryTab from './components/tabs/DiscoveryTab';
import InputTab from './components/tabs/InputTab';
import OutputTab from './components/tabs/OutputTab';
import CalendarTab from './components/tabs/CalendarTab';

function MainShell() {
  const { activeTab } = useSwarm();

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
    <SwarmProvider>
      <MainShell />
    </SwarmProvider>
  );
}
