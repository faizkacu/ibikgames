import { cn } from '@/lib/utils/cn';

interface BentoGridProps {
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const gapStyles = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

const columnStyles = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export function BentoGrid({
  columns = 3,
  gap = 'md',
  children,
  className,
}: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid',
        columnStyles[columns],
        gapStyles[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
