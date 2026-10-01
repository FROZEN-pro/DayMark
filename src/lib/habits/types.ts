export const HABIT_COLOR_IDS = [
  "sage",
  "ocean",
  "clay",
  "cedar",
  "slate",
  "rose",
  "moss",
  "dusk",
] as const;
export type HabitColorId = (typeof HABIT_COLOR_IDS)[number];

export const HABIT_ICON_IDS = [
  "droplets",
  "footprints",
  "book",
  "moon",
  "heart",
  "dumbbell",
  "leaf",
  "sun",
  "home",
  "brain",
  "coffee",
  "pen",
  "person",
  "apple",
  "waves",
  "users",
  "bed",
  "wind",
  "timer",
  "smile",
] as const;
export type HabitIconId = (typeof HABIT_ICON_IDS)[number];

export const TIME_OF_DAY = ["morning", "afternoon", "evening", "anytime"] as const;
export type TimeOfDay = (typeof TIME_OF_DAY)[number];

export const CATEGORIES = ["health", "mind", "home", "work", "people", "rest"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Frequency =
  | { kind: "daily" }
  | { kind: "days"; days: number[] }
  | { kind: "weekly"; times: number };

export type Habit = {
  id: string;
  name: string;
  identity: string;
  color: HabitColorId;
  icon: HabitIconId;
  category: Category;
  timeOfDay: TimeOfDay;
  frequency: Frequency;
  goalType: "boolean" | "count";
  target: number;
  unit: string;
  reminder: string | null;
  archived: boolean;
  paused: boolean;
  createdAt: string;
  sort: number;
};

export type CheckIn = {
  value: number;
  note?: string;
  skipped?: boolean;
};

export type WeeklyReview = {
  weekStart: string;
  well: string;
  hard: string;
  next: string;
};

export type Settings = {
  initialized: boolean;
  seenWelcome: boolean;
  displayName: string;
  weekStartsOn: 0 | 1;
  theme: "light" | "dark" | "system";
  typeScale: "regular" | "large";
  reminders: boolean;
  sheetsUrl: string;
  lastSheetsSync: string | null;
};

export type UndoEntry =
  | { kind: "check"; key: string; prev: CheckIn | undefined }
  | { kind: "habit-delete"; habit: Habit; related: Record<string, CheckIn> }
  | null;

export type TabId = "today" | "plan" | "progress" | "habits";

export type PersistedState = {
  habits: Habit[];
  checkIns: Record<string, CheckIn>;
  settings: Settings;
  reviews: Record<string, WeeklyReview>;
  restDays: string[];
};

export const DEFAULT_SETTINGS: Settings = {
  initialized: false,
  seenWelcome: false,
  displayName: "",
  weekStartsOn: 1,
  theme: "system",
  typeScale: "regular",
  reminders: false,
  sheetsUrl: "",
  lastSheetsSync: null,
};

export function checkKey(habitId: string, date: string) {
  return `${habitId}:${date}`;
}
