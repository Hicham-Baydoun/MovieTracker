// Eyebrow label + bold title + optional "View all" link.
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  actionHref,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4 mb-7', className)}>
      <div className="flex flex-col gap-1.5">
        <p className="text-eyebrow">{eyebrow}</p>
        <h2 className="text-2xl md:text-[28px] font-bold tracking-tight leading-none">{title}</h2>
      </div>
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
