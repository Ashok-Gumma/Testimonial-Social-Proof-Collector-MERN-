import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'apple-blue';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-blue disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-apple-pill border border-white/10 dark:border-black/10 font-semibold',
    'apple-blue':
      'bg-apple-blue hover:bg-apple-blueHover text-white shadow-apple-pill border border-blue-400/30 font-semibold',
    secondary:
      'bg-neutral-200/70 hover:bg-neutral-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-neutral-900 dark:text-white border border-black/5 dark:border-white/10 backdrop-blur-md',
    outline:
      'bg-white/80 dark:bg-white/[0.04] hover:bg-neutral-50 dark:hover:bg-white/[0.08] text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-white/10 backdrop-blur-md',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-sm border border-red-400/30 font-medium',
    ghost:
      'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-semibold',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </motion.button>
  );
};

