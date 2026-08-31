'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Settings,
  Users,
  Building,
  Camera,
  ShieldCheck,
  Cpu,
  Activity,
  HardDrive,
  CheckCircle2,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function AdminConsolePage() {
  const { currentUser, isDemoMode, setIsDemoMode } = useApp();

  const [activeTab, setActiveTab] = useState<'USERS' | 'FACILITIES' | 'HARDWARE' | 'SYSTEM'>('USERS');

  const usersList = [
    {
      id: 'u1',
      name: 'Priya Sharma',
      role: 'SCREENER',
      facility: 'Sultanpur PHC',
      email: 'priya.sharma@nhm.gov.in',
      status: 'ACTIVE'
    },
    {
      id: 'u2',
      name: 'Dr. Anand Mehta, MS',
      role: 'OPHTHALMOLOGIST',
      facility: 'District Apex Tele-Ophth Center',
      email: 'dr.anand.mehta@drishti-teleophth.org',
      license: 'MCI-UP-2014-98441',
      status: 'ACTIVE'
    },
    {
      id: 'u3',
      name: 'Rajiv Sengupta',
      role: 'ADMIN',
      facility: 'State Health Mission Directorate',
      email: 'admin.drishti@health.gov.in',
      status: 'ACTIVE'
    },
    {
      id: 'u4',
      name: 'Dr. Sunita Rao',
      role: 'DISTRICT_OFFICER',
      facility: 'CMO Office, Varanasi',
      email: 'cmo.varanasi@health.up.gov.in',
      status: 'ACTIVE'
    }
  ];

  const cameraHardware = [
    {
      id: 'cam_01',
      model: 'Remidio Non-Mydriatic Fundus on Phone 10.1',
      serial: 'REM-FOP-2025-9941',
      assignedPhc: 'Sultanpur PHC, Varanasi',
      status: 'ONLINE',
      battery: '94%',
      lastCalibration: '2026-08-10'
    },
    {
      id: 'cam_02',
      model: 'Volk VistaView Handheld Retinal Camera',
      serial: 'VLK-VV-2026-1182',
      assignedPhc: 'Chiraigaon PHC, Varanasi',
      status: 'ONLINE',
      battery: '88%',
      lastCalibration: '2026-08-15'
    },
    {
      id: 'cam_03',
      model: 'Forus 3nethra Classic Tabletop Fundus',
      serial: 'FOR-3N-2024-4402',
      assignedPhc: 'Mughalsarai CHC, Chandauli',
      status: 'ONLINE',
      battery: 'AC Powered',
      lastCalibration: '2026-07-28'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              System Administration
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Drishti-DR Administrative Console
          </h1>
          <p className="text-xs text-slate-500">
            User access control, PHC facility inventory, fundus hardware registry, and service telemetry
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'USERS' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'
          }`}
        >
          Users & RBAC
        </button>
        <button
          onClick={() => setActiveTab('HARDWARE')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'HARDWARE' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'
          }`}
        >
          Fundus Cameras
        </button>
        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'SYSTEM' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'
          }`}
        >
          Service Telemetry
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'USERS' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Authorized Clinical Users & Role Permissions
              </h3>
              <p className="text-xs text-slate-500">
                Manage field screeners, ophthalmologists, and administrative roles
              </p>
            </div>

            <button
              onClick={() => alert('New user registration modal opening...')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add New User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">User Name</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Facility / Center</th>
                  <th className="px-5 py-4">Official Email</th>
                  <th className="px-5 py-4">Medical License</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {u.facility}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500">
                      {u.email}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-700 dark:text-slate-300 font-bold">
                      {u.license || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HARDWARE */}
      {activeTab === 'HARDWARE' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Field Portable Retinal Fundus Cameras
            </h3>
            <p className="text-xs text-slate-500">
              Hardware health status, calibration dates, and facility assignments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Camera Model</th>
                  <th className="px-5 py-4">Serial Number</th>
                  <th className="px-5 py-4">Assigned PHC</th>
                  <th className="px-5 py-4">Battery / Power</th>
                  <th className="px-5 py-4">Last Optical Calibration</th>
                  <th className="px-5 py-4">Connection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {cameraHardware.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                      {c.model}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {c.serial}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {c.assignedPhc}
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300 font-semibold">
                      {c.battery}
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono">
                      {c.lastCalibration}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM TELEMETRY */}
      {activeTab === 'SYSTEM' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                FastAPI Backend Service
              </span>
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p>Status: <strong className="text-emerald-600">HEALTHY (v2.4.0)</strong></p>
              <p>Uptime: <strong>99.98%</strong></p>
              <p>Average API Latency: <strong>48ms</strong></p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Redis + Celery ML Queue
              </span>
              <Cpu className="h-4 w-4 text-teal-600" />
            </div>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p>Active Workers: <strong>4 Workers</strong></p>
              <p>Pending Jobs: <strong>0 Queued</strong></p>
              <p>Average Inference: <strong>810ms / Bilateral</strong></p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                PostgreSQL & Object Storage
              </span>
              <HardDrive className="h-4 w-4 text-sky-600" />
            </div>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p>Database: <strong>Connected (Pool: 20)</strong></p>
              <p>Retinal Storage: <strong>42.8 GB / 1 TB</strong></p>
              <p>Encrypted Backups: <strong>Daily 02:00 UTC</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
