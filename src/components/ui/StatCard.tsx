import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  colorScheme?: 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'slate';
  onClick?: () => void;
  className?: string;
}

const colorMaps = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/20 text-emerald-300',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/20 text-amber-300',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/20 text-rose-300',
  },
  sky: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
    iconBg: 'bg-sky-500/20 text-sky-300',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/20 text-purple-300',
  },
  slate: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-700/60',
    iconBg: 'bg-slate-700/50 text-slate-300',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'emerald',
  onClick,
  className = ''
}) => {
  const c = colorMaps[colorScheme];

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-900/90 border ${c.border} rounded-2xl p-5 shadow-lg backdrop-blur transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-slate-600 hover:-translate-y-0.5' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h4>
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${c.iconBg} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
