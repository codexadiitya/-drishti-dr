'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Camera,
  FileCheck,
  Stethoscope,
  BarChart3,
  Sliders,
  Cpu,
  ShieldAlert,
  Settings,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, screenings } = useApp();

  const pendingReviewCount = screenings.filter(
    s => s.status === 'UNDER_REVIEW' || (s.status === 'AI_COMPLETED' && s.referableDR && !s.review)
  ).length;

  const navItems = [
    {
      group: 'Clinical Workflow',
      items: [
        {
          name: 'Field Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          roles: ['SCREENER', 'OPHTHALMOLOGIST', 'DISTRICT_OFFICER', 'ADMIN']
        },
        {
          name: 'Patients Directory',
          href: '/patients',
          icon: Users,
          roles: ['SCREENER', 'OPHTHALMOLOGIST', 'DISTRICT_OFFICER', 'ADMIN']
        },
        {
          name: 'Register Patient',
          href: '/patients/new',
          icon: UserPlus,
          roles: ['SCREENER', 'ADMIN']
        },
        {
          name: 'Fundus Capture (OD/OS)',
          href: '/screenings/new',
          icon: Camera,
          roles: ['SCREENER', 'ADMIN']
        },
        {
          name: 'Screening Encounters',
          href: '/screenings',
          icon: Layers,
          roles: ['SCREENER', 'OPHTHALMOLOGIST', 'DISTRICT_OFFICER', 'ADMIN']
        },
        {
          name: 'Tele-Review Queue',
          href: '/review-queue',
          icon: Stethoscope,
          badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
          roles: ['OPHTHALMOLOGIST', 'ADMIN', 'SCREENER']
        }
      ]
    },
    {
      group: 'Intelligence & Health Systems',
      items: [
        {
          name: 'District Analytics',
          href: '/district-analytics',
          icon: BarChart3,
          roles: ['DISTRICT_OFFICER', 'ADMIN', 'OPHTHALMOLOGIST', 'SCREENER']
        },
        {
          name: 'Capacity Simulator',
          href: '/capacity-simulation',
          icon: Sliders,
          roles: ['ADMIN', 'DISTRICT_OFFICER', 'OPHTHALMOLOGIST', 'SCREENER']
        },
        {
          name: 'Model & AI Registry',
          href: '/model-registry',
          icon: Cpu,
          roles: ['ADMIN', 'OPHTHALMOLOGIST', 'DISTRICT_OFFICER', 'SCREENER']
        },
        {
          name: 'Audit Trail & Logs',
          href: '/audit-logs',
          icon: ShieldAlert,
          roles: ['ADMIN', 'AUDITOR', 'DISTRICT_OFFICER', 'OPHTHALMOLOGIST', 'SCREENER']
        },
        {
          name: 'Admin Console',
          href: '/admin',
          icon: Settings,
          roles: ['ADMIN', 'DISTRICT_OFFICER', 'OPHTHALMOLOGIST', 'SCREENER']
        }
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-teal-100 dark:border-teal-900/40 bg-teal-950/5 dark:bg-slate-900/80 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-3 space-y-6">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-bold tracking-wider text-teal-800/70 dark:text-teal-400/70 uppercase">
              {group.group}
            </h3>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-900 dark:hover:text-teal-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? 'text-white' : 'text-teal-700 dark:text-teal-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white text-teal-700'
                            : 'bg-rose-500 text-white shadow-sm'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Field Support & Offline Helper Card */}
      <div className="p-3 border-t border-teal-100 dark:border-teal-900/40">
        <div className="p-3 rounded-xl bg-teal-100/50 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60">
          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-xs">
            <HelpCircle className="h-4 w-4 text-teal-600" />
            <span>Field Protocol v4.2</span>
          </div>
          <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80 mt-1 leading-snug">
            Always capture Macula-centered (OD & OS) 45° fundus images before AI triage.
          </p>
          <div className="mt-2 text-[10px] text-teal-700 dark:text-teal-400 font-medium">
            Ayushman Bharat DR Network
          </div>
        </div>
      </div>
    </aside>
  );
};
