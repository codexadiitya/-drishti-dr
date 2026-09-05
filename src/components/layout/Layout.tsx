import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex items-stretch">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-14 bg-white border-b border-r border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0 cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <div className="flex-1">
            <Header />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
