'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  Camera,
  UserPlus,
  Users,
  AlertOctagon,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
  Eye,
  FileText,
  Activity,
  Calendar,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';

export default function FieldWorkerDashboard() {
  const { currentUser, screenings, patients, isDemoMode } = useApp();

  const totalPatients = patients.length;
  const totalEncounters = screenings.length;
  const highRiskCount = screenings.filter(s => (s.highestGrade || 0) >= 3 || s.urgentReferral).length;
  const dmeCount = screenings.filter(s => s.dmeRisk).length;
  const pendingReviews = screenings.filter(s => s.status === 'UNDER_REVIEW' || s.status === 'AI_COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Field Worker Identity */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 uppercase tracking-wider">
                {currentUser.facilityName}
              </span>
              {isDemoMode && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                  DEMO_MODE ACTIVE
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {currentUser.fullName}
            </h1>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              Diabetic Retinopathy Field Triage Station. Capture bilateral fundus images to receive automated 5-stage ICDR grading, vessel segmentation, and tele-ophthalmology referral within seconds.
            </p>
          </div>

          {/* Big Touch Action Buttons for Field Workers */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link
              href="/screenings/new"
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-teal-900 font-extrabold text-sm shadow-lg hover:bg-teal-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="h-9 w-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <Camera className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider text-teal-700 font-bold">Quick Action</span>
                <span className="text-sm font-extrabold">New Retinal Scan</span>
              </div>
            </Link>

            <Link
              href="/patients/new"
              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-teal-600/60 border border-white/20 text-white font-bold text-sm hover:bg-teal-600 transition-all"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register Patient</span>
            </Link>
          </div>
        </div>

        {/* Decorative background pulse */}
        <div className="absolute right-0 -bottom-10 opacity-10 pointer-events-none">
          <Eye className="w-80 h-80" />
        </div>
      </div>

      {/* Primary KPI Clinical Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Screened */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Screened</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {totalEncounters}
            </span>
            <span className="text-xs text-teal-600 font-semibold">Patients</span>
          </div>
          <p className="text-[11px] text-slate-400">100% Bilateral (OD/OS) coverage</p>
        </div>

        {/* Sight-Threatening DR Alerts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-950/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-orange-700 dark:text-orange-400 text-xs font-bold uppercase">
            <span>Sight-Threatening DR</span>
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600">
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-600 font-mono">
              {highRiskCount}
            </span>
            <span className="text-xs text-orange-600 font-bold">Severe / PDR</span>
          </div>
          <p className="text-[11px] text-orange-600/80 font-medium">Flagged for urgent referral (&lt;48h)</p>
        </div>

        {/* Diabetic Macular Edema (DME) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-950/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-bold uppercase">
            <span>DME Risk Detected</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">
              {dmeCount}
            </span>
            <span className="text-xs text-amber-600 font-bold">Exudates present</span>
          </div>
          <p className="text-[11px] text-amber-600/80 font-medium">Macular edema risk confirmed</p>
        </div>

        {/* Tele-Ophthalmology Queue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sky-700 dark:text-sky-400 text-xs font-bold uppercase">
            <span>Doctor Tele-Review</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600">
              <Stethoscope className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-700 dark:text-sky-300 font-mono">
              {pendingReviews}
            </span>
            <span className="text-xs text-sky-600 font-semibold">Cases in queue</span>
          </div>
          <p className="text-[11px] text-slate-400">Average turnaround: 3.4 hours</p>
        </div>
      </div>

      {/* Quick Launchpad & Field Workflow Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/patients"
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Patient Master Directory
              </h3>
              <p className="text-xs text-slate-500">Search by ABHA ID, Phone or Name</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/review-queue"
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tele-Review Workstation
              </h3>
              <p className="text-xs text-slate-500">Ophthalmologist validation & sign-off</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/district-analytics"
          className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                District Health Analytics
              </h3>
              <p className="text-xs text-slate-500">DR prevalence & screening coverage</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Screening Encounters Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Retinal Screening Encounters
            </h2>
            <p className="text-xs text-slate-500">
              Live updates from PHC field cameras and tele-reading network
            </p>
          </div>
          <Link
            href="/screenings"
            className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
          >
            <span>View All Encounters</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Encounter Code</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">PHC Center</th>
                <th className="px-5 py-3.5">AI Triage (Highest Eye)</th>
                <th className="px-5 py-3.5">DME Status</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {screenings.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    {s.encounterCode}
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
                    {s.phcCenter}
                  </td>
                  <td className="px-5 py-4">
                    <SeverityBadge grade={s.highestGrade} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    {s.dmeRisk ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 text-[11px] font-bold">
                        <AlertTriangle className="h-3 w-3" />
                        DME High Risk
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Normal</span>
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/screenings/${s.id}`}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Analysis Studio</span>
                      </Link>
                    </div>
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
