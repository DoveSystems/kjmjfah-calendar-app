export interface User {
  id: string;
  name: string;
  team: string;
  timezone: string;
  country: string;
  location: string;
}

export interface TimeOff {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  sprintNumber?: number;
}

export type BugType = 'bug' | 'not-a-bug' | 'regression' | 'enhancement' | 'feature';

export interface BugSubtask {
  id: string;
  description: string;
  completed: boolean;
  timeSpent?: number; // in minutes
}

export interface BugTimeEntry {
  id: string;
  userId: string;
  bugNumber: string;
  bugType: BugType;
  title?: string;
  description?: string;
  subtasks: BugSubtask[];
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  isFinished: boolean;
  finishedDate?: Date;
}

export interface Sprint {
  number: number;
  startDate: Date;
  endDate: Date;
}

export type Theme = 'default' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'purple';

export interface ThemeConfig {
  name: Theme;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}

