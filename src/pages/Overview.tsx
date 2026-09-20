import { useNavigate } from 'react-router-dom';
import {
  Users, ScanEye, AlertTriangle, Clock, ChevronRight,
  ShieldCheck, RefreshCw, Sparkles, Wifi, ArrowRight, CheckCircle2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { KPICard } from '../components/ui/KPICard';
import { Badge, ReviewStatusBadge, LiveDot } from '../components/ui/primitives';
import { useAppState } from '../context/AppStateContext';
import { HOURLY_SCREENING_DATA, SYSTEM_COMPONENTS } from '../lib/mockData';
import { DR_LEVEL_LABELS, DR_LEVEL_BG_BADGES } from '../lib/types';

export function Overview() {
  const navigate = useNavigate();
  const { patients, isRuralMode, userRole, setUserRole } = useAppState();

  const totalScreened = patients.length;
  const referableCount = patients.filter(p => p.referable).length;
  const pendingCount = patients.filter(p => p.reviewStatus === 'pending').length;
  const recaptureCount = patients.filter(p => p.reviewStatus === 'recapture').length;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Health Worker Workspace · Khed PHC
            </span>
            {isRuralMode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Low Bandwidth Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {greeting}, Anjali Deshmukh 👋
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Rural tele-ophthalmology screening summary for Pune District primary health network.
          </p>
        </div>

        <button
          onClick={() => navigate('/screening/new')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex-shrink-0"
        >
          <ScanEye size={16} />
          Start New Screening →
        </button>
      </div>

      {/* KPI Cards (Section 8 & 9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Today's Screenings"
          value={totalScreened}
          trend={12}
          trendLabel="vs yesterday"
          icon={<Users size={16} />}
          accent="cyan"
        />
        <KPICard
          label="Referable Cases"
          value={referableCount}
          trend={-5}
          trendLabel="vs last week"
          icon={<AlertTriangle size={16} />}
          accent="red"
        />
        <KPICard
          label="Awaiting Doctor Review"
          value={pendingCount}
          subtitle="In ophthalmologist queue"
          icon={<Clock size={16} />}
          accent="amber"
        />
        <KPICard
          label="Recapture Required"
          value={recaptureCount}
          subtitle="Quality Gate rejections"
          icon={<RefreshCw size={16} />}
          accent="purple"
        />
      </div>

      {/* Main Grid: Activity Chart + Recent Screenings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Screening Graph */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 card-shadow p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Hourly Screening Throughput</h2>
              <p className="text-xs text-gray-400 mt-0.5">Patients screened vs referable cases flagged</p>
            </div>
            <div className="flex items-center gap-2">
              <LiveDot color="green" />
              <span className="text-xs text-gray-500 font-medium">PHC Online</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_SCREENING_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <XAxis dataKey="time" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px' }} />
                <Area type="monotone" dataKey="screened" name="Screened" stroke="#2563EB" fill="url(#gradScreened)" strokeWidth={2} />
                <Area type="monotone" dataKey="referable" name="Referable DR" stroke="#DC2626" fill="url(#gradReferable)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Link Cards & Workflow Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
              Golden Screening Workflow
            </span>
            <h3 className="text-base font-bold">Standard 4-Step Rural Protocol</h3>
            <div className="space-y-1.5 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Register Patient Demographic Details</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Align Camera & Acquire Fundus (OD / OS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Pass Trust-First Quality Gate Check</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">4</span>
                <span>Submit to AI Engine & Route to Doctor</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/screening/new')}
              className="w-full py-2 bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Start Guided Screening Now →
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 card-shadow flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gray-900 block">Switch to Doctor Review View</span>
              <span className="text-gray-500 text-[11px]">&lt;30s UX review for ophthalmologists</span>
            </div>
            <button
              onClick={() => {
                setUserRole('doctor');
                navigate('/doctor');
              }}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-colors cursor-pointer"
            >
              Doctor Hub →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Screenings Table */}
      <div className="bg-white border border-gray-200 rounded-xl card-shadow overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Recent Field Screenings</h2>
            <p className="text-xs text-gray-400">Cases processed today at Khed PHC screening unit</p>
          </div>
          <button
            onClick={() => navigate('/queue')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            View All Patients ({patients.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Eye Quality</th>
                <th className="px-4 py-3">DR Severity</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Referable</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.slice(0, 5).map(p => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.imageQuality.overall === 'gradable' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {p.imageQuality.score}% {p.imageQuality.overall}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${DR_LEVEL_BG_BADGES[p.drLevel]}`}>
                      L{p.drLevel} · {p.drLabel.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">{p.confidence}%</td>
                  <td className="px-4 py-3">
                    {p.referable ? (
                      <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        Referable
                      </span>
                    ) : (
                      <span className="text-gray-400">Non-referable</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ReviewStatusBadge status={p.reviewStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight size={15} className="text-gray-400 group-hover:text-blue-600 inline" />
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
