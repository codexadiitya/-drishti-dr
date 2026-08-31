'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';
import {
  Eye,
  Activity,
  Wifi,
  WifiOff,
  Sparkles,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Bell
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUserRole,
    isDemoMode,
    setIsDemoMode,
    isOnline,
    setIsOnline,
    pendingSyncCount
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: string }[] = [
    {
      role: 'SCREENER',
      label: 'Field Screener / ASHA',
      desc: 'Mobile fundus capture & field triage at PHC',
      icon: '🩺'
    },
    {
      role: 'OPHTHALMOLOGIST',
      label: 'Tele-Ophthalmologist',
      desc: 'Review queue, case sign-off & digital signature',
      icon: '👁️'
    },
    {
      role: 'DISTRICT_OFFICER',
      label: 'District Health Officer',
      desc: 'Epidemiological trends & screening coverage',
      icon: '📊'
    },
    {
      role: 'ADMIN',
      label: 'System Admin / Researcher',
      desc: 'Capacity simulation, model registry & audit trails',
      icon: '⚙️'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-teal-100 dark:border-teal-900/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand & Program Identity */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Eye className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Drishti<span className="text-teal-600 dark:text-teal-400">-DR</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/80 text-teal-800 dark:text-teal-300">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                National Retinal Screening & Tele-Ophthalmology Network
              </p>
            </div>
          </Link>
        </div>

        {/* Global Operational Status Banners */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* DEMO_MODE vs REAL_MODEL_MODE Indicator */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            title="Click to toggle simulation mode"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              isDemoMode
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Engine:</span>
            <span>{isDemoMode ? 'DEMO_MODE (Synthetic ML)' : 'REAL_MODEL_MODE'}</span>
          </button>

          {/* Network / Offline First Sync Pill */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            title="Toggle offline simulation"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isOnline
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-sky-600" />
                <span className="hidden sm:inline">Online (Cloud Synced)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-rose-600" />
                <span>Offline ({pendingSyncCount} queued)</span>
              </>
            )}
          </button>

          {/* User Persona & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors"
            >
              <div className="h-7 w-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                  {currentUser.role} • {currentUser.district}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            {/* Role Switcher Dropdown */}
            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-850 shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Switch Active Persona
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Explore different role workspaces across the DR care pathway
                  </p>
                </div>

                <div className="mt-1 space-y-1">
                  {roles.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setCurrentUserRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                        currentUser.role === r.role
                          ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl">{r.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {r.label}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          {r.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3 py-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Facility: {currentUser.facilityName}</span>
                  <Link
                    href="/login"
                    onClick={() => setRoleMenuOpen(false)}
                    className="text-teal-600 hover:underline font-semibold"
                  >
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
