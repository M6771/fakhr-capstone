export interface Task {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  expectedOutcome?: string;
  completed: boolean;
  dueDate?: string;
}

export interface WeeklyPlan {
  week: number;
  tasks: Task[];
}

export interface Progress {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export interface CheckIn {
  id: string;
  date: string;
  notes: string;
  rating: number;
}
