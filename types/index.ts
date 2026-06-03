export type UserGoalType = "chords" | "solo" | "rhythm" | "complete";

export type ExerciseType = "quiz" | "practice" | "video";

export type LessonStatus = "locked" | "available" | "completed";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Exercise {
  id: string;
  title: string;
  instructions: string;
  type: ExerciseType;
  quizData?: QuizQuestion;
  tips?: string;
  diagramUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  module: string;
  goalTypes: UserGoalType[];
  videoUrl?: string;
  exercises: Exercise[];
}

export interface StudyPlan {
  daysOfWeek: number[];
  startTime: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLessonDate: string | null;
}

export interface UserProgress {
  completedLessons: string[];
  currentLessonId: string;
  streakData: StreakData;
}
