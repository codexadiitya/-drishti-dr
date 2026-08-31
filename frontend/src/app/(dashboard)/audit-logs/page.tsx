'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  UserCheck,
  Lock,
  Calendar
} from 'lucide-react';

export default function AuditLogsPage() {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              DISHA / HIPAA Regulatory Compliance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Security & Clinical Audit Logs
          </h1>
          <p className="text-xs text-slate-500">
            Immutable, cryptographically chained audit trails tracking all patient access, AI inferences, and tele-ophthalmology sign-offs
          </p>
        </div>

        <button
          onClick={() => alert('Exporting signed audit trail CSV for compliance auditor inspection...')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 shadow-sm self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Audit Log (Signed CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Actor, IP, Entity ID, Notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-bold text-slate-500">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Actions</option>
            <option value="DOCTOR_REVIEW_SUBMITTED">Doctor Review</option>
            <option value="AI_INFERENCE_TRIGGERED">AI Inference</option>
            <option value="FUNDUS_IMAGE_UPLOAD">Fundus Upload</option>
            <option value="PATIENT_CREATED">Patient Created</option>
            <option value="USER_LOGIN">User Login</option>
            <option value="PDF_REPORT_GENERATED">PDF Generated</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">Timestamp (UTC)</th>
                <th className="px-5 py-4">User / Actor</th>
                <th className="px-5 py-4">Clinical Action</th>
                <th className="px-5 py-4">Entity Type & ID</th>
                <th className="px-5 py-4">Action Details</th>
                <th className="px-5 py-4">IP Address</th>
                <th className="px-5 py-4 font-mono">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'medium'
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {log.userName}
                    </div>
                    <div className="text-[11px] text-teal-600 font-medium">
                      {log.userRole}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-300">
                    <span className="font-semibold block">{log.entityType}</span>
                    <span className="text-[11px] text-slate-400">{log.entityId}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 dark:text-slate-300 max-w-sm leading-snug">
                    {log.details}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-5 py-4 font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={log.integrityHash}>
                    {log.integrityHash.substring(0, 16)}...
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
