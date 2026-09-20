import { useState } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, ShieldCheck, RefreshCw,
  Sparkles, HelpCircle, Eye, AlertOctagon, ArrowRight, ShieldAlert,
  ChevronRight, Sliders
} from 'lucide-react';
import type { ImageQuality } from '../../lib/types';
import type { QualityAssessmentResult } from '../../services/qualityGate';
import { QualityBar, Badge } from './primitives';

export type QualityState = 'GOOD' | 'POOR' | 'INVALID';

export interface QualityGateProps {
  quality: ImageQuality;
  assessment?: QualityAssessmentResult | null;
  onRecapture?: () => void;
  onProceed?: () => void;
  isAnalyzing?: boolean;
  canProceed?: boolean;
  enhancementApplied?: boolean;
  onToggleEnhancement?: (enhanced: boolean) => void;
  onSelectPreset?: (preset: 'good' | 'poor' | 'invalid') => void;
}

export function QualityGate({
  quality,
  assessment,
  onRecapture,
  onProceed,
  isAnalyzing = false,
  canProceed = true,
  enhancementApplied = false,
  onToggleEnhancement,
  onSelectPreset,
}: QualityGateProps) {
  // Determine 3-state classification
  let state: QualityState = 'GOOD';
  if (assessment) {
    state = assessment.qualityStatus;
  } else if (quality.overall === 'ungradable' || quality.score < 45 || quality.focus < 40) {
    state = quality.focus === 0 ? 'INVALID' : 'POOR';
  } else if (quality.score < 70) {
    state = 'POOR';
  } else {
    state = 'GOOD';
  }

  // If user applied enhancement in POOR state, upgrade to GOOD / ACCEPTED
  const effectiveState: QualityState = (state === 'POOR' && enhancementApplied) ? 'GOOD' : state;
  const isProceedAllowed = effectiveState === 'GOOD' && !isAnalyzing;

  // Derive scores
  const score = assessment?.qualityScore ?? (enhancementApplied ? Math.min(96, quality.score + 22) : quality.score);
  const sharpness = assessment?.sharpnessScore ?? (enhancementApplied ? Math.min(95, quality.focus + 20) : quality.focus);
  const illumination = assessment?.illuminationScore ?? (enhancementApplied ? Math.min(94, quality.illumination + 25) : quality.illumination);
  const contrast = assessment?.contrastScore ?? 84;
  const fov = assessment?.fieldOfViewScore ?? quality.fieldOfView;

  // Issues list
  const issues: string[] = assessment?.detectedIssues?.length
    ? assessment.detectedIssues
    : effectiveState === 'INVALID'
    ? ['No retinal fundus pigmentation signature found', 'Optic disc / vascular branching absent', 'Non-retinal subject matter']
    : effectiveState === 'POOR'
    ? [
        quality.focus < 60 ? 'Optical blur / patient micro-saccade' : '',
        quality.illumination < 60 ? 'Sub-optimal illumination in nasal quadrant' : '',
        quality.fieldOfView < 65 ? 'Macular arcade partially clipped at frame boundary' : '',
      ].filter(Boolean)
    : [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 card-shadow space-y-4">
      {/* Header matching Screenshot 2 & 3 */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            effectiveState === 'GOOD'
              ? 'bg-emerald-50 text-emerald-600'
              : effectiveState === 'POOR'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-rose-50 text-rose-600'
          }`}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Trust-First Quality Gate</h3>
            <p className="text-[11px] text-gray-500">
              Automated pre-inference gradability validation
            </p>
          </div>
        </div>

        {/* Status Pill matching Screenshot 2 & 3 */}
        <div>
          {effectiveState === 'GOOD' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Gradable
            </span>
          )}
          {effectiveState === 'POOR' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Poor Quality
            </span>
          )}
          {effectiveState === 'INVALID' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Invalid Non-Fundus
            </span>
          )}
        </div>
      </div>

      {/* Optical Metrics Breakdown matching Screenshot 2 & 3 */}
      <div className="space-y-3 pt-1">
        <div>
          <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
            <span>Focus Sharpness</span>
            <span className="font-mono text-gray-900 font-bold">{sharpness}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                sharpness >= 70 ? 'bg-emerald-500' : sharpness >= 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, sharpness))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
            <span>Illumination Uniformity</span>
            <span className="font-mono text-gray-900 font-bold">{illumination}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                illumination >= 70 ? 'bg-emerald-500' : illumination >= 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, illumination))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
            <span>Field of View (FoV)</span>
            <span className="font-mono text-gray-900 font-bold">{fov}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                fov >= 70 ? 'bg-emerald-500' : fov >= 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, fov))}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-700">Overall Quality Index</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-black font-mono ${
              effectiveState === 'GOOD' ? 'text-emerald-600' : effectiveState === 'POOR' ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {score}%
            </span>
            <span className="text-[10px] text-gray-400 font-mono">(≥70% required)</span>
          </div>
        </div>
      </div>

      {/* Main Status Notice matching Screenshot 2 & 3 */}
      {effectiveState === 'GOOD' && (
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-900">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>Image is clinically gradable</span>
          </div>
          <p className="text-emerald-800 text-[11px] leading-relaxed pl-5">
            Retinal landmarks (optic disc and macula) are adequately resolved for AI-assisted diabetic retinopathy feature extraction.
          </p>
        </div>
      )}

      {effectiveState === 'POOR' && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>Sub-optimal Optical Quality — DR Prediction Blocked</span>
          </div>
          <p className="text-amber-800 text-[11px] leading-relaxed pl-5">
            Blur or uneven illumination detected. Recapture recommended or apply automated enhancement below.
          </p>
        </div>
      )}

      {effectiveState === 'INVALID' && (
        <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-900">
          <div className="flex items-center gap-1.5 font-bold text-rose-950">
            <AlertOctagon size={15} className="text-rose-600 shrink-0" />
            <span>Non-Retinal Subject / Invalid Image</span>
          </div>
          <p className="text-rose-800 text-[11px] leading-relaxed pl-5">
            Image lacks retinal fundus vascular architecture and disc landmarks. Please upload an authentic eye photo.
          </p>
        </div>
      )}

      {/* Adaptive Enhancement Banner matching Screenshot 3 */}
      <div className="flex items-center justify-between p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-blue-600 shrink-0" />
          <span className="text-[11px]">
            <strong className="text-blue-950">Adaptive Enhancement (CLAHE):</strong> Illumination normalized & denoised
          </span>
        </div>
        {onToggleEnhancement && (
          <button
            type="button"
            onClick={() => onToggleEnhancement(!enhancementApplied)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
              enhancementApplied
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
            }`}
          >
            {enhancementApplied ? 'Active ✓' : 'Enable'}
          </button>
        )}
      </div>

      {/* Quick Test Presets */}
      {onSelectPreset && (
        <div className="pt-1 flex items-center justify-between gap-1.5 text-[10px] text-gray-500">
          <span className="flex items-center gap-1 font-semibold">
            <Sliders size={11} className="text-blue-600" /> Presets:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectPreset('good')}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 cursor-pointer font-medium"
            >
              1. Good (93%)
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset('poor')}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-amber-50 hover:text-amber-700 border border-gray-200 cursor-pointer font-medium"
            >
              2. Blurry (52%)
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset('invalid')}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 cursor-pointer font-medium"
            >
              3. Invalid (16%)
            </button>
          </div>
        </div>
      )}

      {/* CTA Action Button matching Screenshot 3: "Send to AI Model ->" */}
      <div className="pt-2 space-y-2">
        <div className="flex gap-2">
          {onRecapture && effectiveState !== 'GOOD' && (
            <button
              type="button"
              onClick={onRecapture}
              className="w-1/3 py-2.5 px-3 rounded-xl font-bold text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} />
              Recapture
            </button>
          )}

          {onProceed && (
            <button
              type="button"
              onClick={onProceed}
              disabled={!isProceedAllowed}
              className={`w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                isProceedAllowed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-[0.99]'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={15} className="animate-spin text-white" />
                  Running AI Model…
                </>
              ) : (
                <>
                  Send to AI Model →
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
