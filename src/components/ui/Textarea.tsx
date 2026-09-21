'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full bg-secondary border border-border rounded-[12px] px-4 py-2 text-base',
            'placeholder:text-muted resize-y',
            'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
            'disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed',
            'transition-colors duration-200',
            error && 'border-wrong ring-1 ring-wrong',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-wrong">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
