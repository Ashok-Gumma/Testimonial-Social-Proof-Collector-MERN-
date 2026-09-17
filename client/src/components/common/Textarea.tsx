import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 tracking-tight">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full apple-input rounded-apple-sm px-4 py-2.5 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 resize-y ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

