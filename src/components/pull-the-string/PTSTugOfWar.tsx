'use client';

import { cn } from '@/lib/utils/cn';

interface PTSTugOfWarProps {
  skorTimA: number;
  skorTimB: number;
  totalSoal: number;
  timPemenang?: 'tim_a' | 'tim_b' | null;
  className?: string;
}

export function PTSTugOfWar({
  skorTimA,
  skorTimB,
  totalSoal,
  timPemenang,
  className,
}: PTSTugOfWarProps) {
  const total = skorTimA + skorTimB;
  // Calculate position: 50% = center, 0% = Tim A wins, 100% = Tim B wins
  let percentage = 50;
  if (total > 0) {
    percentage = (skorTimB / total) * 100;
  }
  // Clamp between 5% and 95% so the indicator is always visible
  percentage = Math.max(5, Math.min(95, percentage));

  return (
    <div className={cn('space-y-4', className)}>
      {/* Labels */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <p className={cn(
            'text-sm font-semibold',
            timPemenang === 'tim_a' ? 'text-correct' : 'text-primary'
          )}>
            Tim A
          </p>
          <p className="text-xs text-muted">
            {skorTimA}/{totalSoal} soal
          </p>
        </div>
        <div className="text-right">
          <p className={cn(
            'text-sm font-semibold',
            timPemenang === 'tim_b' ? 'text-correct' : 'text-primary'
          )}>
            Tim B
          </p>
          <p className="text-xs text-muted">
            {skorTimB}/{totalSoal} soal
          </p>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-16 bg-surface rounded-full overflow-hidden">
        {/* Track line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2" />

        {/* Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
          style={{ left: `${percentage}%` }}
        >
          <div className={cn(
            'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold',
            timPemenang
              ? timPemenang === 'tim_a'
                ? 'bg-correct-light border-correct text-correct'
                : 'bg-correct-light border-correct text-correct'
              : 'bg-primary border-primary text-secondary'
          )}>
            {total > 0 ? (
              skorTimA > skorTimB ? 'A' : skorTimB > skorTimA ? 'B' : '='
            ) : (
              <span className="w-2 h-2 bg-secondary rounded-full" />
            )}
          </div>
        </div>

        {/* Team A indicator (left) */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-30" />

        {/* Team B indicator (right) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-30" />
      </div>
    </div>
  );
}
