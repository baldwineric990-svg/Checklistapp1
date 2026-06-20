import { Timer } from 'lucide-react';
import { useCountdown, formatResetTime } from '../hooks/useCountdown';

interface HeaderProps {
  resetHour: number;
  resetMinute: number;
  onOpenResetSettings: () => void;
}

export default function Header({ resetHour, resetMinute, onOpenResetSettings }: HeaderProps) {
  const countdown = useCountdown(resetHour, resetMinute);
  const resetLabel = formatResetTime(resetHour, resetMinute);

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Daily Checklist</h1>
      <button
        onClick={onOpenResetSettings}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors group"
      >
        <Timer size={14} className="text-amber-400" />
        <span className="font-mono text-amber-400 font-semibold">{countdown}</span>
        <span className="text-slate-400">· Resets at {resetLabel}</span>
        <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">(edit)</span>
      </button>
    </div>
  );
}
