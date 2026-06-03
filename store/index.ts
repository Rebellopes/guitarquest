import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserGoalType, StreakData, StudyPlan } from "../types";
import { zustandMmkvStorage } from "../utils/storage";

interface GoalStore {
  goal: UserGoalType | null;
  setGoal: (goal: UserGoalType) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      goal: null,
      hasCompletedOnboarding: false,
      setGoal: (goal) => set({ goal }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "goal",
      storage: createJSONStorage(() => zustandMmkvStorage),
    },
  ),
);

const defaultPlan: StudyPlan = {
  daysOfWeek: [1, 3, 5],
  startTime: "18:00",
  notificationsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

interface StudyPlanStore {
  plan: StudyPlan;
  setPlan: (plan: StudyPlan) => void;
  updatePlan: (partial: Partial<StudyPlan>) => void;
}

export const useStudyPlanStore = create<StudyPlanStore>()(
  persist(
    (set) => ({
      plan: { ...defaultPlan },
      setPlan: (plan) => set({ plan }),
      updatePlan: (partial) => set((s) => ({ plan: { ...s.plan, ...partial } })),
    }),
    {
      name: "study-plan",
      storage: createJSONStorage(() => zustandMmkvStorage),
    },
  ),
);

interface ProgressStore {
  completedLessons: string[];
  completedDates: Record<string, number>;
  currentLessonId: string;
  exerciseResults: Record<string, Record<string, { correct: boolean; selectedIndex: number }>>;
  completeLesson: (lessonId: string, nextLessonId: string) => void;
  recordExerciseResult: (lessonId: string, exerciseId: string, correct: boolean, selectedIndex: number) => void;
  streakData: StreakData;
  checkAndResetStreak: () => void;
}

const today = () => new Date().toISOString().split("T")[0];
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      completedDates: {},
      currentLessonId: "mod1-lesson1",
      exerciseResults: {},
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastLessonDate: null,
      },

      recordExerciseResult: (lessonId, exerciseId, correct, selectedIndex) => {
        set((state) => ({
          exerciseResults: {
            ...state.exerciseResults,
            [lessonId]: {
              ...state.exerciseResults[lessonId],
              [exerciseId]: { correct, selectedIndex },
            },
          },
        }));
      },

      completeLesson: (lessonId, nextLessonId) => {
        const { completedLessons, streakData, completedDates } = get();
        if (completedLessons.includes(lessonId)) {
          set({ currentLessonId: nextLessonId });
          return;
        }

        const newCompleted = [...completedLessons, lessonId];
        const lastDate = streakData.lastLessonDate;
        const todayStr = today();
        const newStreak = { ...streakData };

        if (lastDate === todayStr) {
          // already counted
        } else if (lastDate === null || lastDate !== yesterday()) {
          newStreak.currentStreak = 1;
        } else if (lastDate === yesterday()) {
          newStreak.currentStreak += 1;
        }

        newStreak.lastLessonDate = todayStr;
        if (newStreak.currentStreak > newStreak.longestStreak) {
          newStreak.longestStreak = newStreak.currentStreak;
        }

        set({
          completedLessons: newCompleted,
          completedDates: {
            ...completedDates,
            [todayStr]: (completedDates[todayStr] || 0) + 1,
          },
          currentLessonId: nextLessonId,
          streakData: newStreak,
        });
      },

      checkAndResetStreak: () => {
        const { streakData } = get();
        if (streakData.lastLessonDate && streakData.lastLessonDate < yesterday()) {
          set({
            streakData: {
              ...streakData,
              currentStreak: 0,
              lastLessonDate: null,
            },
          });
        }
      },
    }),
    {
      name: "progress",
      storage: createJSONStorage(() => zustandMmkvStorage),
    },
  ),
);
