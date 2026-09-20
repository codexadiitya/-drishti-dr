import { AlertCircle, Cpu, Wifi } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function DemoModeBanner() {
  const { isDemoMode, mlConnected, isRuralMode, networkStatus } = useAppState();

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 z-10">
      <div className="flex items-center gap-2">
        <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
        <span className="font-semibold text-amber-950">SIH Demonstration Mode:</span>
        <span className="text-amber-800 hidden sm:inline">
          {mlConnected
            ? 'Production ML service connected.'
            : 'ML Model Not Connected — UI is displaying validated test presets. Actual ML models will be integrated manually by the ML team.'}
        </span>
        <span className="text-amber-800 sm:hidden">
          Demo data active (ML to be added).
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto text-[11px]">
        {isRuralMode && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium border border-blue-200">
            <Wifi size={11} /> Rural Mode ({networkStatus})
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-medium border border-amber-300">
          <Cpu size={11} /> {mlConnected ? 'ML API v1.0' : 'ML Model Placeholder'}
        </span>
      </div>
    </div>
  );
}
