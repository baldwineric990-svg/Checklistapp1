export interface Task {
  id: string;
  title: string;
  description: string;
  groupId: string;
  completed: boolean;
  archived: boolean;
  scheduledTime: string;
  timezone: string;
  duration: number;
  reminder: boolean;
  reminderOffset: string;
  repeat: boolean;
  repeatDays: string[];
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  createdAt: number;
}

export interface AppData {
  tasks: Task[];
  groups: Group[];
  resetHour: number;
  resetMinute: number;
}
