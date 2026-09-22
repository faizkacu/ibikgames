'use client';

import { cn } from '@/lib/utils/cn';
import type { BoxStatus } from '@/stores/useCTBStore';

interface CTBBoxItemProps {
  urutan: number;
  status: BoxStatus;
  onClick: () => void;
}

export function CTBBoxItem({ urutan, status, onClick }: CTBBoxItemProps) {
  const isDisabled = status === 'cleared';

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={cn(
        'bg-surface border border-border rounded-card p-6 text-center transition-colors duration-300',
        'flex items-center justify-center min-h-[100px]',
        isDisabled
          ? 'bg-correct-light border-correct cursor-default'
          : 'cursor-pointer hover:border-primary hover:shadow-sm',
        status === 'wrong' && 'bg-wrong-light border-wrong'
      )}
    >
      <div className="space-y-1">
        <span
          className={cn(
            'text-2xl font-bold',
            isDisabled ? 'text-correct' : 'text-primary'
          )}
        >
          {urutan}
        </span>
        {isDisabled && (
          <p className="text-xs text-correct font-medium">Cleared</p>
        )}
      </div>
    </button>
  );
}
