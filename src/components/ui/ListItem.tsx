import { type LucideIcon } from 'lucide-react';

export function ListItem({
  icon: Icon,
  children,
  color = 'primary',
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  color?: 'primary' | 'teal' | 'amber' | 'red';
}) {
  const iconColors = {
    primary: 'bg-primary-50 text-primary-600',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <li className="flex items-start gap-3 py-2.5">
      <div className={`flex-shrink-0 w-7 h-7 rounded-lg ${iconColors[color]} flex items-center justify-center mt-0.5`}>
        <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <span className="text-sm text-slate-700 leading-relaxed pt-0.5">{children}</span>
    </li>
  );
}
