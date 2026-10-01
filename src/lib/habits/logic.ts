import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import type { CheckIn, Frequency, Habit, Settings } from "./types";
import { checkKey } from "./types";

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function fromISODate(iso: string): Date {
  return parseISO(`${iso}T12:00:00`);
}

export function startOfDayLocal(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function weekdayLabel(weekStartsOn: 0 | 1, index: number): string {
  const names = weekStartsOn === 1
    ? ["M", "T", "W", "T", "F", "S", "S"]
    : ["S", "M", "T", "W", "T", "F", "S"];
  return names[index] ?? "";
}

export function weekdayFull(weekStartsOn: 0 | 1, index: number): string {
  const names = weekStartsOn === 1
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return names[index] ?? "";
}

export function weekDays(anchor: Date, weekStartsOn: 0 | 1): Date[] {
  const start = startOfWeek(anchor, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function monthGrid(anchor: Date, weekStartsOn: 0 | 1): Date[] {
  const start = startOfWeek(startOfMonth(anchor), { weekStartsOn });
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function greeting(now: Date): { hello: string; line: string } {
  const hour = now.getHours();
  if (hour < 12) {
    return { hello: "Good morning", line: "Start where you are." };
  }
  if (hour < 17) {
    return { hello: "Good afternoon", line: "There is still room in the day." };
  }
  return { hello: "Good evening", line: "Close the day with care." };
}

export function isDueOn(
  habit: Habit,
  date: Date,
  weekStartsOn: 0 | 1,
  checkIns: Record<string, CheckIn>,
): boolean {
  if (habit.archived || habit.paused) return false;
  const created = habit.createdAt.slice(0, 10);
  if (toISODate(date) < created) return false;
  const freq = habit.frequency;
  if (freq.kind === "daily") return true;
  if (freq.kind === "days") return freq.days.includes(getDay(date));
  const iso = toISODate(date);
  const week = weekDays(date, weekStartsOn);
  const doneToday = isComplete(habit, checkIns[checkKey(habit.id, iso)]);
  if (doneToday) return true;
  const hitsBefore = week.filter((d) => {
    const di = toISODate(d);
    if (di >= iso) return false;
    return isComplete(habit, checkIns[checkKey(habit.id, di)]);
  }).length;
  return hitsBefore < freq.times;
}

export function isComplete(habit: Habit, check?: CheckIn): boolean {
  if (!check || check.skipped) return false;
  const need = habit.goalType === "count" ? habit.target : 1;
  return check.value >= need;
}

export function isSkipped(check?: CheckIn): boolean {
  return Boolean(check?.skipped);
}

export function activeHabits(habits: Habit[]): Habit[] {
  return habits
    .filter((h) => !h.archived)
    .slice()
    .sort((a, b) => a.sort - b.sort || a.createdAt.localeCompare(b.createdAt));
}

const TIME_ORDER: Record<Habit["timeOfDay"], number> = {
  morning: 0,
  afternoon: 1,
  evening: 2,
  anytime: 3,
};

export function groupedForDay(
  habits: Habit[],
  date: Date,
  weekStartsOn: 0 | 1,
  checkIns: Record<string, CheckIn>,
): { time: Habit["timeOfDay"]; habits: Habit[] }[] {
  const due = activeHabits(habits)
    .filter((h) => !h.paused)
    .filter((h) => isDueOn(h, date, weekStartsOn, checkIns))
    .sort((a, b) => TIME_ORDER[a.timeOfDay] - TIME_ORDER[b.timeOfDay] || a.sort - b.sort);

  const groups: { time: Habit["timeOfDay"]; habits: Habit[] }[] = [];
  for (const time of ["morning", "afternoon", "evening", "anytime"] as const) {
    const list = due.filter((h) => h.timeOfDay === time);
    if (list.length) groups.push({ time, habits: list });
  }
  return groups;
}

export function dayStats(
  habits: Habit[],
  date: Date,
  weekStartsOn: 0 | 1,
  checkIns: Record<string, CheckIn>,
  restDays: string[],
): { done: number; total: number; pct: number; rest: boolean } {
  const iso = toISODate(date);
  const rest = restDays.includes(iso);
  const due = activeHabits(habits).filter(
    (h) => !h.paused && isDueOn(h, date, weekStartsOn, checkIns),
  );
  const done = due.filter((h) => isComplete(h, checkIns[checkKey(h.id, iso)])).length;
  const total = due.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct, rest };
}

function wasKept(
  habit: Habit,
  iso: string,
  checkIns: Record<string, CheckIn>,
  restDays: string[],
): "complete" | "skip" | "rest" | "miss" | "none" {
  const check = checkIns[checkKey(habit.id, iso)];
  if (isComplete(habit, check)) return "complete";
  if (isSkipped(check)) return "skip";
  if (restDays.includes(iso)) return "rest";
  return "miss";
}

export function currentStreak(
  habit: Habit,
  checkIns: Record<string, CheckIn>,
  restDays: string[],
  weekStartsOn: 0 | 1,
  today: Date,
): number {
  if (habit.frequency.kind === "weekly") {
    return weeklyStreak(habit, checkIns, weekStartsOn, today);
  }
  let streak = 0;
  let cursor = startOfDayLocal(today);
  for (let i = 0; i < 800; i++) {
    const iso = toISODate(cursor);
    if (iso < habit.createdAt.slice(0, 10)) break;
    const due = isDueOn(habit, cursor, weekStartsOn, checkIns);
    if (!due) {
      cursor = subDays(cursor, 1);
      continue;
    }
    const kept = wasKept(habit, iso, checkIns, restDays);
    if (kept === "complete") streak += 1;
    else if (kept === "skip" || kept === "rest") {
      /* hold */
    } else {
      if (isSameDay(cursor, today)) {
        cursor = subDays(cursor, 1);
        continue;
      }
      break;
    }
    cursor = subDays(cursor, 1);
  }
  return streak;
}

function weeklyStreak(
  habit: Habit,
  checkIns: Record<string, CheckIn>,
  weekStartsOn: 0 | 1,
  today: Date,
): number {
  const times = habit.frequency.kind === "weekly" ? habit.frequency.times : 1;
  let streak = 0;
  let cursor = startOfWeek(today, { weekStartsOn });
  for (let w = 0; w < 80; w++) {
    const days = weekDays(cursor, weekStartsOn);
    const hits = days.filter((d) =>
      isComplete(habit, checkIns[checkKey(habit.id, toISODate(d))]),
    ).length;
    const isThisWeek = isSameDay(cursor, startOfWeek(today, { weekStartsOn }));
    if (hits >= times) streak += 1;
    else if (isThisWeek) {
      cursor = subDays(cursor, 7);
      continue;
    } else break;
    cursor = subDays(cursor, 7);
  }
  return streak;
}

export function bestStreak(
  habit: Habit,
  checkIns: Record<string, CheckIn>,
  restDays: string[],
  weekStartsOn: 0 | 1,
  today: Date,
): number {
  if (habit.frequency.kind === "weekly") {
    return currentStreak(habit, checkIns, restDays, weekStartsOn, today);
  }
  let best = 0;
  let run = 0;
  const created = startOfDayLocal(fromISODate(habit.createdAt.slice(0, 10)));
  const end = startOfDayLocal(today);
  if (created > end) return 0;
  const days = eachDayOfInterval({ start: created, end });
  for (const day of days) {
    if (!isDueOn(habit, day, weekStartsOn, checkIns)) continue;
    const kept = wasKept(habit, toISODate(day), checkIns, restDays);
    if (kept === "complete") {
      run += 1;
      if (run > best) best = run;
    } else if (kept === "skip" || kept === "rest") {
      /* hold */
    } else {
      run = 0;
    }
  }
  return Math.max(best, currentStreak(habit, checkIns, restDays, weekStartsOn, today));
}

export function rateInRange(
  habit: Habit,
  checkIns: Record<string, CheckIn>,
  from: Date,
  to: Date,
  weekStartsOn: 0 | 1,
): { done: number; due: number; pct: number } {
  const days = eachDayOfInterval({ start: startOfDayLocal(from), end: startOfDayLocal(to) });
  let due = 0;
  let done = 0;
  for (const day of days) {
    if (!isDueOn(habit, day, weekStartsOn, checkIns)) continue;
    due += 1;
    if (isComplete(habit, checkIns[checkKey(habit.id, toISODate(day))])) done += 1;
  }
  return { done, due, pct: due === 0 ? 0 : Math.round((done / due) * 100) };
}

export function overallRange(
  habits: Habit[],
  checkIns: Record<string, CheckIn>,
  from: Date,
  to: Date,
  weekStartsOn: 0 | 1,
): { done: number; due: number; pct: number } {
  const list = activeHabits(habits).filter((h) => !h.paused);
  let done = 0;
  let due = 0;
  for (const habit of list) {
    const r = rateInRange(habit, checkIns, from, to, weekStartsOn);
    done += r.done;
    due += r.due;
  }
  return { done, due, pct: due === 0 ? 0 : Math.round((done / due) * 100) };
}

export function weekCompletions(
  habits: Habit[],
  checkIns: Record<string, CheckIn>,
  restDays: string[],
  weekStartsOn: 0 | 1,
  anchor: Date,
): { date: Date; iso: string; pct: number; done: number; total: number }[] {
  return weekDays(anchor, weekStartsOn).map((date) => {
    const stats = dayStats(habits, date, weekStartsOn, checkIns, restDays);
    return { date, iso: toISODate(date), ...stats };
  });
}

export type Insight = { title: string; body: string };

export function buildInsights(
  habits: Habit[],
  checkIns: Record<string, CheckIn>,
  restDays: string[],
  settings: Settings,
  today: Date,
): Insight[] {
  const list = activeHabits(habits).filter((h) => !h.paused);
  if (list.length === 0) {
    return [{ title: "Add a habit", body: "Start with one small promise you can keep today." }];
  }
  const insights: Insight[] = [];
  const last30 = subDays(today, 29);
  let best = list[0]!;
  let bestRate = -1;
  let hardest = list[0]!;
  let hardRate = 101;
  for (const h of list) {
    const r = rateInRange(h, checkIns, last30, today, settings.weekStartsOn);
    if (r.due >= 3 && r.pct > bestRate) {
      best = h;
      bestRate = r.pct;
    }
    if (r.due >= 3 && r.pct < hardRate) {
      hardest = h;
      hardRate = r.pct;
    }
  }
  if (bestRate >= 0) {
    insights.push({
      title: `${best.name} is taking root`,
      body: `${bestRate}% kept over the last 30 days. That is the one to protect.`,
    });
  }
  if (hardRate < 70 && hardest.id !== best.id) {
    insights.push({
      title: `${hardest.name} needs a smaller step`,
      body: `${hardRate}% kept this month. Shrink it until it feels almost too easy.`,
    });
  }

  const thisWeek = overallRange(
    list,
    checkIns,
    weekDays(today, settings.weekStartsOn)[0]!,
    today,
    settings.weekStartsOn,
  );
  const prevStart = subDays(weekDays(today, settings.weekStartsOn)[0]!, 7);
  const prevEnd = subDays(weekDays(today, settings.weekStartsOn)[0]!, 1);
  const lastWeek = overallRange(list, checkIns, prevStart, prevEnd, settings.weekStartsOn);
  if (thisWeek.due > 0 && lastWeek.due > 0) {
    const delta = thisWeek.pct - lastWeek.pct;
    if (delta >= 8) {
      insights.push({
        title: "This week is stronger",
        body: `${thisWeek.pct}% so far, up ${delta} points from last week.`,
      });
    } else if (delta <= -8) {
      insights.push({
        title: "A gentler week",
        body: `You are at ${thisWeek.pct}%. One kept promise today still turns the page.`,
      });
    }
  }

  const streaks = list.map((h) => ({
    h,
    n: currentStreak(h, checkIns, restDays, settings.weekStartsOn, today),
  }));
  streaks.sort((a, b) => b.n - a.n);
  const lead = streaks[0];
  if (lead && lead.n >= 3) {
    insights.push({
      title: `${lead.n}-day streak on ${lead.h.name}`,
      body: "Do not break the chain today if you can help it.",
    });
  }

  const unique: Insight[] = [];
  for (const item of insights) {
    if (!unique.some((u) => u.title === item.title)) unique.push(item);
  }
  return unique.slice(0, 3);
}

export function weekTimesHit(
  habit: Habit,
  checkIns: Record<string, CheckIn>,
  weekStartsOn: 0 | 1,
  date: Date,
): number {
  return weekDays(date, weekStartsOn).filter((d) =>
    isComplete(habit, checkIns[checkKey(habit.id, toISODate(d))]),
  ).length;
}

export function frequencyLabel(freq: Frequency): string {
  if (freq.kind === "daily") return "Every day";
  if (freq.kind === "weekly") return `${freq.times}× a week`;
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (freq.days.length === 5 && [1, 2, 3, 4, 5].every((d) => freq.days.includes(d))) {
    return "Weekdays";
  }
  if (freq.days.length === 2 && freq.days.includes(0) && freq.days.includes(6)) {
    return "Weekends";
  }
  return freq.days.map((d) => names[d]).join(" · ");
}

export function hash01(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
