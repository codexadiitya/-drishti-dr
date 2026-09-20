import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight, Eye, ShieldCheck, UserCheck } from 'lucide-react';
import { Badge, ReviewStatusBadge } from '../components/ui/primitives';
import { useAppState } from '../context/AppStateContext';
import { DR_LEVEL_LABELS, DR_LEVEL_BG_BADGES } from '../lib/types';

type FilterKey = 'all' | 'pending' | 'referable' | 'non-referable' | 'recapture' | 'high-confidence' | 'low-confidence';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Cases' },
  { key: 'pending', label: 'Awaiting Review' },
  { key: 'referable', label: 'Referable DR (Level 2+)' },
  { key: 'non-referable', label: 'Non-Referable' },
  { key: 'recapture', label: 'Recapture Required' },
  { key: 'high-confidence', label: 'High Confidence (≥90%)' },
  { key: 'low-confidence', label: 'Uncertain / Priority Review' },
];

export function ScreeningQueue() {
  const navigate = useNavigate();
  const { patients, userRole } = useAppState();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p => {
    const matchesSearch =
      search === '' ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    switch (filter) {
      case 'pending':
        return p.reviewStatus === 'pending';
      case 'referable':
        return p.referable;
      case 'non-referable':
        return !p.referable && p.aiStatus === 'complete';
      case 'recapture':
        return p.reviewStatus === 'recapture';
      case 'high-confidence':
        return p.confidence >= 90;
      case 'low-confidence':
        return p.confidence > 0 && p.confidence < 85;
      default:
        return true;
    }
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Screening Cases Repository</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} patients loaded · Central tele-ophthalmology database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/screening/new')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            + New Screening
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm card-shadow text-xs">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or patient name…"
            className="bg-transparent text-xs text-gray-800 outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium ${
                filter === f.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'text-gray-600 border-gray-200 hover:bg-gray-50 bg-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Exam Date / PHC</th>
                <th className="px-4 py-3">Image Quality</th>
                <th className="px-4 py-3">DR Severity</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Referable</th>
                <th className="px-4 py-3">Doctor Review</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  onClick={() => {
                    if (userRole === 'doctor') {
                      navigate(`/doctor/review/${p.id}`);
                    } else {
                      navigate(`/patients/${p.id}`);
                    }
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-bold font-mono text-gray-900">{p.id}</div>
                    <div className="text-[11px] text-gray-500">{p.name} · {p.age}y {p.gender}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{p.screeningDate} {p.screeningTime}</div>
                    <div className="text-[10px] text-gray-400">{p.phcLocation || 'Khed PHC'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.imageQuality.overall === 'gradable' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {p.imageQuality.score}% {p.imageQuality.overall}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${DR_LEVEL_BG_BADGES[p.drLevel]}`}>
                      L{p.drLevel} · {p.drLabel.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-gray-800">
                    {p.confidence}%
                  </td>
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
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/doctor/review/${p.id}`);
                        }}
                        className="px-2.5 py-1 rounded bg-gray-100 hover:bg-blue-600 hover:text-white font-bold text-[11px] text-gray-700 transition-colors"
                      >
                        Review
                      </button>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600" />
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
