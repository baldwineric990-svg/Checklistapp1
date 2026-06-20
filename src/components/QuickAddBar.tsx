import { useState } from 'react';
import { ArrowDown } from 'lucide-react';

interface QuickAddBarProps {
  onAdd: (title: string) => void;
}

export default function QuickAddBar({ onAdd }: QuickAddBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="flex items-center bg-[#111827] border border-slate-700/50 rounded-xl mb-5 overflow-hidden focus-within:border-amber-500/50 transition-colors">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your task"
        className="flex-1 bg-transparent px-5 py-4 text-white placeholder-slate-500 outline-none text-sm"
      />
      <button
        onClick={handleSubmit}
        className="m-2 bg-amber-500 hover:bg-amber-400 transition-colors rounded-lg p-2.5 text-slate-900 flex-shrink-0"
      >
        <ArrowDown size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
