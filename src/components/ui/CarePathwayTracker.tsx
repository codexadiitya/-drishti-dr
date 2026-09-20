import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';

export type PathwayStep =
  | 'capture'
  | 'quality'
  | 'analysis'
  | 'grading'
  | 'evidence'
  | 'doctor_review'
  | 'decision'
  | 'referral'
  | 'followup';

interface CarePathwayTrackerProps {
  currentStep: PathwayStep;
  className?: string;
  isUngradable?: boolean;
}

const STEPS: { id: PathwayStep; label: string; shortLabel: string }[] = [
  { id: 'capture', label: '1. Retinal Capture', shortLabel: 'Capture' },
  { id: 'quality', label: '2. Quality Gate', shortLabel: 'Quality' },
  { id: 'analysis', label: '3. AI Analysis', shortLabel: 'AI Analysis' },
  { id: 'grading', label: '4. DR Severity', shortLabel: 'DR Grade' },
  { id: 'evidence', label: '5. Explainability', shortLabel: 'Evidence' },
  { id: 'doctor_review', label: '6. Doctor Review', shortLabel: 'Doc Review' },
  { id: 'decision', label: '7. Final Decision', shortLabel: 'Decision' },
  { id: 'referral', label: '8. Smart Referral', shortLabel: 'Referral' },
  { id: 'followup', label: '9. Care Follow-up', shortLabel: 'Follow-up' },
];

export function CarePathwayTracker({ currentStep, className = '', isUngradable = false }: CarePathwayTrackerProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 card-shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Complete Care Pathway</span>
          <span className="text-[11px] text-gray-500 ml-2 hidden sm:inline">Screen → Explain → Doctor Decision → Referral → Care</span>
        </div>
        <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
          Step {currentIndex + 1} of {STEPS.length}
        </span>
      </div>

      {/* Progress track */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-[650px] sm:min-w-0">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            let stepBadge = 'bg-gray-100 text-gray-400 border-gray-200';
            if (isCompleted) {
              stepBadge = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold';
            } else if (isCurrent) {
              stepBadge = isUngradable
                ? 'bg-red-50 text-red-700 border-red-400 font-bold ring-2 ring-red-200'
                : 'bg-blue-50 text-blue-700 border-blue-400 font-bold ring-2 ring-blue-200';
            }

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center flex-shrink-0 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all ${stepBadge}`}>
                    {isCompleted ? (
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="animate-pulse">{idx + 1}</span>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-[11px] mt-1 whitespace-nowrap ${isCurrent ? 'font-bold text-gray-900' : isCompleted ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                    {step.shortLabel}
                  </span>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1.5 transition-colors ${idx < currentIndex ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
