'use client';

import { forwardRef, type InputHTMLAttributes, type ElementType } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: ElementType;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-secondary border border-border rounded-[12px] px-4 py-2 text-base',
              'placeholder:text-muted',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
              'disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed',
              'transition-colors duration-200',
              Icon && 'pl-10',
              error && 'border-wrong ring-1 ring-wrong',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-wrong">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
