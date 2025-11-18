import { create } from 'zustand';
import { User, TimeOff, BugTimeEntry, Sprint, Theme, BugType, BugSubtask } from '../types';
import { addDays, differenceInDays } from 'date-fns';

// Calculate sprint number based on date (2-week sprints)
const getSprintNumber = (date: Date): number => {
  const sprintStart = new Date('2024-01-01'); // Adjust based on your sprint start
  const daysSinceStart = differenceInDays(date, sprintStart);
  return Math.floor(daysSinceStart / 14) + 177; // Starting from sprint 177
};

const getSprintDates = (sprintNumber: number): { startDate: Date; endDate: Date } => {
  const sprintStart = new Date('2024-01-01');
  const daysOffset = (sprintNumber - 177) * 14;
  const startDate = addDays(sprintStart, daysOffset);
  const endDate = addDays(startDate, 13);
  return { startDate, endDate };
};

interface AppState {
  users: User[];
  timeOffs: TimeOff[];
  bugTimeEntries: BugTimeEntry[];
  activeBugTimer: BugTimeEntry | null;
  currentUserId: string | null;
  theme: Theme;
  hasOnboarded: boolean;
  
  // Actions
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  setCurrentUser: (userId: string | null) => void;
  setTheme: (theme: Theme) => void;
  setOnboarded: (onboarded: boolean) => void;
  addTimeOff: (timeOff: Omit<TimeOff, 'id' | 'sprintNumber'>) => void;
  removeTimeOff: (id: string) => void;
  startBugTimer: (userId: string, bugNumber: string, bugType: BugType, title?: string, description?: string) => void;
  stopBugTimer: () => void;
  updateBugEntry: (entryId: string, updates: Partial<BugTimeEntry>) => void;
  addBugSubtask: (entryId: string, subtask: Omit<BugSubtask, 'id'>) => void;
  updateBugSubtask: (entryId: string, subtaskId: string, updates: Partial<BugSubtask>) => void;
  markBugFinished: (entryId: string) => void;
  getTimeOffsForSprint: (sprintNumber: number) => TimeOff[];
  getSprintForDate: (date: Date) => Sprint;
}

export const useStore = create<AppState>((set, get) => ({
  users: [],
  timeOffs: [],
  bugTimeEntries: [],
  activeBugTimer: null,
  currentUserId: null,
  theme: 'default',
  hasOnboarded: false,

  addUser: (user) => {
    set((state) => ({ users: [...state.users, user] }));
    // Auto-set as current user if it's the first user
    const state = get();
    if (state.users.length === 1) {
      set({ currentUserId: user.id });
    }
  },

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
      currentUserId: state.currentUserId === userId ? null : state.currentUserId,
    })),

  setCurrentUser: (userId) => set({ currentUserId: userId }),

  setTheme: (theme) => set({ theme }),

  setOnboarded: (onboarded) => set({ hasOnboarded: onboarded }),

  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      ),
    })),

  addTimeOff: (timeOff) => {
    const sprintNumber = getSprintNumber(timeOff.startDate);
    const newTimeOff: TimeOff = {
      ...timeOff,
      id: Date.now().toString(),
      sprintNumber,
    };
    set((state) => ({ timeOffs: [...state.timeOffs, newTimeOff] }));
  },

  removeTimeOff: (id) =>
    set((state) => ({ timeOffs: state.timeOffs.filter((to) => to.id !== id) })),

  startBugTimer: (userId, bugNumber, bugType, title, description) => {
    const newEntry: BugTimeEntry = {
      id: Date.now().toString(),
      userId,
      bugNumber,
      bugType,
      title: title || '',
      description: description || '',
      subtasks: [],
      startTime: new Date(),
      isFinished: false,
    };
    set({ activeBugTimer: newEntry });
  },

  stopBugTimer: () => {
    const { activeBugTimer } = get();
    if (!activeBugTimer) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeBugTimer.startTime.getTime()) / 1000 / 60);

    const completedEntry: BugTimeEntry = {
      ...activeBugTimer,
      endTime,
      duration,
    };

    set((state) => ({
      bugTimeEntries: [...state.bugTimeEntries, completedEntry],
      activeBugTimer: null,
    }));
  },

  updateBugEntry: (entryId, updates) =>
    set((state) => ({
      bugTimeEntries: state.bugTimeEntries.map((entry) =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      ),
      activeBugTimer:
        state.activeBugTimer?.id === entryId
          ? { ...state.activeBugTimer, ...updates }
          : state.activeBugTimer,
    })),

  addBugSubtask: (entryId, subtask) => {
    const newSubtask: BugSubtask = {
      ...subtask,
      id: Date.now().toString() + Math.random().toString(),
    };
    const state = get();
    if (state.activeBugTimer?.id === entryId) {
      set({
        activeBugTimer: {
          ...state.activeBugTimer,
          subtasks: [...state.activeBugTimer.subtasks, newSubtask],
        },
      });
    } else {
      set((state) => ({
        bugTimeEntries: state.bugTimeEntries.map((entry) =>
          entry.id === entryId
            ? { ...entry, subtasks: [...entry.subtasks, newSubtask] }
            : entry
        ),
      }));
    }
  },

  updateBugSubtask: (entryId, subtaskId, updates) => {
    const state = get();
    if (state.activeBugTimer?.id === entryId) {
      const updatedSubtasks = state.activeBugTimer.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, ...updates } : st
      );
      set({
        activeBugTimer: {
          ...state.activeBugTimer,
          subtasks: updatedSubtasks,
        },
      });
    } else {
      set((state) => ({
        bugTimeEntries: state.bugTimeEntries.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                subtasks: entry.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, ...updates } : st
                ),
              }
            : entry
        ),
      }));
    }
  },

  markBugFinished: (entryId) => {
    const state = get();
    const entry = state.bugTimeEntries.find((e) => e.id === entryId);
    if (entry) {
      get().updateBugEntry(entryId, {
        isFinished: true,
        finishedDate: new Date(),
      });
    }
  },

  getTimeOffsForSprint: (sprintNumber) => {
    const { timeOffs } = get();
    const { startDate, endDate } = getSprintDates(sprintNumber);
    return timeOffs.filter((to) => {
      const sprint = getSprintNumber(to.startDate);
      return sprint === sprintNumber || 
        (to.startDate <= endDate && to.endDate >= startDate);
    });
  },

  getSprintForDate: (date) => {
    const sprintNumber = getSprintNumber(date);
    const { startDate, endDate } = getSprintDates(sprintNumber);
    return { number: sprintNumber, startDate, endDate };
  },
}));

