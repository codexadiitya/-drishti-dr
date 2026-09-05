import { useNavigate } from 'react-router-dom';
import { Users, ScanEye, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { KPICard } from '../components/ui/KPICard';
import { Badge, ReviewStatusBadge, AIStatusBadge, QualityBadge, ConfidenceMeter, LiveDot } from '../components/ui/primitives';
import { MOCK_PATIENTS, HOURLY_SCREENING_DATA, SYSTEM_COMPONENTS } from '../lib/mockData';
import { DR_LEVEL_LABELS } from '../lib/types';

const now = new Date();
const hour = now.getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

function SystemHealthRow({ name, status, latency, module }: { name: string; status: string; latency?: number; module: string }) {
  const dot = status === 'online' ? 'bg-emerald-400' : status === 'warning' ? 'bg-amber-400' : 'bg-red-400';
  const text = status === 'online' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
        <span className="text-xs text-gray-700 truncate">{name}</span>
        <span className="text-[10px] text-gray-400 font-mono shrink-0">{module}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {latency !== undefined && latency > 0 && (
          <span className="text-[10px] text-gray-400 font-mono">{latency}ms</span>
        )}
        <span className={`text-[10px] font-semibold uppercase tracking-wide ${text}`}>{status}</span>
      </div>
    </div>
  );
}

export function Overview() {
  const navigate = useNavigate();

  const screened = MOCK_PATIENTS.filter(p => p.aiStatus === 'complete').length;
  const referable = MOCK_PATIENTS.filter(p => p.referable).length;
  const recapture = MOCK_PATIENTS.filter(p => p.reviewStatus === 'recapture').length;
  const pendingReview = MOCK_PATIENTS.filter(p => p.reviewStatus === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, Dr. Sharma 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's an overview of today's screening activity.</p>
        </div>
        <button
          onClick={() => navigate('/screening/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm flex-shrink-0"
        >
          <ScanEye size={16} />
          Start New Scan
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Patients Scanned Today" value={screened} trend={12} trendLabel="vs yesterday"
          icon={<Users size={15} />} accent="cyan" />
        <KPICard label="Need Specialist Referral" value={referable} trend={-8} trendLabel="vs last week"
          icon={<AlertTriangle size={15} />} accent="red" />
        <KPICard label="Awaiting Doctor Review" value={pendingReview} subtitle="Please review soon"
          icon={<Clock size={15} />} accent="amber" />
        <KPICard label="Images to Retake" value={recapture} subtitle="Poor image quality"
          icon={<ScanEye size={15} />} accent="purple" />
      </div>

      {/* Chart + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 card-shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Today's Scanning Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Number of patients scanned per hour</p>
            </div>
            <div className="flex items-center gap-2">
              <LiveDot color="green" />
              <span className="text-xs text-gray-400 font-medium">Live</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={HOURLY_SCREENING_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradScreened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradReferable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="time" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                labelStyle={{ color: '#374151', fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
              <Area type="monotone" dataKey="screened" name="Scanned" stroke="#2563EB" fill="url(#gradScreened)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="referable" name="Referable" stroke="#DC2626" fill="url(#gradReferable)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="recapture" name="Recapture" stroke="#D97706" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* System health */}
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800">System Status</h2>
            <span className="flex items-center gap-1.5 text-xs text-green-700 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              All Online
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {SYSTEM_COMPONENTS.slice(0, 8).map(c => (
              <SystemHealthRow key={c.name} {...c} />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Avg. processing time</span>
              <span className="font-mono text-blue-600 font-semibold">6.3s / scan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity overview */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">Today's Capacity</h2>
          <button onClick={() => navigate('/simulation')} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-medium">
            View details <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'Daily Capacity', value: '120', unit: 'patients', color: 'text-gray-900' },
            { label: 'Current Usage', value: '68%', unit: 'of capacity', color: 'text-amber-600' },
            { label: 'Est. Yearly Capacity', value: '37,440', unit: 'patients/year', color: 'text-green-600' },
            { label: 'Main Bottleneck', value: 'Doctor Review', unit: '74% utilization', color: 'text-amber-600' },
          ].map(({ label, value, unit, color }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Screening queue */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Recent Patients</h2>
          <button
            onClick={() => navigate('/queue')}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors"
          >
            View all patients <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Patient ID', 'Image Quality', 'Finding', 'Confidence', 'Referral', 'AI Status', 'Review Status', 'Time'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PATIENTS.map(p => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-bold text-blue-600 group-hover:text-blue-700">{p.id}</span>
                  </td>
                  <td className="px-4 py-3"><QualityBadge status={p.imageQuality.overall} /></td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">{DR_LEVEL_LABELS[p.drLevel]}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.aiStatus === 'complete' && p.confidence > 0 ? (
                      <div className="w-24">
                        <ConfidenceMeter value={p.confidence} showLabel={false} size="sm" />
                        <span className="text-[10px] font-mono text-gray-400 mt-0.5 block">{p.confidence.toFixed(1)}%</span>
                      </div>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {p.referable
                      ? <Badge variant="danger" size="sm">Yes — Refer</Badge>
                      : p.aiStatus === 'complete'
                        ? <Badge variant="success" size="sm">No</Badge>
                        : <span className="text-xs text-gray-300">—</span>
                    }
                  </td>
                  <td className="px-4 py-3"><AIStatusBadge status={p.aiStatus} /></td>
                  <td className="px-4 py-3"><ReviewStatusBadge status={p.reviewStatus} /></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-400 font-mono">{p.screeningTime}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
