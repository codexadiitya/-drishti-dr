import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, ChevronDown, CheckCircle2,
  Wifi, Stethoscope, Users, Cpu, LogIn, LogOut
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { UserRole } from '../../lib/types';

export function Header() {
  const navigate = useNavigate();
  const {
    userRole,
    setUserRole,
    isRuralMode,
    setIsRuralMode,
    setNetworkStatus,
    patients,
    currentUser,
    logout,
  } = useAppState();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pendingCount = patients.filter(p => p.reviewStatus === 'pending').length;

  function handleRoleSwitch(role: UserRole) {
    setUserRole(role);
    if (role === 'doctor') {
      navigate('/doctor');
    } else {
      navigate('/');
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-3 shrink-0 relative z-20">
      {/* Workflow Tagline from Diagram */}
      <div className="hidden md:flex flex-col">
        <span className="text-xs font-extrabold tracking-tight text-gray-900">
          NetraRakshaq System
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          Early Detection • Clearer Vision • Healthier Tomorrow
        </span>
      </div>

      {/* Clean Segmented Role Switcher: Health Worker vs Doctor (from Architecture Diagram) */}
      <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80 mx-auto sm:mx-0">
        <button
          onClick={() => handleRoleSwitch('health_worker')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            userRole === 'health_worker'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users size={14} />
          <span>Health Worker</span>
          <span className="hidden lg:inline text-[10px] opacity-80 font-normal">(Field / PHC)</span>
        </button>

        <button
          onClick={() => handleRoleSwitch('doctor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            userRole === 'doctor'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Stethoscope size={14} />
          <span>Doctor</span>
          <span className="hidden lg:inline text-[10px] opacity-80 font-normal">(Review & Confirm)</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Real Live Model Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="font-mono text-[11px] font-bold">DR_MobileNetV2</span>
          <span className="text-emerald-600 text-[10px]">● Live Inference</span>
        </div>

        {/* Low-Bandwidth Mode Toggle */}
        <button
          onClick={() => {
            const next = !isRuralMode;
            setIsRuralMode(next);
            setNetworkStatus(next ? 'weak' : 'fast');
          }}
          className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
            isRuralMode
              ? 'bg-blue-50 border-blue-200 text-blue-800 font-bold'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
          title="Toggle 2G/3G Network Simulation"
        >
          <Wifi size={13} className={isRuralMode ? 'text-blue-600' : 'text-gray-400'} />
          <span>{isRuralMode ? 'Rural 2G Active' : 'High Speed'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(o => !o);
              setProfileOpen(false);
            }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Screening Notifications"
          >
            <Bell size={17} />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <span className="text-xs font-bold text-gray-900">Doctor Review Queue</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {pendingCount} Pending
                </span>
              </div>
              <div className="p-3 text-xs text-gray-600 space-y-2">
                <p>Real-time patient scans ready for clinical assessment.</p>
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    navigate('/doctor');
                  }}
                  className="w-full py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Open Doctor Queue →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(o => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
              userRole === 'doctor' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
              {userRole === 'doctor' ? 'Dr' : 'HW'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[140px]">
                {currentUser?.name || (userRole === 'doctor' ? 'Dr. A. Sharma' : 'Priya Sharma')}
              </div>
              <div className="text-[10px] text-gray-500 truncate max-w-[140px]">
                {currentUser?.district || (userRole === 'doctor' ? 'District Hospital' : 'PHC Operator')}
              </div>
            </div>
            <ChevronDown size={12} className="text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 text-xs">
                <div className="font-bold text-gray-900 truncate">
                  {currentUser?.name || (userRole === 'doctor' ? 'Dr. Sharma' : 'Priya Sharma')}
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  {currentUser?.district || 'Primary Health Centre'}
                </div>
              </div>
              <div className="p-1 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center justify-between"
                >
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer flex items-center justify-between"
                >
                  <span>Sign Out / Switch User</span>
                  <LogOut size={13} className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </header>
  );
}
