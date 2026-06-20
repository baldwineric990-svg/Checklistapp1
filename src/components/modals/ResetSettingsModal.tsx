import { useState } from 'react';
import { X } from 'lucide-react';
import { useCountdown, formatResetTime } from '../../hooks/useCountdown';

const TIMEZONES = [
  'Pacific/Auckland',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
];

const TICK_MARKS = [
  { pct: 0, label: '11 PM' },
  { pct: 12.5, label: '' },
  { pct: 25, label: '3 AM' },
  { pct: 37.5, label: '' },
  { pct: 50, label: '7 AM' },
  { pct: 62.5, label: '' },
  { pct: 75, label: '11 AM' },
  { pct: 87.5, label: '' },
  { pct: 100, label: '3 PM' },
];

function sliderValueToHour(val: number): number {
  // Slider goes from 23 (11PM) to 15 (3PM) passing through 0-24
  // val 0 -> 23, val 16 -> 15 (next day)
  // Map 0-16 to hours: 23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
  const hours = [23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  return hours[Math.round(val)];
}

function hourToSliderValue(hour: number): number {
  const hours = [23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const idx = hours.indexOf(hour);
  return idx === -1 ? 5 : idx; // default to 4AM = index 5
}

interface ResetSettingsModalProps {
  resetHour: number;
  resetMinute: number;
  onSave: (hour: number, minute: number) => void;
  onClose: () => void;
}

function CountdownDisplay({ hour, minute }: { hour: number; minute: number }) {
  const countdown = useCountdown(hour, minute);
  return <span className="font-mono text-3xl font-bold text-white tracking-widest">{countdown}</span>;
}

export default function ResetSettingsModal({ resetHour, onSave, onClose }: ResetSettingsModalProps) {
  const [sliderVal, setSliderVal] = useState(hourToSliderValue(resetHour));
  const [timezone, setTimezone] = useState(TIMEZONES[0]);

  const currentHour = sliderValueToHour(sliderVal);
  const resetLabel = formatResetTime(currentHour, 0);

  const handleSave = () => {
    onSave(currentHour, 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-backdrop" />
      <div
        className="modal-panel relative bg-[#111827] border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Edit Reset Time</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Resets In</p>
          <CountdownDisplay hour={currentHour} minute={0} />
        </div>

        <div className="mb-6">
          <div className="relative pt-2 pb-6">
            <div className="relative h-2 bg-slate-700/60 rounded-full">
              <div
                className="absolute h-full bg-gradient-to-r from-amber-500/30 to-amber-500 rounded-full transition-all"
                style={{ width: `${(sliderVal / 16) * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={16}
                step={1}
                value={sliderVal}
                onChange={e => setSliderVal(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-500 rounded-full shadow-lg border-2 border-amber-300 transition-all pointer-events-none"
                style={{ left: `calc(${(sliderVal / 16) * 100}% - 10px)` }}
              />
            </div>

            <div className="relative mt-3">
              {TICK_MARKS.map((tick, i) => (
                <div
                  key={i}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${tick.pct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-px h-1.5 bg-slate-600 mb-1" />
                  {tick.label && (
                    <span className="text-xs text-slate-500 whitespace-nowrap">{tick.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0B132B] border border-slate-700/30 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Daily reset time</p>
              <p className="text-white font-semibold text-lg">{resetLabel}</p>
            </div>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none text-xs appearance-none cursor-pointer"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Save Reset Time
          </button>
        </div>
      </div>
    </div>
  );
}
