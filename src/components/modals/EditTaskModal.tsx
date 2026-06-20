import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Task } from '../../types';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const TIMEZONES = [
  'Pacific/Auckland',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
];
const REMINDER_OPTIONS = ['15 minutes before', '30 minutes before', '1 hour before', '2 hours before', '1 day before'];
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return { value: `${h}:00 ${ampm}`, label: `${h}:00 ${ampm}` };
});

interface EditTaskModalProps {
  task: Task;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function EditTaskModal({ task, onSave, onDelete, onClose }: EditTaskModalProps) {
  const [form, setForm] = useState<Task>({ ...task });

  const update = (patch: Partial<Task>) => setForm(prev => ({ ...prev, ...patch }));

  const toggleDay = (day: string) => {
    const days = form.repeatDays.includes(day)
      ? form.repeatDays.filter(d => d !== day)
      : [...form.repeatDays, day];
    update({ repeatDays: days });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const handleDelete = () => {
    onDelete(form.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-backdrop" />
      <div
        className="modal-panel relative bg-[#111827] border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Edit Task</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1.5">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Title</label>
            <input
              autoFocus
              type="text"
              value={form.title}
              onChange={e => update({ title: e.target.value })}
              className="w-full bg-[#0B132B] border border-slate-700/50 focus:border-amber-500/50 rounded-lg px-4 py-3 text-white outline-none text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={e => update({ description: e.target.value })}
              placeholder="Describe your task..."
              rows={3}
              className="w-full bg-[#0B132B] border border-slate-700/50 focus:border-amber-500/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 outline-none text-sm resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Scheduled Time</label>
              <select
                value={form.scheduledTime}
                onChange={e => update({ scheduledTime: e.target.value })}
                className="w-full bg-[#0B132B] border border-slate-700/50 rounded-lg px-3 py-2.5 text-white outline-none text-sm appearance-none cursor-pointer"
              >
                <option value="">None</option>
                {HOUR_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Timezone</label>
              <select
                value={form.timezone}
                onChange={e => update({ timezone: e.target.value })}
                className="w-full bg-[#0B132B] border border-slate-700/50 rounded-lg px-3 py-2.5 text-white outline-none text-sm appearance-none cursor-pointer"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
              Duration: {form.duration} min
            </label>
            <div className="relative py-2">
              <input
                type="range"
                min={5}
                max={240}
                step={5}
                value={form.duration}
                onChange={e => update({ duration: Number(e.target.value) })}
                className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer duration-slider"
              />
            </div>
          </div>

          <div className="border-t border-slate-700/40 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white font-medium">Set Reminder</span>
              <button
                onClick={() => update({ reminder: !form.reminder })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  form.reminder ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                    form.reminder ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {form.reminder && (
              <select
                value={form.reminderOffset}
                onChange={e => update({ reminderOffset: e.target.value })}
                className="w-full bg-[#0B132B] border border-slate-700/50 rounded-lg px-4 py-2.5 text-white outline-none text-sm appearance-none cursor-pointer"
              >
                {REMINDER_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            )}
          </div>

          <div className="border-t border-slate-700/40 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white font-medium">Repeat</span>
              <button
                onClick={() => update({ repeat: !form.repeat })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  form.repeat ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                    form.repeat ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {form.repeat && (
              <div className="flex gap-2 flex-wrap">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                      form.repeatDays.includes(day)
                        ? 'bg-amber-500 text-slate-900'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/40">
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
