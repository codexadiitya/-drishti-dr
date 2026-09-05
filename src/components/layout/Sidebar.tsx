import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ScanEye, Users, BarChart2, FileText,
  BrainCircuit, BarChart3, Settings, Bell, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/screening/new', label: 'New Scan', icon: ScanEye },
  { to: '/queue', label: 'Patient Queue', icon: Users },
  { to: '/patients/PT-10021', label: 'Results', icon: BarChart2 },
  { to: '/explainability', label: 'AI Insights', icon: BrainCircuit },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/reminders', label: 'Reminders', icon: Bell },
  { to: '/simulation', label: 'Capacity Planning', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside className={`
      flex flex-col bg-white border-r border-gray-200 shrink-0 h-full transition-all duration-200
      ${collapsed ? 'w-14' : 'w-56'}
    `}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <ScanEye size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate tracking-tight">NetraRakshaq</div>
            <div className="text-[10px] text-gray-400 truncate">Retinal Screening AI</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2.5 flex-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative
              ${isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {!collapsed && (
                  <span className="text-sm truncate">{label}</span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-green-50 ${collapsed ? 'justify-center' : ''}`}>
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-green-700 truncate">AI Services Online</div>
              <div className="text-[9px] text-green-500 truncate">Demo v1.0</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
