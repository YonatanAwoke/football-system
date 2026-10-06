import React from 'react';

type BadgeVariant = 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'slate' 
  | 'purple' 
  | 'gold';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  gold: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30 font-semibold',
};

const dotStyles: Record<BadgeVariant, string> = {
  primary: 'bg-emerald-400',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  info: 'bg-sky-400',
  slate: 'bg-slate-400',
  purple: 'bg-purple-400',
  gold: 'bg-yellow-400',
};

const sizeStyles = {
  sm: 'text-[11px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = '',
  onClick
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} animate-pulse`} />}
      {children}
    </span>
  );
};
