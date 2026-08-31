import React from 'react';
import { ImageQualityGrade } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface QualityMeterProps {
  score: number; // 0..100
  grade: ImageQualityGrade;
  artifacts?: {
    motionBlur: number;
    unevenIllumination: number;
    cataractHaze: number;
    eyelashOcclusion: number;
    discCenteredCorrectly: boolean;
  };
  feedbackMessage?: string;
  showAdvice?: boolean;
}

export const QualityMeter: React.FC<QualityMeterProps> = ({
  score,
  grade,
  artifacts = {
    motionBlur: 0.05,
    unevenIllumination: 0.08,
    cataractHaze: 0.12,
    eyelashOcclusion: 0.0,
    discCenteredCorrectly: true
  },
  feedbackMessage = 'Optimal contrast and field centering for AI diagnostic analysis.',
  showAdvice = true
}) => {
  const gradeConfigs: Record<ImageQualityGrade, { label: string; icon: typeof CheckCircle2; bg: string; text: string; border: string }> = {
    GOOD: {
      label: 'Diagnostic Grade (Optimal)',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    USABLE: {
      label: 'Usable with Artifacts',
      icon: AlertTriangle,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800'
    },
    UNUSABLE: {
      label: 'Unusable - Retake Image',
      icon: XCircle,
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-800 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800'
    }
  };

  const config = gradeConfigs[grade] || gradeConfigs.GOOD;
  const Icon = config.icon;

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm space-y-4">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Image Quality Assessment
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Icon className={`h-5 w-5 ${grade === 'GOOD' ? 'text-emerald-600' : grade === 'USABLE' ? 'text-amber-600' : 'text-rose-600'}`} />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {config.label}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black font-mono text-teal-700 dark:text-teal-400">
            {score}
          </span>
          <span className="text-xs text-slate-400 font-semibold block">/ 100 Quality</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Artifact Diagnostics */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 block text-[11px]">Motion Blur</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {artifacts.motionBlur < 0.1 ? 'Minimal (Low)' : `${Math.round(artifacts.motionBlur * 100)}%`}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 block text-[11px]">Illumination Uniformity</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {artifacts.unevenIllumination < 0.15 ? 'Good (92%)' : `${Math.round((1 - artifacts.unevenIllumination) * 100)}%`}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 block text-[11px]">Lens/Cataract Haze</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {artifacts.cataractHaze > 0.2 ? 'Moderate Haze' : 'Clear Media'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 block text-[11px]">Disc & Macula Centering</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {artifacts.discCenteredCorrectly ? 'Correct 45° FOV' : 'Off-center'}
          </span>
        </div>
      </div>

      {/* Clinical Guidance Message */}
      {showAdvice && (
        <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{feedbackMessage}</p>
        </div>
      )}
    </div>
  );
};
