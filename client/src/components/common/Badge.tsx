import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'approved' | 'rejected' | 'archived' | 'featured' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
}) => {
  const styles = {
    pending:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/30',
    approved:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/30',
    rejected:
      'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 dark:border-red-400/30',
    archived:
      'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20 dark:border-neutral-400/30',
    featured:
      'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 dark:border-purple-400/30 shadow-sm',
    info:
      'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:border-blue-400/30',
    neutral:
      'bg-neutral-200/60 dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 border-black/5 dark:border-white/10',
  };

  const dotColors = {
    pending: 'bg-amber-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
    archived: 'bg-neutral-400',
    featured: 'bg-purple-500',
    info: 'bg-blue-500',
    neutral: 'bg-neutral-500',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px] font-semibold',
    md: 'px-3 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide select-none ${styles[variant]} ${sizes[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      {children}
    </span>
  );
};

