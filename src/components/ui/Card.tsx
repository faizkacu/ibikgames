import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  bordered?: boolean;
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  padding = 'md',
  hover = false,
  bordered = true,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-secondary rounded-[12px]',
        bordered && 'border border-border',
        hover && 'transition-shadow duration-200 hover:shadow-sm',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
