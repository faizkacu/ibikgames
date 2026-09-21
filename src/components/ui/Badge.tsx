import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'default' | 'outline' | 'correct' | 'wrong';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary text-secondary',
  outline: 'bg-transparent text-primary border border-border',
  correct: 'bg-correct-light text-correct',
  wrong: 'bg-wrong-light text-wrong',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
