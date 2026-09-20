import { Eye, AlertTriangle, CheckCircle2, ShieldCheck, MapPin, Activity, HelpCircle } from 'lucide-react';
import type { Patient, Lesions, RetinalStructures } from '../../lib/types';
import { Badge, ConfidenceMeter } from './primitives';

interface ClinicalEvidenceProps {
  patient: Patient;
  onSelectOverlay?: (mode: 'vessel' | 'lesion' | 'gradcam') => void;
}

export function ClinicalEvidence({ patient, onSelectOverlay }: ClinicalEvidenceProps) {
  const { lesions, retinalStructures, whyFlagged, drLevel, drLabel, confidence, confidenceTier } = patient;

  return (
    <div className="space-y-4">
      {/* Why This Case Was Flagged box (Section 21) */}
      <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/80 border border-blue-200 rounded-xl p-4 card-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <HelpCircle size={15} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Why This Case Was Flagged</h3>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
            Doctor-in-the-Loop Summary
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 bg-white/80 p-2.5 rounded-lg border border-blue-100 text-xs">
          <div>
            <span className="text-[10px] text-gray-500 uppercase">Image Quality</span>
            <div className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={12} /> {patient.imageQuality.overall === 'gradable' ? 'Gradable (91%)' : 'Ungradable'}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase">DR Prediction</span>
            <div className="font-bold text-gray-900 mt-0.5">Level {drLevel} · {drLabel.split(' ')[0]}</div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase">Confidence</span>
            <div className="font-bold text-blue-700 font-mono mt-0.5">{confidence}%</div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase">Review Tier</span>
            <div className="font-semibold text-gray-800 capitalize mt-0.5">
              {confidenceTier || 'Standard'} Review
            </div>
          </div>
        </div>

        {/* Clinical Evidence Points */}
        <div className="space-y-1.5 text-xs text-gray-800">
          <p className="font-semibold text-gray-900 text-[11px] uppercase tracking-wide">Key Supporting Biomarkers:</p>
          {whyFlagged && whyFlagged.length > 0 ? (
            <ul className="space-y-1">
              {whyFlagged.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No focal pathological lesions flagged. Retinal baseline clean.</p>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-blue-200/70 flex items-center justify-between text-xs">
          <span className="text-gray-600">Recommended Action:</span>
          <span className="font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
            {patient.referable ? 'Ophthalmologist Dilated Evaluation Required' : 'Annual Tele-Screening Follow-up'}
          </span>
        </div>
      </div>

      {/* Retinal Structures Panel (Section 16) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 card-shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-blue-600" />
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Retinal Structure Localization</h4>
          </div>
          {onSelectOverlay && (
            <button
              onClick={() => onSelectOverlay('vessel')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              View Structure Overlay →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-gray-800">Optic Disc</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${retinalStructures.opticDisc.detected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {retinalStructures.opticDisc.detected ? 'Detected' : 'Not Found'}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-1">
              <MapPin size={11} /> {retinalStructures.opticDisc.location}
            </div>
            <div className="mt-2">
              <ConfidenceMeter value={retinalStructures.opticDisc.confidence} size="sm" />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-gray-800">Fovea / Macula</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${retinalStructures.fovea.detected ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {retinalStructures.fovea.detected ? 'Detected' : 'Not Found'}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-1">
              <MapPin size={11} /> {retinalStructures.fovea.location}
            </div>
            <div className="mt-2">
              <ConfidenceMeter value={retinalStructures.fovea.confidence} size="sm" />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-gray-800">Retinal Vessels</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${retinalStructures.vessels.segmented ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                {retinalStructures.vessels.segmented ? 'Segmented' : 'Pending'}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Caliper & arcade network
            </div>
            <div className="mt-2">
              <ConfidenceMeter value={retinalStructures.vessels.confidence} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Lesion Evidence Panel (Section 17) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 card-shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Pathological Lesion Evidence</h4>
          </div>
          {onSelectOverlay && (
            <button
              onClick={() => onSelectOverlay('lesion')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              View Lesion Markers →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              name: 'Microaneurysms (Sub-Pixel)',
              item: lesions.microaneurysms,
              color: 'border-l-4 border-l-red-500',
              info: 'Sub-pixel focal dilatations isolated via multiscale Hessian/top-hat filtering',
            },
            {
              name: 'Hemorrhages',
              item: lesions.hemorrhages,
              color: 'border-l-4 border-l-rose-500',
              info: 'Dot-blot and flame intraretinal bleeding',
            },
            {
              name: 'Hard Exudates',
              item: lesions.exudates,
              color: 'border-l-4 border-l-yellow-500',
              info: 'Lipid and protein deposits from vascular leakage',
            },
            {
              name: 'Neovascularization',
              item: lesions.neovascularization,
              color: 'border-l-4 border-l-purple-500',
              info: 'Fragile new vessels — hallmark of PDR (Level 4)',
            },
          ].map(({ name, item, color, info }) => (
            <div key={name} className={`p-3.5 bg-gray-50 rounded-lg border border-gray-100 ${color}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900">{name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.detected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {item.detected ? 'Detected' : 'Not Detected'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">{info}</p>
              
              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200/60">
                {item.detected && item.count !== undefined ? (
                  <span className="font-mono text-gray-700">
                    Count: <strong className="text-gray-900">{item.count}</strong>
                  </span>
                ) : (
                  <span className="text-gray-400 font-mono">Count: 0</span>
                )}
                <div className="w-24">
                  <ConfidenceMeter value={item.confidence} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
