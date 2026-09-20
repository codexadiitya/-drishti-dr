import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ScanEye, Users, BarChart2, FileText,
  BrainCircuit, BarChart3, Settings, Bell, ShieldCheck,
  Stethoscope, Send, Award, ArrowRight
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { userRole, patients } = useAppState();
  const firstPatientId = patients[0]?.id || 'PT-10021';

  return (
    <aside
      className={`
        flex flex-col bg-white border-r border-gray-200 shrink-0 h-full transition-all duration-200 z-20
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Brand Header with Tagline */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm text-white">
          <ScanEye size={22} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-base font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
              NetraRakshaq
            </div>
            <div className="text-[10px] text-gray-500 truncate font-medium">
              Early Detection • Clearer Vision
            </div>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex flex-col gap-4 p-3 flex-1 overflow-y-auto">
        {/* GROUP 1: HEALTH WORKER WORKFLOW */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} className="text-blue-600" />
              <span>Health Worker (PHC)</span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <LayoutDashboard size={15} />
              {!collapsed && <span>Overview & Dashboard</span>}
            </NavLink>

            <NavLink
              to="/screening/new"
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/80'}
              `}
            >
              <ScanEye size={15} className="text-blue-600" />
              {!collapsed && <span>+ New Screening</span>}
            </NavLink>

            <NavLink
              to="/queue"
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <Users size={15} />
              {!collapsed && <span>Screening Queue</span>}
            </NavLink>
          </div>
        </div>

        {/* GROUP 2: DOCTOR WORKFLOW */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope size={12} className="text-emerald-600" />
              <span>Doctor Review</span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <NavLink
              to="/doctor"
              end
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <Stethoscope size={15} />
              {!collapsed && <span>Doctor Queue</span>}
            </NavLink>

            <NavLink
              to={`/doctor/review/${firstPatientId}`}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/80'}
              `}
            >
              <ShieldCheck size={15} className="text-emerald-600" />
              {!collapsed && <span>Review & Confirm</span>}
            </NavLink>

            <NavLink
              to={`/referral/${firstPatientId}`}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <Send size={15} />
              {!collapsed && <span>Refer to Center</span>}
            </NavLink>
          </div>
        </div>

        {/* GROUP 3: AI DIAGNOSTICS & SYSTEM */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Diagnostic Tools
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <NavLink
              to="/explainability"
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <BrainCircuit size={15} />
              {!collapsed && <span>Grad-CAM Explainability</span>}
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <FileText size={15} />
              {!collapsed && <span>Clinical Reports</span>}
            </NavLink>

            <NavLink
              to="/validation"
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <Award size={15} />
              {!collapsed && <span>Model Validation</span>}
            </NavLink>

            <NavLink
              to="/simulation"
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <BarChart3 size={15} />
              {!collapsed && <span>Capacity Simulation</span>}
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <Settings size={15} />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Model Active Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-100 bg-gray-50/70 m-2 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Model Engine</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-gray-900 mt-1 truncate">
            DR_MobileNetV2
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">
            5 ICDR Classes · Real Grad-CAM
          </div>
        </div>
      )}
    </aside>
  );
}
