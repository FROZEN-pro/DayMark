import { eachDayOfInterval, subDays } from "date-fns";
import { hash01, toISODate } from "./logic";
import type { CheckIn, Habit } from "./types";
import { checkKey } from "./types";

export function starterHabits(now = new Date()): Habit[] {
  const createdDay = toISODate(subDays(now, 28));
  const createdAt = `${createdDay}T08:00:00.000Z`;
  const habits: Habit[] = [
    {
      id: "seed-water",
      name: "Drink water",
      identity: "I take care of this body.",
      color: "ocean",
      icon: "droplets",
      category: "health",
      timeOfDay: "anytime",
      frequency: { kind: "daily" },
      goalType: "count",
      target: 8,
      unit: "glasses",
      reminder: "10:00",
      archived: false,
      paused: false,
      createdAt: `${createdDay}T08:00:00.000Z`,
      sort: 0,
    },
    {
      id: "seed-walk",
      name: "Morning walk",
      identity: "I move a little every day.",
      color: "sage",
      icon: "footprints",
      category: "health",
      timeOfDay: "morning",
      frequency: { kind: "daily" },
      goalType: "boolean",
      target: 1,
      unit: "",
      reminder: "07:30",
      archived: false,
      paused: false,
      createdAt,
      sort: 1,
    },
    {
      id: "seed-stretch",
      name: "Stretch",
      identity: "I meet the morning gently.",
      color: "moss",
      icon: "person",
      category: "health",
      timeOfDay: "morning",
      frequency: { kind: "daily" },
      goalType: "boolean",
      target: 1,
      unit: "",
      reminder: null,
      archived: false,
      paused: false,
      createdAt,
      sort: 2,
    },
    {
      id: "seed-read",
      name: "Read",
      identity: "I keep a quiet mind.",
      color: "clay",
      icon: "book",
      category: "mind",
      timeOfDay: "evening",
      frequency: { kind: "daily" },
      goalType: "boolean",
      target: 1,
      unit: "",
      reminder: "20:30",
      archived: false,
      paused: false,
      createdAt,
      sort: 3,
    },
    {
      id: "seed-sleep",
      name: "Lights out",
      identity: "I protect my sleep.",
      color: "dusk",
      icon: "moon",
      category: "rest",
      timeOfDay: "evening",
      frequency: { kind: "days", days: [0, 1, 2, 3, 4] },
      goalType: "boolean",
      target: 1,
      unit: "",
      reminder: "22:30",
      archived: false,
      paused: false,
      createdAt,
      sort: 4,
    },
  ];
  return habits;
}

export function seedHistory(habits: Habit[], now = new Date()): Record<string, CheckIn> {
  const start = subDays(now, 27);
  const days = eachDayOfInterval({ start, end: now });
  const out: Record<string, CheckIn> = {};
  const today = toISODate(now);

  for (const habit of habits) {
    for (const day of days) {
      const iso = toISODate(day);
      if (iso === today) continue;
      const n = hash01(`${habit.id}:${iso}`);
      if (n < 0.18) continue;
      if (n < 0.24) {
        out[checkKey(habit.id, iso)] = { skipped: true, value: 0 };
        continue;
      }
      if (habit.goalType === "count") {
        out[checkKey(habit.id, iso)] = {
          value: n > 0.4 ? habit.target : Math.max(1, habit.target - 2),
        };
      } else {
        out[checkKey(habit.id, iso)] = { value: 1 };
      }
      if (n > 0.92) {
        out[checkKey(habit.id, iso)]!.note = habit.id === "seed-read" ? "A few quiet pages." : "Felt good.";
      }
    }
  }
  return out;
}
