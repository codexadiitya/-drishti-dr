'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  Stethoscope,
  Filter,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function ReviewQueuePage() {
  const { screenings, currentUser } = useApp();
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  // Filter cases that are pending doctor sign-off
  const pendingCases = screenings.filter(s => {
    const matchesDistrict = filterDistrict === 'ALL' || s.patientDistrict === filterDistrict;
    const matchesSeverity = filterSeverity === 'ALL' || String(s.highestGrade) === filterSeverity;
    return matchesDistrict && matchesSeverity;
  });

  const urgentCasesCount = screenings.filter(s => s.urgentReferral && !s.review).length;
  const routineCasesCount = screenings.filter(s => s.referableDR && !s.urgentReferral && !s.review).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Tele-Ophthalmology Workstation
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Apex Reading Grid
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Clinical Tele-Review Queue
          </h1>
          <p className="text-xs text-slate-500">
            Triaged bilateral fundus encounters awaiting specialist review and digital sign-off
          </p>
        </div>
      </div>

      {/* Triage Urgency Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-orange-800 dark:text-orange-300 text-xs font-bold uppercase">
            <span>Urgent Sight-Threatening (PDR / Severe)</span>
            <ShieldAlert className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-700 dark:text-orange-400 font-mono">
              {urgentCasesCount}
            </span>
            <span className="text-xs text-orange-700 font-bold">&lt; 48h Turnaround</span>
          </div>
          <p className="text-[11px] text-orange-800/80">Requires immediate specialist intervention</p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-bold uppercase">
            <span>Routine Referable (Moderate NPDR)</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-700 dark:text-amber-400 font-mono">
              {routineCasesCount}
            </span>
            <span className="text-xs text-amber-700 font-bold">2-4 Week Window</span>
          </div>
          <p className="text-[11px] text-amber-800/80">Scheduled clinic visit recommended</p>
        </div>

        <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-teal-800 dark:text-teal-300 text-xs font-bold uppercase">
            <span>Average Tele-Review Time</span>
            <Clock className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-700 dark:text-teal-400 font-mono">
              3.4
            </span>
            <span className="text-xs text-teal-700 font-bold">Hours from scan</span>
          </div>
          <p className="text-[11px] text-teal-800/80">Within SLA compliance threshold (&lt;6h)</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-bold text-slate-500">Filter by District:</span>
          <select
            value={filterDistrict}
            onChange={e => setFilterDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 font-semibold"
          >
            <option value="ALL">All Districts</option>
            <option value="Varanasi">Varanasi</option>
            <option value="Chandauli">Chandauli</option>
            <option value="Mirzapur">Mirzapur</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-bold text-slate-500">Filter by AI Grade:</span>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 font-semibold"
          >
            <option value="ALL">All Grades</option>
            <option value="4">Grade 4 (Proliferative PDR)</option>
            <option value="3">Grade 3 (Severe NPDR)</option>
            <option value="2">Grade 2 (Moderate NPDR)</option>
            <option value="1">Grade 1 (Mild NPDR)</option>
            <option value="0">Grade 0 (Normal)</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">Priority / Encounter</th>
                <th className="px-5 py-4">Patient & Demographics</th>
                <th className="px-5 py-4">Originating PHC</th>
                <th className="px-5 py-4">AI Triage Severity</th>
                <th className="px-5 py-4">DME Risk</th>
                <th className="px-5 py-4">Doctor Review Status</th>
                <th className="px-5 py-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingCases.map(s => {
                const isUrgent = s.urgentReferral && !s.review;

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isUrgent ? 'bg-orange-50/30 dark:bg-orange-950/20' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-600 text-white font-bold text-[10px] uppercase animate-pulse">
                          HIGH PRIORITY
                        </span>
                      ) : (
                        <span className="font-mono text-slate-500 text-[11px]">Routine</span>
                      )}
                      <div className="font-mono font-bold text-teal-700 dark:text-teal-400 mt-1">
                        {s.encounterCode}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {s.patientName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {s.patientAge}y • {s.patientGender}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      <div className="font-semibold">{s.phcCenter}</div>
                      <div className="text-[11px] text-slate-400">{s.patientDistrict}</div>
                    </td>
                    <td className="px-5 py-4">
                      <SeverityBadge grade={s.highestGrade} size="sm" />
                    </td>
                    <td className="px-5 py-4">
                      {s.dmeRisk ? (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          High Risk
                        </span>
                      ) : (
                        <span className="text-slate-400">No DME</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {s.review ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Signed by {s.review.doctor.name.split(' ')[0]}
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold">
                          Awaiting Sign-off
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/screenings/${s.id}`}
                        className={`px-4 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all ${
                          isUrgent
                            ? 'bg-orange-600 hover:bg-orange-500 text-white'
                            : 'bg-teal-600 hover:bg-teal-500 text-white'
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{s.review ? 'View Case' : 'Review & Sign'}</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
