import type { ReviewStatus, AIStatus, ImageQualityStatus } from '../../lib/types';

// ── Badge ──────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const BADGE_VARIANTS = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  neutral: 'bg-slate-700/50 text-slate-400 border-slate-600',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const DOT_COLORS = {
  default: 'bg-slate-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  info: 'bg-cyan-400',
  neutral: 'bg-slate-500',
  purple: 'bg-purple-400',
};

export function Badge({ children, variant = 'default', size = 'sm', dot = false }: BadgeProps) {
  const base = size === 'sm'
    ? 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border'
    : 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border';
  return (
    <span className={`${base} ${BADGE_VARIANTS[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLORS[variant]}`} />}
      {children}
    </span>
  );
}

// ── ReviewStatus Badge ─────────────────────────────────────────────────────
export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const map: Record<ReviewStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'Pending Review', variant: 'warning' },
    in_review: { label: 'In Review', variant: 'info' },
    reviewed: { label: 'Reviewed', variant: 'success' },
    referred: { label: 'Referred', variant: 'danger' },
    follow_up: { label: 'Follow-up', variant: 'purple' },
    recapture: { label: 'Recapture Required', variant: 'neutral' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}

// ── AIStatus Badge ─────────────────────────────────────────────────────────
export function AIStatusBadge({ status }: { status: AIStatus }) {
  const map: Record<AIStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'Queued', variant: 'neutral' },
    processing: { label: 'Processing', variant: 'info' },
    complete: { label: 'Complete', variant: 'success' },
    error: { label: 'Error', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}

// ── Image Quality Badge ────────────────────────────────────────────────────
export function QualityBadge({ status }: { status: ImageQualityStatus }) {
  const map: Record<ImageQualityStatus, { label: string; variant: BadgeProps['variant'] }> = {
    gradable: { label: 'Gradable', variant: 'success' },
    borderline: { label: 'Borderline', variant: 'warning' },
    ungradable: { label: 'Ungradable', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}

// ── DR Level Badge ─────────────────────────────────────────────────────────
export function DRLevelBadge({ level, referable }: { level: number; referable: boolean }) {
  const variant = level === 0 ? 'success' : level <= 1 ? 'warning' : 'danger';
  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant}>Level {level}</Badge>
      {referable && <Badge variant="danger" size="sm">REFERABLE</Badge>}
    </div>
  );
}

// ── ConfidenceMeter ────────────────────────────────────────────────────────
interface ConfidenceMeterProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ConfidenceMeter({ value, size = 'md', showLabel = true }: ConfidenceMeterProps) {
  const color = value >= 90 ? 'bg-emerald-400' : value >= 75 ? 'bg-cyan-400' : 'bg-amber-400';
  const textColor = value >= 90 ? 'text-emerald-400' : value >= 75 ? 'text-cyan-400' : 'text-amber-400';

  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex flex-col gap-1">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Confidence</span>
          <span className={`font-mono font-semibold ${textSizes[size]} ${textColor}`}>
            {value.toFixed(1)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ── Quality Bar ─────────────────────────────────────────────────────────────
interface QualityBarProps {
  label: string;
  value: number;
}

export function QualityBar({ label, value }: QualityBarProps) {
  const color = value >= 80 ? 'bg-emerald-400' : value >= 60 ? 'bg-amber-400' : 'bg-red-400';
  const textColor = value >= 80 ? 'text-emerald-400' : value >= 60 ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <span className={`text-xs font-mono font-semibold ${textColor}`}>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ── Stat ───────────────────────────────────────────────────────────────────
interface StatProps {
  label: string;
  value: string | number;
  sub?: string;
  mono?: boolean;
}

export function Stat({ label, value, sub, mono }: StatProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{label}</span>
      <span className={`text-gray-800 font-semibold ${mono ? 'font-mono' : ''}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="border-t border-gray-100" />;
}

// ── Pulse dot for live status ──────────────────────────────────────────────
export function LiveDot({ color = 'cyan' }: { color?: 'cyan' | 'green' | 'amber' | 'red' }) {
  const colors = {
    cyan: 'bg-cyan-400',
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
  };
  return (
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[color]} opacity-50`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[color]}`} />
    </span>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
