import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function MLStatusBadge({ compact = false }: { compact?: boolean }) {
  const { mlConnected, isDemoMode } = useAppState();

  if (mlConnected) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 size={13} className="text-emerald-500" />
        {!compact && 'ML Connected'}
      </span>
    );
  }

  if (isDemoMode) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        {!compact ? 'Demo Mode — ML Disconnected' : 'Demo'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
      <AlertTriangle size={13} className="text-gray-500" />
      {!compact ? 'ML Model Not Connected' : 'Offline'}
    </span>
  );
}
