import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Info, AlertTriangle, BrainCircuit } from 'lucide-react';
import { Badge, ConfidenceMeter } from '../components/ui/primitives';
import { FundusViewer, FundusImage } from '../components/ui/FundusViewer';
import type { OverlayMode } from '../components/ui/FundusViewer';
import { MOCK_PATIENTS } from '../lib/mockData';

const patient = MOCK_PATIENTS[0]; // PT-10021

const AI_REASONING = [
  { rank: 1, text: 'Multiple microaneurysm-like regions detected in the pericentral retina, consistent with early vascular leakage.', severity: 'high' },
  { rank: 2, text: 'Scattered retinal hemorrhage patterns identified in the inferior temporal quadrant.', severity: 'high' },
  { rank: 3, text: 'Exudative changes observed near the macular region, suggesting lipid deposition.', severity: 'medium' },
  { rank: 4, text: 'Anatomical context around the macular region and optic disc shows no signs of proliferative changes.', severity: 'low' },
];

const CLINICAL_CRITERIA: { label: string; met: boolean; note: string }[] = [
  { label: 'Microaneurysms present', met: true, note: '≥3 microaneurysms in one or more quadrants' },
  { label: 'Intraretinal hemorrhages', met: true, note: '≥6 hemorrhages in all 4 quadrants' },
  { label: 'Hard exudates near fovea', met: true, note: 'Macular involvement suspected' },
  { label: 'Soft exudates (cotton wool)', met: false, note: 'No cotton wool spots identified' },
  { label: 'No neovascularization', met: true, note: 'No proliferative changes — not PDR' },
  { label: 'Referable (Level 2+)', met: true, note: 'Meets referral threshold per ICDR scale' },
];

const HEATMAP_LEGEND = [
  { color: 'bg-red-500', label: 'High activation' },
  { color: 'bg-orange-500', label: 'Medium-high' },
  { color: 'bg-yellow-400', label: 'Medium' },
  { color: 'bg-green-500', label: 'Low activation' },
];

export function Explainability() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<OverlayMode>('gradcam');
  const [opacity, setOpacity] = useState(0.7);
  const [selectedReason, setSelectedReason] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <BrainCircuit size={18} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Explainability</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Visual evidence associated with model prediction for <span className="font-mono text-cyan-400">PT-10021</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Confidence</p>
            <p className="text-xl font-semibold font-mono text-cyan-400">{patient.confidence}%</p>
          </div>
          <Badge variant="danger" size="md" dot>Referable DR Level 2</Badge>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/80 leading-relaxed">
          <strong className="text-amber-300">Explainability disclaimer:</strong> Grad-CAM visualizations show regions the model associated with its prediction — not regions definitively containing pathology. These are model-internal activation maps and should be interpreted by a qualified ophthalmologist. This is a demonstration prototype.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Interactive viewer */}
        <div className="space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-200">Grad-CAM Attention Map</h2>
              <Badge variant="info">Grad-CAM v2</Badge>
            </div>

            {/* Mode buttons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(['original', 'enhanced', 'gradcam', 'lesion', 'vessel', 'combined'] as OverlayMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer capitalize ${
                    selectedMode === m
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                      : 'text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {m === 'gradcam' ? 'Grad-CAM' : m === 'lesion' ? 'Lesion Overlay' : m === 'vessel' ? 'Vessel Overlay' : m === 'combined' ? 'Combined' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* Opacity control */}
            {(selectedMode === 'gradcam' || selectedMode === 'combined') && (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] text-slate-500 font-mono">Opacity</span>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={Math.round(opacity * 100)}
                  onChange={e => setOpacity(Number(e.target.value) / 100)}
                  className="flex-1 max-w-28 accent-cyan-500"
                />
                <span className="text-[10px] text-slate-400 font-mono w-8">{Math.round(opacity * 100)}%</span>
              </div>
            )}

            {/* Fundus image */}
            <div className="rounded-xl overflow-hidden bg-black fundus-shadow aspect-square">
              <FundusImage mode={selectedMode} heatmapOpacity={opacity} />
            </div>

            {/* Heatmap legend */}
            {(selectedMode === 'gradcam' || selectedMode === 'combined') && (
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[10px] text-slate-500">Low activation</span>
                <div className="flex gap-1 flex-1 mx-3">
                  {HEATMAP_LEGEND.map(({ color }) => (
                    <div key={color} className={`flex-1 h-1.5 rounded-full ${color}`} />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500">High activation</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Reasoning + Criteria */}
        <div className="space-y-4">
          {/* AI Reasoning summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-3">AI Reasoning Summary</h2>
            <p className="text-xs text-slate-500 mb-3">Primary visual evidence associated with the model prediction:</p>
            <div className="space-y-2">
              {AI_REASONING.map(r => (
                <div
                  key={r.rank}
                  onClick={() => setSelectedReason(selectedReason === r.rank ? null : r.rank)}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedReason === r.rank
                      ? 'bg-cyan-500/8 border-cyan-500/25'
                      : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    r.severity === 'high' ? 'bg-red-500/15 text-red-400' :
                    r.severity === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>{r.rank}</span>
                  <p className="text-xs text-slate-300 leading-relaxed flex-1">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical criteria alignment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-200">Clinical Criteria Alignment</h2>
              <Badge variant="neutral">ICDR Scale · Level 2</Badge>
            </div>
            <div className="space-y-2">
              {CLINICAL_CRITERIA.map(c => (
                <div key={c.label} className="flex items-start gap-3 py-2 border-b border-slate-800/60 last:border-0">
                  {c.met
                    ? <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    : <XCircle size={14} className="text-slate-600 mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${c.met ? 'text-slate-200' : 'text-slate-500'}`}>{c.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calibration */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-3">Model Calibration</h2>
            <div className="space-y-2">
              <ConfidenceMeter value={patient.confidence} size="md" />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Calibration</p>
                  <p className="text-xs text-emerald-400 font-medium mt-1">Validated</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">Held-out evaluation set</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Decision</p>
                  <p className="text-xs text-slate-300 font-medium mt-1">Referable threshold ≥ Level 2</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">ICDR clinical criteria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function XCircle({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
