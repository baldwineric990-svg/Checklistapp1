import { useRef, useState } from 'react';
import { ChevronDown, Plus, Trash2, RotateCcw } from 'lucide-react';
import { Task, Group } from '../types';
import TaskItem from './TaskItem';

interface TaskGroupProps {
  group: Group;
  tasks: Task[];
  onAddTask: (groupId: string) => void;
  onToggle: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  onUnarchive: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDeleteGroup: (groupId: string) => void;
  isDefault?: boolean;
}

export default function TaskGroup({
  group,
  tasks,
  onAddTask,
  onToggle,
  onArchive,
  onUnarchive,
  onEdit,
  onDeleteGroup,
  isDefault,
}: TaskGroupProps) {
  const [headerHovered, setHeaderHovered] = useState(false);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const archivedRef = useRef<HTMLDivElement>(null);

  const activeTasks = tasks.filter(t => !t.archived);
  const archivedTasks = tasks.filter(t => t.archived);
  const completedCount = activeTasks.filter(t => t.completed).length;

  return (
    <div className="bg-[#111827] border border-slate-700/40 rounded-xl overflow-hidden transition-shadow duration-200 hover:border-slate-600/50">
      {/* Archived panel — top of group */}
      {archivedTasks.length > 0 && (
        <div className="border-b border-slate-700/40">
          <button
            onClick={() => setArchivedOpen(o => !o)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-left group hover:bg-white/[0.02] transition-colors"
          >
            <ChevronDown
              size={13}
              className={`text-slate-500 flex-shrink-0 transition-transform duration-300 ${archivedOpen ? 'rotate-0' : '-rotate-90'}`}
            />
            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-400 transition-colors">
              +{archivedTasks.length} upcoming task{archivedTasks.length !== 1 ? 's' : ''}
            </span>
          </button>

          {/* Smooth height collapse */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: archivedOpen ? `${archivedTasks.length * 80 + 16}px` : '0px' }}
          >
            <div ref={archivedRef} className="px-4 pb-2 space-y-0.5">
              {archivedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 py-2 rounded-lg group/archived hover:bg-white/[0.03] transition-colors px-1"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-slate-600 line-through truncate">{task.title}</span>
                  </div>
                  <button
                    onClick={() => onUnarchive(task.id)}
                    title="Restore task"
                    className="opacity-0 group-hover/archived:opacity-100 transition-all duration-150 p-1.5 rounded-md text-slate-600 hover:text-amber-400 hover:bg-amber-400/10"
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Group header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-white">{group.name}</h2>
          {activeTasks.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-mono transition-colors ${
              completedCount === activeTasks.length && activeTasks.length > 0
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-500 bg-slate-700/30'
            }`}>
              {completedCount}/{activeTasks.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {headerHovered && !isDefault && (
            <button
              onClick={() => onDeleteGroup(group.id)}
              className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
              title="Delete group"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={() => onAddTask(group.id)}
            className={`flex items-center gap-1.5 text-xs transition-all duration-150 px-2.5 py-1.5 rounded-md font-medium ${
              headerHovered
                ? 'text-amber-400 bg-amber-400/10 scale-100'
                : 'text-slate-600 hover:text-slate-400 scale-95'
            }`}
            title="Add task to this group"
          >
            <Plus size={13} />
            {headerHovered && <span>Add task</span>}
          </button>
        </div>
      </div>

      {/* Active tasks */}
      <div className="px-4 pb-3">
        {activeTasks.length === 0 ? (
          <button
            onClick={() => onAddTask(group.id)}
            className="w-full text-xs text-slate-600 hover:text-slate-400 py-3 text-left transition-colors flex items-center gap-2 group/empty"
          >
            <Plus size={13} className="transition-transform duration-150 group-hover/empty:rotate-90" />
            Add a task
          </button>
        ) : (
          <div className="divide-y divide-slate-700/25">
            {activeTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onArchive={onArchive}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
