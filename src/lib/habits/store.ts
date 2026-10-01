import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CheckIn, Habit, PersistedState, Settings, UndoEntry, WeeklyReview } from "./types";
import { DEFAULT_SETTINGS, checkKey } from "./types";
import { newId, toISODate } from "./logic";
import { seedHistory, starterHabits } from "./seed";

type HabitDraft = Omit<Habit, "id" | "createdAt" | "sort" | "archived" | "paused">;

type Store = PersistedState & {
  undo: UndoEntry;
  hydrated: boolean;
  selectedDate: string;
  ensureSeed: () => void;
  setHydrated: () => void;
  setSelectedDate: (iso: string) => void;
  patchSettings: (patch: Partial<Settings>) => void;
  addHabit: (draft: HabitDraft) => string;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setPaused: (id: string, paused: boolean) => void;
  setArchived: (id: string, archived: boolean) => void;
  moveHabit: (id: string, dir: -1 | 1) => void;
  toggleBoolean: (habitId: string, date: string) => void;
  adjustCount: (habitId: string, date: string, delta: number) => void;
  skipDay: (habitId: string, date: string) => void;
  setNote: (habitId: string, date: string, note: string) => void;
  toggleRestDay: (date: string) => void;
  saveReview: (review: WeeklyReview) => void;
  replaceAll: (data: PersistedState) => void;
  resetAll: () => void;
  applyUndo: () => void;
  markSheetsSync: () => void;
};

function nextSort(habits: Habit[]): number {
  return habits.reduce((m, h) => Math.max(m, h.sort), -1) + 1;
}

function withUndoCheck(
  checkIns: Record<string, CheckIn>,
  key: string,
  next: CheckIn | undefined,
): { checkIns: Record<string, CheckIn>; undo: UndoEntry } {
  const prev = checkIns[key];
  const copy = { ...checkIns };
  if (!next || (next.value <= 0 && !next.skipped && !next.note)) delete copy[key];
  else copy[key] = next;
  return { checkIns: copy, undo: { kind: "check", key, prev } };
}

export const useHabitStore = create<Store>()(
  persist(
    (set, get) => ({
      habits: [],
      checkIns: {},
      settings: { ...DEFAULT_SETTINGS },
      reviews: {},
      restDays: [],
      undo: null,
      hydrated: false,
      selectedDate: toISODate(new Date()),
      setHydrated: () => set({ hydrated: true }),
      ensureSeed: () => {
        const { settings } = get();
        if (settings.initialized) return;
        const habits = starterHabits();
        set({
          habits,
          checkIns: seedHistory(habits),
          settings: { ...settings, initialized: true, seenWelcome: true },
        });
      },
      setSelectedDate: (iso) => set({ selectedDate: iso }),
      patchSettings: (patch) =>
        set({ settings: { ...get().settings, ...patch } }),
      addHabit: (draft) => {
        const id = newId();
        const habit: Habit = {
          ...draft,
          id,
          archived: false,
          paused: false,
          createdAt: new Date().toISOString(),
          sort: nextSort(get().habits),
        };
        set({ habits: [...get().habits, habit] });
        return id;
      },
      updateHabit: (id, patch) =>
        set({
          habits: get().habits.map((h) => (h.id === id ? { ...h, ...patch, id } : h)),
        }),
      deleteHabit: (id) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return;
        const related: Record<string, CheckIn> = {};
        const checkIns = { ...get().checkIns };
        for (const key of Object.keys(checkIns)) {
          if (key.startsWith(`${id}:`)) {
            related[key] = checkIns[key]!;
            delete checkIns[key];
          }
        }
        set({
          habits: get().habits.filter((h) => h.id !== id),
          checkIns,
          undo: { kind: "habit-delete", habit, related },
        });
      },
      setPaused: (id, paused) =>
        set({
          habits: get().habits.map((h) => (h.id === id ? { ...h, paused } : h)),
        }),
      setArchived: (id, archived) =>
        set({
          habits: get().habits.map((h) => (h.id === id ? { ...h, archived, paused: archived ? h.paused : h.paused } : h)),
        }),
      moveHabit: (id, dir) => {
        const habits = activeHabitsSorted(get().habits);
        const i = habits.findIndex((h) => h.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= habits.length) return;
        const a = habits[i]!;
        const b = habits[j]!;
        set({
          habits: get().habits.map((h) => {
            if (h.id === a.id) return { ...h, sort: b.sort };
            if (h.id === b.id) return { ...h, sort: a.sort };
            return h;
          }),
        });
      },
      toggleBoolean: (habitId, date) => {
        const key = checkKey(habitId, date);
        const prev = get().checkIns[key];
        const next = prev && prev.value >= 1 && !prev.skipped
          ? undefined
          : { value: 1, note: prev?.note };
        set(withUndoCheck(get().checkIns, key, next));
        buzz();
      },
      adjustCount: (habitId, date, delta) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return;
        const key = checkKey(habitId, date);
        const prev = get().checkIns[key];
        const value = Math.max(0, Math.min(habit.target * 3, (prev?.value ?? 0) + delta));
        const next = value === 0 && !prev?.note ? undefined : { value, note: prev?.note };
        set(withUndoCheck(get().checkIns, key, next));
        if (delta > 0) buzz();
      },
      skipDay: (habitId, date) => {
        const key = checkKey(habitId, date);
        const prev = get().checkIns[key];
        const next = prev?.skipped ? undefined : { value: 0, skipped: true, note: prev?.note };
        set(withUndoCheck(get().checkIns, key, next));
      },
      setNote: (habitId, date, note) => {
        const key = checkKey(habitId, date);
        const prev = get().checkIns[key];
        const trimmed = note.trim();
        const next: CheckIn | undefined = prev
          ? { ...prev, note: trimmed || undefined }
          : trimmed
            ? { value: 0, note: trimmed }
            : undefined;
        set(withUndoCheck(get().checkIns, key, next));
      },
      toggleRestDay: (date) => {
        const restDays = get().restDays.includes(date)
          ? get().restDays.filter((d) => d !== date)
          : [...get().restDays, date];
        set({ restDays });
      },
      saveReview: (review) =>
        set({ reviews: { ...get().reviews, [review.weekStart]: review } }),
      replaceAll: (data) =>
        set({
          habits: data.habits,
          checkIns: data.checkIns,
          settings: { ...DEFAULT_SETTINGS, ...data.settings, initialized: true },
          reviews: data.reviews ?? {},
          restDays: data.restDays ?? [],
        }),
      resetAll: () => {
        const habits = starterHabits();
        set({
          habits,
          checkIns: seedHistory(habits),
          settings: { ...DEFAULT_SETTINGS, initialized: true, seenWelcome: true },
          reviews: {},
          restDays: [],
          undo: null,
          selectedDate: toISODate(new Date()),
        });
      },
      applyUndo: () => {
        const undo = get().undo;
        if (!undo) return;
        if (undo.kind === "check") {
          const checkIns = { ...get().checkIns };
          if (undo.prev) checkIns[undo.key] = undo.prev;
          else delete checkIns[undo.key];
          set({ checkIns, undo: null });
          return;
        }
        set({
          habits: [...get().habits, undo.habit],
          checkIns: { ...get().checkIns, ...undo.related },
          undo: null,
        });
      },
      markSheetsSync: () =>
        set({
          settings: { ...get().settings, lastSheetsSync: new Date().toISOString() },
        }),
    }),
    {
      name: "daymark-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s): PersistedState => ({
        habits: s.habits,
        checkIns: s.checkIns,
        settings: s.settings,
        reviews: s.reviews,
        restDays: s.restDays,
      }),
    },
  ),
);

function activeHabitsSorted(habits: Habit[]): Habit[] {
  return habits
    .filter((h) => !h.archived)
    .slice()
    .sort((a, b) => a.sort - b.sort);
}

function buzz() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
  } catch {
    /* ignore */
  }
}

export function exportSnapshot(): PersistedState {
  const s = useHabitStore.getState();
  return {
    habits: s.habits,
    checkIns: s.checkIns,
    settings: s.settings,
    reviews: s.reviews,
    restDays: s.restDays,
  };
}
