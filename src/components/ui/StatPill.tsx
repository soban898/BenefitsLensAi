import { type LucideIcon } from 'lucide-react';

export function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 card-shadow">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-50 to-teal-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-600" strokeWidth={2.5} />
      </div>
      <div className="text-left">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
