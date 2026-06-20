import { useState } from 'react';
import { RefreshCw, Clock, Archive, Pencil } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onArchive: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onArchive, onEdit }: TaskItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex items-start gap-3 py-3 px-1 rounded-lg transition-all duration-200 ${
        hovered ? 'bg-white/[0.025]' : ''
      } ${task.completed ? 'opacity-60' : 'opacity-100'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-[4px] border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
          task.completed
            ? 'bg-amber-500 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
            : 'border-amber-500/60 hover:border-amber-400 hover:bg-amber-500/10'
        }`}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <svg
            width="11"
            height="9"
            viewBox="0 0 11 9"
            fill="none"
            className="checkmark-draw"
          >
            <path
              d="M1 4L4 7L10 1"
              stroke="#1a1a2e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(task)}>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-semibold tracking-wide transition-all duration-300 ${
              task.completed ? 'line-through text-slate-500' : 'text-white'
            }`}
          >
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          {task.scheduledTime && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={11} />
              Scheduled for {task.scheduledTime}
            </span>
          )}
          {task.repeat && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <RefreshCw size={11} />
              Daily
            </span>
          )}
        </div>
        {task.description && (
          <p className={`text-xs mt-1 leading-relaxed ${task.completed ? 'text-slate-600' : 'text-slate-400'}`}>
            {task.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {hovered && !task.completed && (
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-300 hover:bg-white/[0.05] transition-all duration-150 hover:-translate-y-px active:translate-y-0"
            title="Edit task"
          >
            <Pencil size={13} />
          </button>
        )}
        {hovered && task.completed && (
          <button
            onClick={() => onArchive(task.id)}
            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 hover:-translate-y-px active:translate-y-0"
            title="Archive Task"
          >
            <Archive size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
