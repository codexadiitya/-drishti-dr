import React from 'react';
import { DRGrade } from '@/lib/types';

interface SeverityBadgeProps {
  grade?: DRGrade;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  grade = 0,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const configs: Record<DRGrade, { label: string; shortLabel: string; bg: string; text: string; border: string; desc: string }> = {
    0: {
      label: 'No Apparent DR',
      shortLabel: 'Grade 0 (Normal)',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      desc: 'Annual routine screening'
    },
    1: {
      label: 'Mild NPDR',
      shortLabel: 'Grade 1 (Mild)',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-800 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
      desc: 'Microaneurysms only'
    },
    2: {
      label: 'Moderate NPDR',
      shortLabel: 'Grade 2 (Moderate)',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      desc: 'Referable DR - Routine'
    },
    3: {
      label: 'Severe NPDR',
      shortLabel: 'Grade 3 (Severe)',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
      desc: 'Urgent referral (4-2-1 rule)'
    },
    4: {
      label: 'Proliferative DR (PDR)',
      shortLabel: 'Grade 4 (PDR)',
      bg: 'bg-red-50 dark:bg-red-950/40',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      desc: 'Immediate Vitreoretinal referral'
    }
  };

  const config = configs[grade] || configs[0];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-sm px-2.5 py-1 font-semibold',
    lg: 'text-base px-3.5 py-1.5 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      <span
        className={`inline-block rounded-full ${
          grade === 0
            ? 'bg-emerald-500'
            : grade === 1
            ? 'bg-teal-500'
            : grade === 2
            ? 'bg-amber-500'
            : grade === 3
            ? 'bg-orange-500'
            : 'bg-red-500 animate-pulse'
        } ${size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
      />
      <span>{showLabel ? config.label : config.shortLabel}</span>
    </span>
  );
};
