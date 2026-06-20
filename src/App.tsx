import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, Group, AppData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getNZResetPeriod } from './hooks/useCountdown';
import Header from './components/Header';
import QuickAddBar from './components/QuickAddBar';
import TaskGroup from './components/TaskGroup';
import NewTaskModal from './components/modals/NewTaskModal';
import EditTaskModal from './components/modals/EditTaskModal';
import ResetSettingsModal from './components/modals/ResetSettingsModal';
import CreateGroupModal from './components/modals/CreateGroupModal';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_GROUP_ID = 'general';

const INITIAL_DATA: AppData = {
  tasks: [],
  groups: [{ id: DEFAULT_GROUP_ID, name: 'General Tasks', createdAt: Date.now() }],
  resetHour: 4,
  resetMinute: 0,
};

type ModalState =
  | { type: 'none' }
  | { type: 'newTask'; groupId: string }
  | { type: 'editTask'; task: Task }
  | { type: 'resetSettings' }
  | { type: 'createGroup' };

export default function App() {
  const [data, setData] = useLocalStorage<AppData>('daily-checklist-v1', INITIAL_DATA);
  const [lastResetPeriod, setLastResetPeriod] = useLocalStorage<string>('daily-checklist-reset-period', '');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const resetChecked = useRef(false);

  useEffect(() => {
    if (resetChecked.current) return;
    resetChecked.current = true;

    const currentPeriod = getNZResetPeriod(data.resetHour, data.resetMinute);
    if (lastResetPeriod !== currentPeriod) {
      // Un-check repeating tasks; non-repeating tasks stay as-is
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => (t.repeat ? { ...t, completed: false } : t)),
      }));
      setLastResetPeriod(currentPeriod);
    }
  }, []);

  const closeModal = () => setModal({ type: 'none' });

  const addTask = (title: string, groupId: string, extra?: Partial<Task>) => {
    const task: Task = {
      id: generateId(),
      title,
      description: '',
      groupId,
      completed: false,
      archived: false,
      scheduledTime: '',
      timezone: 'Pacific/Auckland',
      duration: 30,
      reminder: false,
      reminderOffset: '30 minutes before',
      repeat: false,
      repeatDays: [],
      createdAt: Date.now(),
      ...extra,
    };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const quickAdd = (title: string) => {
    addTask(title, DEFAULT_GROUP_ID);
  };

  const toggleTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const archiveTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === id ? { ...t, archived: true } : t)),
    }));
  };

  const unarchiveTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === id ? { ...t, archived: false, completed: false } : t)),
    }));
  };

  const saveTask = (updated: Task) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === updated.id ? updated : t)),
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const createGroup = (name: string) => {
    const group: Group = { id: generateId(), name, createdAt: Date.now() };
    setData(prev => ({ ...prev, groups: [...prev.groups, group] }));
  };

  const deleteGroup = (groupId: string) => {
    if (groupId === DEFAULT_GROUP_ID) return;
    setData(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.id !== groupId),
      tasks: prev.tasks.filter(t => t.groupId !== groupId),
    }));
  };

  const saveResetTime = (hour: number, minute: number) => {
    setData(prev => ({ ...prev, resetHour: hour, resetMinute: minute }));
    resetChecked.current = false;
  };

  const groupsOrdered = [
    data.groups.find(g => g.id === DEFAULT_GROUP_ID)!,
    ...data.groups.filter(g => g.id !== DEFAULT_GROUP_ID),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0B132B]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header
          resetHour={data.resetHour}
          resetMinute={data.resetMinute}
          onOpenResetSettings={() => setModal({ type: 'resetSettings' })}
        />

        <QuickAddBar onAdd={quickAdd} />

        <div className="space-y-3">
          {groupsOrdered.map(group => (
            <TaskGroup
              key={group.id}
              group={group}
              tasks={data.tasks.filter(t => t.groupId === group.id)}
              onAddTask={gid => setModal({ type: 'newTask', groupId: gid })}
              onToggle={toggleTask}
              onArchive={archiveTask}
              onUnarchive={unarchiveTask}
              onEdit={task => setModal({ type: 'editTask', task })}
              onDeleteGroup={deleteGroup}
              isDefault={group.id === DEFAULT_GROUP_ID}
            />
          ))}
        </div>

        <button
          onClick={() => setModal({ type: 'createGroup' })}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-slate-700/40 text-slate-500 hover:text-amber-400 hover:border-amber-500/40 transition-all duration-200 text-sm font-medium group"
        >
          <Plus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
          Create Group
        </button>
      </div>

      {modal.type === 'newTask' && (
        <NewTaskModal
          groups={data.groups}
          defaultGroupId={modal.groupId}
          onAdd={(title, groupId) => addTask(title, groupId)}
          onClose={closeModal}
        />
      )}

      {modal.type === 'editTask' && (
        <EditTaskModal
          task={modal.task}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={closeModal}
        />
      )}

      {modal.type === 'resetSettings' && (
        <ResetSettingsModal
          resetHour={data.resetHour}
          resetMinute={data.resetMinute}
          onSave={saveResetTime}
          onClose={closeModal}
        />
      )}

      {modal.type === 'createGroup' && (
        <CreateGroupModal
          onCreate={createGroup}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
