import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#EEF2F7] overflow-hidden text-gray-900 font-sans">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:flex h-full">
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="flex items-stretch">
            <button
              onClick={() => setCollapsed(c => !c)}
              className="hidden md:flex w-12 bg-white border-b border-r border-gray-200 items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 cursor-pointer"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
            <div className="flex-1 min-w-0">
              <Header />
            </div>
          </div>

          <main className="flex-1 overflow-y-auto bg-[#EEF2F7] pb-16 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation (screens < 768px) */}
      <MobileBottomNav />
    </div>
  );
}
