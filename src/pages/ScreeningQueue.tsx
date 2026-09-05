import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Badge, ReviewStatusBadge, AIStatusBadge, QualityBadge, ConfidenceMeter } from '../components/ui/primitives';
import { MOCK_PATIENTS } from '../lib/mockData';
import { DR_LEVEL_LABELS } from '../lib/types';
import type { ReviewStatus } from '../lib/types';

type FilterKey = 'all' | 'pending' | 'referable' | 'non-referable' | 'recapture' | 'high-confidence' | 'low-confidence';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Awaiting Review' },
  { key: 'referable', label: 'Referable' },
  { key: 'non-referable', label: 'Non-Referable' },
  { key: 'recapture', label: 'Recapture Required' },
  { key: 'high-confidence', label: 'High Confidence' },
  { key: 'low-confidence', label: 'Low Confidence' },
];

export function ScreeningQueue() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PATIENTS.filter(p => {
    const matchesSearch = search === '' || p.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    switch (filter) {
      case 'pending': return p.reviewStatus === 'pending';
      case 'referable': return p.referable;
      case 'non-referable': return !p.referable && p.aiStatus === 'complete';
      case 'recapture': return p.reviewStatus === 'recapture';
      case 'high-confidence': return p.confidence >= 90;
      case 'low-confidence': return p.confidence > 0 && p.confidence < 85;
      default: return true;
    }
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Patient Queue</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} cases · Demo data</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer card-shadow">
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* Search + filter strip */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-xs card-shadow">
          <Search size={13} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient ID…"
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer font-medium ${
                filter === f.key
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700 bg-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Patient ID', 'Time', 'Image Quality', 'DR Level', 'Confidence', 'Referable', 'AI Status', 'Review Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/patients/${p.id}`)}
                >
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{p.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-400 font-mono">{p.screeningTime}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <QualityBadge status={p.imageQuality.overall} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <span className="text-xs text-gray-700 block">{DR_LEVEL_LABELS[p.drLevel]}</span>
                      {p.drLevel > 0 && p.aiStatus === 'complete' && (
                        <span className={`text-[10px] font-mono ${
                          p.drLevel >= 3 ? 'text-red-500' : p.drLevel >= 2 ? 'text-amber-500' : 'text-yellow-500'
                        }`}>Level {p.drLevel}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {p.aiStatus === 'complete' && p.confidence > 0 ? (
                      <div className="w-28 space-y-0.5">
                        <ConfidenceMeter value={p.confidence} showLabel={false} size="sm" />
                        <span className="text-[10px] font-mono text-gray-400">{p.confidence.toFixed(1)}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {p.aiStatus === 'complete' ? (
                      <Badge variant={p.referable ? 'danger' : 'success'} dot={false} size="sm">
                        {p.referable ? 'YES' : 'NO'}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <AIStatusBadge status={p.aiStatus} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ReviewStatusBadge status={p.reviewStatus} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No cases match the current filter.</div>
        )}
      </div>
    </div>
  );
}
