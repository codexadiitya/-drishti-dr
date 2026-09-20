import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon?: ReactNode;
  accent?: 'default' | 'cyan' | 'green' | 'amber' | 'red' | 'purple';
  subtitle?: string;
  className?: string;
}

const ACCENT_COLORS = {
  default: { icon: 'text-gray-400 bg-gray-100', value: 'text-gray-900' },
  cyan:    { icon: 'text-blue-600 bg-blue-50',   value: 'text-blue-700' },
  green:   { icon: 'text-green-600 bg-green-50', value: 'text-green-700' },
  amber:   { icon: 'text-amber-600 bg-amber-50', value: 'text-amber-700' },
  red:     { icon: 'text-red-600 bg-red-50',     value: 'text-red-700' },
  purple:  { icon: 'text-purple-600 bg-purple-50', value: 'text-purple-700' },
};

export function KPICard({ label, value, unit, trend, trendLabel, icon, accent = 'default', subtitle, className = '' }: KPICardProps) {
  const colors = ACCENT_COLORS[accent];

  const trendColor = trend === undefined
    ? 'text-gray-400'
    : trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-400';

  const TrendIcon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 card-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">
          {label}
        </span>
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-1.5">
        <span className={`text-3xl font-bold tabular-nums leading-none ${colors.value}`}>
          {value}
        </span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
      </div>

      <div className="flex items-center gap-2">
        {TrendIcon && trend !== undefined && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon size={12} />
            <span className="text-xs font-medium tabular-nums">{Math.abs(trend)}%</span>
          </div>
        )}
        {trendLabel && <span className="text-xs text-gray-400">{trendLabel}</span>}
        {subtitle && !trendLabel && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
    </div>
  );
}
