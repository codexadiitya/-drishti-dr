'use client';

import React, { useState } from 'react';
import { DISTRICT_ANALYTICS_DATA } from '@/lib/mock-data';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building,
  Calendar,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function DistrictAnalyticsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const totalScreenedAll = DISTRICT_ANALYTICS_DATA.reduce((acc, d) => acc + d.totalScreened, 0);
  const totalDiabeticAll = DISTRICT_ANALYTICS_DATA.reduce((acc, d) => acc + d.diabeticPopulation, 0);
  const totalReferralsAll = DISTRICT_ANALYTICS_DATA.reduce((acc, d) => acc + d.referralCount, 0);
  const totalUrgentAll = DISTRICT_ANALYTICS_DATA.reduce((acc, d) => acc + d.urgentReferralCount, 0);
  const overallCoverage = Math.round((totalScreenedAll / totalDiabeticAll) * 100);

  // Aggregate severity distribution across all districts
  const severityAggregate = [
    { name: 'Grade 0: Normal', count: 37890, fill: '#10b981' },
    { name: 'Grade 1: Mild', count: 10520, fill: '#14b8a6' },
    { name: 'Grade 2: Moderate', count: 8000, fill: '#f59e0b' },
    { name: 'Grade 3: Severe', count: 3140, fill: '#ea580c' },
    { name: 'Grade 4: PDR', count: 1410, fill: '#dc2626' }
  ];

  const districtComparisonData = DISTRICT_ANALYTICS_DATA.map(d => ({
    district: d.districtName,
    Screened: d.totalScreened,
    Diabetics: d.diabeticPopulation,
    Coverage: d.coveragePercentage,
    Referrals: d.referralCount
  }));

  const monthlyTrendData = [
    { month: 'Mar', Screenings: 4200, SightThreateningDR: 240 },
    { month: 'Apr', Screenings: 5800, SightThreateningDR: 310 },
    { month: 'May', Screenings: 7400, SightThreateningDR: 440 },
    { month: 'Jun', Screenings: 9100, SightThreateningDR: 580 },
    { month: 'Jul', Screenings: 11800, SightThreateningDR: 720 },
    { month: 'Aug', Screenings: 14820, SightThreateningDR: 890 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              State Health Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            District Epidemiological Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Diabetic retinopathy population screening coverage, referral patterns, and disease burden
          </p>
        </div>

        <button
          onClick={() => alert('Exporting district epidemiology CSV report...')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 shadow-sm self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900/40 shadow-sm space-y-2">
          <span className="text-slate-500 text-xs font-semibold block">Total Cohort Screened</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {totalScreenedAll.toLocaleString()}
            </span>
            <span className="text-xs text-teal-600 font-bold">/ {totalDiabeticAll.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-teal-600 font-bold">{overallCoverage}% Diabetic Population Screened</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-950/60 shadow-sm space-y-2">
          <span className="text-orange-700 dark:text-orange-400 text-xs font-bold uppercase block">
            Sight-Threatening DR Detected
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-600 font-mono">
              {totalUrgentAll.toLocaleString()}
            </span>
            <span className="text-xs text-orange-600 font-bold">Cases</span>
          </div>
          <p className="text-[11px] text-slate-400">Severe NPDR & PDR prevented from blindness</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-950/60 shadow-sm space-y-2">
          <span className="text-amber-700 dark:text-amber-400 text-xs font-bold uppercase block">
            Total Tele-Ophth Referrals
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">
              {totalReferralsAll.toLocaleString()}
            </span>
            <span className="text-xs text-amber-600 font-bold">Patients</span>
          </div>
          <p className="text-[11px] text-slate-400">20.5% referral yield rate</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/40 shadow-sm space-y-2">
          <span className="text-sky-700 dark:text-sky-400 text-xs font-bold uppercase block">
            Active Screening PHCs
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-700 dark:text-sky-300 font-mono">
              119
            </span>
            <span className="text-xs text-sky-600 font-semibold">Centres</span>
          </div>
          <p className="text-[11px] text-slate-400">Across 5 Eastern UP districts</p>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Screening Throughput & High-Risk Trajectory */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Screening Growth & Sight-Threatening DR Detection Trend
              </h3>
              <p className="text-xs text-slate-500">
                Scaling up rural primary healthcare centers with automated AI triage
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Screenings"
                  stroke="#0f766e"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="SightThreateningDR"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Retinopathy Severity Distribution Pie */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              5-Stage ICDR Severity Breakdown
            </h3>
            <p className="text-xs text-slate-500">Distribution across 60,970 screens</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityAggregate}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {severityAggregate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {severityAggregate.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{s.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {s.count.toLocaleString()} ({Math.round((s.count / 60970) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Comparison Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            District-Wise Public Health Screening Performance
          </h3>
          <p className="text-xs text-slate-500">
            Target diabetic coverage, tele-referrals, and active primary care units
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">District</th>
                <th className="px-5 py-4">Total Screened</th>
                <th className="px-5 py-4">Diabetic Target Cohort</th>
                <th className="px-5 py-4">Coverage %</th>
                <th className="px-5 py-4">Total Referrals</th>
                <th className="px-5 py-4">Sight-Threatening Alerts</th>
                <th className="px-5 py-4">Avg Tele-Turnaround</th>
                <th className="px-5 py-4">Active PHCs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DISTRICT_ANALYTICS_DATA.map(d => (
                <tr key={d.districtName} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    {d.districtName}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    {d.totalScreened.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-300">
                    {d.diabeticPopulation.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full"
                          style={{ width: `${d.coveragePercentage * 2}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold">{d.coveragePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-amber-600 font-bold">
                    {d.referralCount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono text-orange-600 font-bold">
                    {d.urgentReferralCount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {d.avgTurnaroundHours} Hours
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    {d.activePhcs} Centres
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
