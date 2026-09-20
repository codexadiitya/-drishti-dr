import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, CheckCircle2, Info, AlertTriangle, Eye,
  Sparkles, Layers, ShieldCheck, ChevronLeft, ArrowRight,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { FundusViewer, type OverlayMode } from '../components/ui/FundusViewer';
import { Badge, ConfidenceMeter } from '../components/ui/primitives';
import { DR_LEVEL_LABELS, DR_LEVEL_BG_BADGES } from '../lib/types';

export function Explainability() {
  const navigate = useNavigate();
  const { patients, activePatientId, setActivePatientId } = useAppState();

  const [selectedId, setSelectedId] = useState(activePatientId || patients[0]?.id || 'PT-10021');
  const patient = patients.find(p => p.id === selectedId) || patients[0];

  const [selectedMode, setSelectedMode] = useState<OverlayMode>('gradcam');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <BrainCircuit size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Explainable AI & Visual Evidence</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Grad-CAM layer activation & spatial biomarker attribution for <strong className="text-gray-900 font-mono">{patient.id}</strong> ({patient.name})
          </p>
        </div>

        {/* Patient selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Case:</span>
          <select
            value={selectedId}
            onChange={e => {
              setSelectedId(e.target.value);
              setActivePatientId(e.target.value);
            }}
            className="text-xs font-semibold text-blue-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer card-shadow"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id}) · L{p.drLevel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transparent Disclaimer (Section 20 & 40) */}
      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-xs text-blue-950 space-y-1 card-shadow">
        <div className="flex items-center gap-2 font-bold">
          <Info size={16} className="text-blue-600 flex-shrink-0" />
          <span>Explainable AI Interpretation Protocol:</span>
        </div>
        <p className="text-blue-900 leading-relaxed pl-6">
          Grad-CAM heatmaps display gradient-weighted class activation mapping from the penultimate convolutional layer (Layer4). High activation (red) signifies retinal coordinates that contributed most strongly to the model's severity classification. It does not replace clinical bio-microscopy.
        </p>
      </div>

      {/* Main Grid: Interactive Viewer + Explainability Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Fundus Viewer with mode selectors */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Interactive Layer Visualization</h2>
              <p className="text-xs text-gray-500">Switch layers to isolate anatomy vs attention map</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${DR_LEVEL_BG_BADGES[patient.drLevel]}`}>
              L{patient.drLevel} · {patient.drLabel.split(' ')[0]}
            </span>
          </div>

          <FundusViewer
            defaultMode={selectedMode}
            eye={patient.eye === 'Both' ? 'OD' : (patient.eye || 'OD')}
            imageUrl={patient.imageUrl || '/clinical-fundus-bg.jpg'}
            enhancedImageUrl={patient.enhancedImageUrl}
            gradcamUrl={patient.gradcamUrl}
            onModeChange={m => setSelectedMode(m)}
          />

          {/* Heatmap Legend */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">Activation Gradient:</span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Low (0.0)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Baseline</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Mod (0.6)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Peak (1.0)</span>
            </div>
          </div>
        </div>

        {/* Right: Decision Rationalization & Biomarker Details */}
        <div className="lg:col-span-6 space-y-4">
          {/* Why Was This Case Flagged Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Why Was This Case Flagged?
              </h3>
              <span className="text-[11px] font-mono font-bold text-blue-700">
                Confidence: {patient.confidence}%
              </span>
            </div>

            <ul className="space-y-2 text-xs text-gray-700">
              {patient.whyFlagged?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <CheckCircle2 size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              )) || (
                <li className="text-gray-500 italic">No focal pathology detected. Healthy baseline retina.</li>
              )}
            </ul>
          </div>

          {/* Lesion Biomarkers Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Pathological Lesion Evidence Attribution
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800">Microaneurysms</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${patient.lesions.microaneurysms.detected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {patient.lesions.microaneurysms.detected ? 'Detected' : 'None'}
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Count: <strong>{patient.lesions.microaneurysms.count || 0}</strong> · Conf: {patient.lesions.microaneurysms.confidence}%
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800">Hemorrhages</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${patient.lesions.hemorrhages.detected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {patient.lesions.hemorrhages.detected ? 'Detected' : 'None'}
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Count: <strong>{patient.lesions.hemorrhages.count || 0}</strong> · Conf: {patient.lesions.hemorrhages.confidence}%
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800">Hard Exudates</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${patient.lesions.exudates.detected ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-700'}`}>
                    {patient.lesions.exudates.detected ? 'Detected' : 'None'}
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Count: <strong>{patient.lesions.exudates.count || 0}</strong> · Conf: {patient.lesions.exudates.confidence}%
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800">Neovascularization</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${patient.lesions.neovascularization.detected ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-700'}`}>
                    {patient.lesions.neovascularization.detected ? 'Detected (PDR)' : 'None'}
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Conf: <strong>{patient.lesions.neovascularization.confidence}%</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => navigate(`/doctor/review/${patient.id}`)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                Launch Fast Doctor Review (&lt;30s UX) <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
