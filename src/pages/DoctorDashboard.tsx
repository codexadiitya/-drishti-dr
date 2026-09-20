import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Clock, AlertTriangle, CheckCircle2, RefreshCw,
  Search, SlidersHorizontal, ChevronRight, ShieldCheck,
  UserCheck, ArrowUpRight,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { Badge, ConfidenceMeter, ReviewStatusBadge } from '../components/ui/primitives';
import { KPICard } from '../components/ui/KPICard';
import { DR_LEVEL_LABELS, DR_LEVEL_BG_BADGES } from '../lib/types';

export function DoctorDashboard() {
  const navigate = useNavigate();
  const { patients } = useAppState();
  const [filter, setFilter] = useState<'pending' | 'reviewed' | 'referable' | 'recapture' | 'all'>('pending');
  const [search, setSearch] = useState('');

  const pendingList = patients.filter(p => p.reviewStatus === 'pending');
  const reviewedList = patients.filter(p => p.reviewStatus === 'reviewed' || p.reviewStatus === 'referred');
  const referableList = patients.filter(p => p.referable);
  const recaptureList = patients.filter(p => p.reviewStatus === 'recapture');

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      search === '' ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'pending') return p.reviewStatus === 'pending';
    if (filter === 'reviewed') return p.reviewStatus === 'reviewed' || p.reviewStatus === 'referred';
    if (filter === 'referable') return p.referable;
    if (filter === 'recapture') return p.reviewStatus === 'recapture';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Stethoscope size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Ophthalmology Review Workspace</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Doctor-in-the-Loop review queue · <span className="font-semibold text-blue-700">AI assists. Doctor decides.</span>
          </p>
        </div>

        {pendingList.length > 0 && (
          <button
            onClick={() => navigate(`/doctor/review/${pendingList[0].id}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex-shrink-0"
          >
            <Clock size={15} />
            Start Next Review ({pendingList[0].id}) →
          </button>
        )}
      </div>

      {/* KPI Cards (Section 23) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filter === 'pending' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200' : 'bg-white border-gray-200 card-shadow'
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold">Pending Reviews</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">{pendingList.length}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">Action required</div>
        </div>

        <div
          onClick={() => setFilter('reviewed')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filter === 'reviewed' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200' : 'bg-white border-gray-200 card-shadow'
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold">Reviewed Today</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">{reviewedList.length}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">Validated decisions</div>
        </div>

        <div
          onClick={() => setFilter('referable')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filter === 'referable' ? 'bg-red-50/80 border-red-300 ring-2 ring-red-200' : 'bg-white border-gray-200 card-shadow'
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold">Referable Cases</span>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 font-mono">{referableList.length}</div>
          <div className="text-[11px] text-red-700 mt-1 font-medium">Level 2+ requiring specialist</div>
        </div>

        <div
          onClick={() => setFilter('recapture')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filter === 'recapture' ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-200' : 'bg-white border-gray-200 card-shadow'
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold">Recapture Required</span>
            <RefreshCw size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-700 font-mono">{recaptureList.length}</div>
          <div className="text-[11px] text-purple-700 mt-1 font-medium">Quality Gate rejections</div>
        </div>
      </div>

      {/* Review Queue with Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-xl card-shadow overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or patient name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-800"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'pending', label: `Pending (${pendingList.length})` },
              { id: 'referable', label: `Referable (${referableList.length})` },
              { id: 'reviewed', label: `Reviewed (${reviewedList.length})` },
              { id: 'recapture', label: `Recapture (${recaptureList.length})` },
              { id: 'all', label: `All (${patients.length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">AI Prediction</th>
                <th className="px-4 py-3">Confidence Tier</th>
                <th className="px-4 py-3">Quality</th>
                <th className="px-4 py-3">Review Status</th>
                <th className="px-4 py-3">Referable</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map(p => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/doctor/review/${p.id}`)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900 font-mono">{p.id}</div>
                    <div className="text-[11px] text-gray-500">{p.name} · {p.age}y {p.gender}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${DR_LEVEL_BG_BADGES[p.drLevel]}`}>
                      L{p.drLevel} · {p.drLabel.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">{p.confidence}%</span>
                      <span className="text-[10px] text-gray-400 capitalize">({p.confidenceTier || 'standard'})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.imageQuality.overall === 'gradable' ? 'success' : 'danger'}>
                      {p.imageQuality.score}% {p.imageQuality.overall}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ReviewStatusBadge status={p.reviewStatus} />
                  </td>
                  <td className="px-4 py-3">
                    {p.referable ? (
                      <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        Referable
                      </span>
                    ) : (
                      <span className="text-gray-500">Non-referable</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/doctor/review/${p.id}`);
                      }}
                      className="px-3 py-1 bg-white group-hover:bg-blue-600 text-gray-700 group-hover:text-white border border-gray-200 group-hover:border-blue-600 rounded-lg font-bold transition-all text-xs"
                    >
                      Review →
                    </button>
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
