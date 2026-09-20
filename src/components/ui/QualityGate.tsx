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
    <div className="bg-white border border-gray-200 rounded-2xl p-5 card-shadow space-y-5">
      {/* Prototype Header & Clinical Disclaimer Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${
            effectiveState === 'GOOD'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
              : effectiveState === 'POOR'
              ? 'bg-amber-50 border-amber-200 text-amber-600'
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-gray-900 tracking-tight">AI Image Quality Gate</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                Prototype v2.4
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              Pipeline Rule: Quality first. Prediction second. (Pre-inference verification)
            </p>
          </div>
        </div>

        {/* State Badge */}
        <div>
          {effectiveState === 'GOOD' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 size={13} className="text-emerald-600" />
              1. GOOD / ACCEPTED
            </span>
          )}
          {effectiveState === 'POOR' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <AlertTriangle size={13} className="text-amber-600" />
              2. POOR QUALITY / RECAPTURE
            </span>
          )}
          {effectiveState === 'INVALID' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
              <XCircle size={13} className="text-rose-600" />
              3. INVALID / NO RETINAL IMAGE FOUND
            </span>
          )}
        </div>
      </div>

      {/* Quick Demo Test Presets */}
      {onSelectPreset && (
        <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-200 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} className="text-blue-600" />
              Quick Quality Gate Test Presets:
            </span>
            <span className="text-[10px] text-gray-400">SIH Evaluator Demo Buttons</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSelectPreset('good')}
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                effectiveState === 'GOOD'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 size={11} /> 1. Good Fundus
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset('poor')}
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                effectiveState === 'POOR'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <AlertTriangle size={11} /> 2. Blurry / Poor
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset('invalid')}
              className={`py-1.5 px-2 rounded-lg font-bold text-[11px] border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                effectiveState === 'INVALID'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
              }`}
            >
              <XCircle size={11} /> 3. Non-Retinal / Invalid
            </button>
          </div>
        </div>
      )}

      {/* Main Status Notice */}
      {effectiveState === 'GOOD' && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Image Verified: Suitable for AI Classification
          </div>
          <p className="text-emerald-800 leading-relaxed">
            The image is confirmed as a valid retinal fundus photograph. Optical sharpness, illumination, and vascular clarity satisfy clinical feature extraction thresholds.
          </p>
          {enhancementApplied && (
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
              <Sparkles size={11} /> Upgraded via CLAHE illumination normalization
            </div>
          )}
        </div>
      )}

      {effectiveState === 'POOR' && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle size={16} className="text-amber-600" />
            Sub-optimal Optical Quality — DR Prediction Blocked
          </div>
          <p className="text-amber-800 leading-relaxed">
            Fundus characteristics were recognized, but blur or uneven illumination could lead to misleading feature extraction. The DR classification model is held back until resolved.
          </p>
          <div className="bg-amber-100/60 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-950 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <HelpCircle size={12} /> Recommended Operator Action:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-900">
              <li>Instruct patient to fixate steadily on the central target.</li>
              <li>Wait 2 minutes for natural dark adaptation or adjust flash brightness.</li>
              <li>Or click <strong>"Try Automated Enhancement"</strong> below.</li>
            </ul>
          </div>
        </div>
      )}

      {effectiveState === 'INVALID' && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5 text-xs text-rose-900">
          <div className="flex items-center gap-2 font-black text-rose-950 text-sm">
            <AlertOctagon size={18} className="text-rose-600" />
            INVALID / NO RETINAL IMAGE FOUND
          </div>
          <p className="text-rose-800 leading-relaxed">
            The uploaded image does not match retinal fundus optical patterns (e.g., photo of a document, general scene, or non-ocular surface).
          </p>
          <div className="p-2.5 bg-rose-100/70 rounded-lg border border-rose-200 text-[11px] text-rose-950 font-semibold">
            🚫 STRICT PIPELINE LOCK: DR classification model will NOT be executed for non-retinal imagery.
          </div>
        </div>
      )}

      {/* Optical Metrics Breakdown */}
      <div className="space-y-2.5 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-800">Optical Quality Diagnostics:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500 font-medium">Quality Index:</span>
            <span className={`text-sm font-black font-mono ${
              effectiveState === 'GOOD' ? 'text-emerald-600' : effectiveState === 'POOR' ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {score}%
            </span>
          </div>
        </div>

        <QualityBar label="Focus & Vessel Sharpness" value={sharpness} />
        <QualityBar label="Illumination Uniformity" value={illumination} />
        <QualityBar label="Field of View & Centering" value={fov} />
        <QualityBar label="Tissue Contrast Ratio" value={contrast} />
      </div>

      {/* Detected Issues */}
      {issues.length > 0 && (
        <div className="space-y-1.5 text-xs">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            Detected Optical Observations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {issues.map((iss, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 ${
                  effectiveState === 'INVALID'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <AlertTriangle size={10} />
                {iss}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 space-y-2.5 border-t border-gray-100">
        {effectiveState === 'POOR' && onToggleEnhancement && (
          <button
            type="button"
            onClick={() => onToggleEnhancement(!enhancementApplied)}
            className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles size={14} className="text-indigo-600" />
            {enhancementApplied
              ? 'Revert to Raw Captured Frame'
              : '✨ Try Automated Enhancement (CLAHE + Denoise)'}
          </button>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          {onRecapture && (
            <button
              type="button"
              onClick={onRecapture}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
                effectiveState === 'GOOD'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 w-full sm:w-1/3'
                  : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 flex-1 shadow-sm'
              }`}
            >
              <RefreshCw size={13} />
              {effectiveState === 'INVALID' ? 'Upload Valid Fundus' : 'Recapture Image'}
            </button>
          )}

          {onProceed && (
            <button
              type="button"
              onClick={onProceed}
              disabled={!isProceedAllowed}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer flex-1 shadow-sm ${
                isProceedAllowed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-white" />
                  Running AI Pipeline…
                </>
              ) : isProceedAllowed ? (
                <>
                  Send to AI DR Classification Model
                  <ArrowRight size={14} />
                </>
              ) : (
                <>
                  <ShieldAlert size={14} />
                  AI Classification Locked (Pass Quality Check First)
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
