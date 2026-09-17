import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 tracking-tight">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full apple-input rounded-apple-sm px-4 py-2.5 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 ${
              icon ? 'pl-10' : ''
            } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

