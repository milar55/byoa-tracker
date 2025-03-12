export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
} 