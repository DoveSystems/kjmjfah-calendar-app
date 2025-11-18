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

export interface BugTimeEntry {
  id: string;
  userId: string;
  bugNumber: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
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

