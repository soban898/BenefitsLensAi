import { type ReactNode } from 'react';

type Color = 'primary' | 'teal' | 'amber' | 'red' | 'slate';

const colors: Record<Color, string> = {
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function Badge({
  children,
  color = 'primary',
  className = '',
}: {
  children: ReactNode;
  color?: Color;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
