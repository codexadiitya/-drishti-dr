'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  Layers,
  Search,
  Filter,
  Camera,
  Calendar,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function ScreeningsDirectoryPage() {
  const { screenings } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = screenings.filter(s => {
    const matchesSearch =
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.encounterCode.toLowerCase().includes(search.toLowerCase()) ||
      s.phcCenter.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Clinical Records
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Retinal Screening Encounters
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive archive of bilateral fundus screenings and AI diagnostic runs
          </p>
        </div>

        <Link
          href="/screenings/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-600/30 transition-all"
        >
          <Camera className="h-4 w-4" />
          <span>New Screening</span>
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Encounter Code, Patient..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          <option value="ALL">All Statuses</option>
          <option value="AI_COMPLETED">AI Completed</option>
          <option value="UNDER_REVIEW">Under Tele-Review</option>
          <option value="FINALIZED">Finalized & Signed</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">Encounter Code</th>
                <th className="px-5 py-4">Patient Name</th>
                <th className="px-5 py-4">PHC Facility</th>
                <th className="px-5 py-4">Highest AI Severity</th>
                <th className="px-5 py-4">DME Status</th>
                <th className="px-5 py-4">Workflow Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    <Link href={`/screenings/${s.id}`} className="hover:underline">
                      {s.encounterCode}
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    {s.patientName}
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {s.phcCenter}
                  </td>
                  <td className="px-5 py-4">
                    <SeverityBadge grade={s.highestGrade} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    {s.dmeRisk ? (
                      <span className="text-amber-600 font-bold">DME High Risk</span>
                    ) : (
                      <span className="text-slate-400">Normal</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        s.status === 'FINALIZED'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : s.status === 'AI_COMPLETED'
                          ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {s.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/screenings/${s.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 font-bold text-xs inline-flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Studio</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
