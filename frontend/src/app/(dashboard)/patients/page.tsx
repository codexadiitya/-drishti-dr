'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  Camera,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Activity,
  Heart
} from 'lucide-react';

export default function PatientsListPage() {
  const { patients, createScreening } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.abhaId && p.abhaId.includes(searchQuery)) ||
      p.phone.includes(searchQuery);

    const matchesDistrict = districtFilter === 'ALL' || p.district === districtFilter;
    const matchesGender = genderFilter === 'ALL' || p.gender === genderFilter;

    return matchesSearch && matchesDistrict && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Top Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              National Health Registry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Diabetic Patients Master Directory
          </h1>
          <p className="text-xs text-slate-500">
            Registered diabetic cohort enrolled in tele-ophthalmology screening
          </p>
        </div>

        <Link
          href="/patients/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-600/30 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Patient</span>
        </Link>
      </div>

      {/* Search & Filtering Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Name, ABHA ID, Code, Phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Districts</option>
            <option value="Varanasi">Varanasi</option>
            <option value="Chandauli">Chandauli</option>
            <option value="Mirzapur">Mirzapur</option>
            <option value="Jaunpur">Jaunpur</option>
          </select>

          <select
            value={genderFilter}
            onChange={e => setGenderFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">Patient Code</th>
                <th className="px-5 py-4">Patient Name & Demographics</th>
                <th className="px-5 py-4">ABHA ID</th>
                <th className="px-5 py-4">PHC Center / District</th>
                <th className="px-5 py-4">Diabetes Profile</th>
                <th className="px-5 py-4">Latest DR Severity</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    <Link href={`/patients/${p.id}`} className="hover:underline">
                      {p.patientCode}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/patients/${p.id}`} className="font-bold text-slate-900 dark:text-white hover:text-teal-600">
                      {p.firstName} {p.lastName}
                    </Link>
                    <div className="text-[11px] text-slate-400">
                      {p.age} yrs • {p.gender} • {p.phone}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-300">
                    {p.abhaId || '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    <div className="font-semibold">{p.phcCenter}</div>
                    <div className="text-[11px] text-slate-400">{p.district}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-800 dark:text-slate-200 font-semibold">
                      {p.diabetesDurationYears}y duration
                    </div>
                    <div className="text-[11px] text-slate-400">
                      HbA1c: <strong className="text-teal-600">{p.lastHba1c ? `${p.lastHba1c}%` : 'N/A'}</strong>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <SeverityBadge grade={p.highestRiskGrade || 0} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/patients/${p.id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs"
                      >
                        History
                      </Link>
                      <Link
                        href={`/screenings/new?patientId=${p.id}`}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        <span>Screen</span>
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
