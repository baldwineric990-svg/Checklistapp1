import { useState } from 'react';
import { X } from 'lucide-react';
import { Group } from '../../types';

interface NewTaskModalProps {
  groups: Group[];
  defaultGroupId: string;
  onAdd: (title: string, groupId: string) => void;
  onClose: () => void;
}

export default function NewTaskModal({ groups, defaultGroupId, onAdd, onClose }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState(defaultGroupId);

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, groupId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-backdrop" />
      <div
        className="modal-panel relative bg-[#111827] border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">New Task</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
            Task Title
          </label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Enter task description"
            className="w-full bg-[#0B132B] border border-slate-700/50 focus:border-amber-500/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 outline-none text-sm transition-colors"
          />
        </div>

        {groups.length > 1 && (
          <div className="mb-5">
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
              Group
            </label>
            <select
              value={groupId}
              onChange={e => setGroupId(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700/50 rounded-lg px-4 py-3 text-white outline-none text-sm appearance-none cursor-pointer"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="px-5 py-2 text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
