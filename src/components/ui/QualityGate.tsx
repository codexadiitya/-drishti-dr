import { CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Eye, Sparkles, HelpCircle } from 'lucide-react';
import type { ImageQuality } from '../../lib/types';
import { QualityBar, Badge } from './primitives';

interface QualityGateProps {
  quality: ImageQuality;
  onRecapture?: () => void;
  onProceed?: () => void;
  isAnalyzing?: boolean;
  canProceed?: boolean;
  enhancementApplied?: boolean;
  onToggleEnhancement?: () => void;
}

export function QualityGate({
  quality,
  onRecapture,
  onProceed,
  isAnalyzing = false,
  canProceed = true,
  enhancementApplied = true,
  onToggleEnhancement,
}: QualityGateProps) {
  const isGradable = quality.overall === 'gradable' || quality.score >= 70;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isGradable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Trust-First Quality Gate</h3>
            <p className="text-[11px] text-gray-500">Automated pre-inference gradability validation</p>
          </div>
        </div>
        <Badge variant={isGradable ? 'success' : 'danger'} dot>
          {isGradable ? 'Gradable Image' : 'Ungradable'}
        </Badge>
      </div>

      {/* Metrics */}
      <div className="space-y-3 bg-gray-50 p-3.5 rounded-lg border border-gray-100">
        <QualityBar label="Focus Sharpness" value={quality.focus} />
        <QualityBar label="Illumination Uniformity" value={quality.illumination} />
        <QualityBar label="Field of View (FoV)" value={quality.fieldOfView} />

        <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">Overall Quality Index</span>
          <div className="flex items-center gap-2">
            <span className={`text-base font-bold font-mono ${isGradable ? 'text-emerald-600' : 'text-red-600'}`}>
              {quality.score}%
            </span>
            <span className="text-[10px] text-gray-400">({isGradable ? '≥70% Required' : '<70% Minimum'})</span>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {isGradable ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">✓ Image is clinically gradable</p>
              <p className="text-emerald-800 mt-0.5 leading-relaxed">
                Retinal landmarks (optic disc and macula) are adequately resolved for AI-assisted diabetic retinopathy feature extraction.
              </p>
            </div>
          </div>

          {/* Enhancement UI */}
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-600" />
              <div>
                <span className="font-semibold text-gray-900">Adaptive Enhancement (CLAHE):</span>
                <span className="text-gray-600 ml-1">Illumination normalized & denoised</span>
              </div>
            </div>
            {onToggleEnhancement && (
              <button
                type="button"
                onClick={onToggleEnhancement}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                {enhancementApplied ? 'View Original' : 'Apply CLAHE'}
              </button>
            )}
          </div>

          {onProceed && (
            <button
              onClick={onProceed}
              disabled={isAnalyzing || !canProceed}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Running AI Analysis…
                </>
              ) : (
                'Send to AI Model →'
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2 text-xs text-red-900">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
              <span className="font-bold text-red-950">IMAGE NOT RELIABLE — AI Analysis Blocked</span>
            </div>
            <p className="text-red-800 leading-relaxed">
              {quality.reason || 'Image quality index is insufficient for safe medical feature extraction. Submitting this image could lead to false negatives.'}
            </p>
            
            <div className="mt-2 pt-2 border-t border-red-200/60">
              <span className="font-semibold text-red-950 flex items-center gap-1 mb-1">
                <HelpCircle size={13} /> Smart Recapture Guidance:
              </span>
              <ul className="list-disc list-inside text-red-800 space-y-1">
                {quality.focus < 60 && <li><strong>Poor Focus:</strong> Hold the camera steady, ensure patient does not blink, and refocus.</li>}
                {quality.illumination < 60 && <li><strong>Poor Illumination:</strong> Allow 2 minutes for dark adaptation or pupil dilation, increase flash/LED intensity.</li>}
                {quality.fieldOfView < 60 && <li><strong>Incomplete FoV:</strong> Center the retina and guide patient's gaze towards the internal fixation target.</li>}
              </ul>
            </div>
          </div>

          {onRecapture && (
            <button
              onClick={onRecapture}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={15} /> Recapture Retinal Image
            </button>
          )}
        </div>
      )}
    </div>
  );
}
