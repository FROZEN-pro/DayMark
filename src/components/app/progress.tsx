import { format, getDay, startOfWeek, subDays } from "date-fns";
import { Flame } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { EmptyNote, Panel, ProgressRing, SectionLabel, colorVar } from "@/components/app/bits";
import { HabitGlyph } from "@/components/app/habit-icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  activeHabits,
  bestStreak,
  buildInsights,
  currentStreak,
  overallRange,
  rateInRange,
  toISODate,
  weekCompletions,
  weekdayFull,
} from "@/lib/habits/logic";
import { useHabitStore } from "@/lib/habits/store";
import type { Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

export function ProgressView() {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useHabitStore((s) => s.checkIns);
  const restDays = useHabitStore((s) => s.restDays);
  const settings = useHabitStore((s) => s.settings);
  const reviews = useHabitStore((s) => s.reviews);
  const saveReview = useHabitStore((s) => s.saveReview);
  const today = new Date();
  const live = activeHabits(habits);
  const weekStart = startOfWeek(today, { weekStartsOn: settings.weekStartsOn });
  const weekKey = toISODate(weekStart);
  const existing = reviews[weekKey];

  const week = overallRange(live, checkIns, weekStart, today, settings.weekStartsOn);
  const month = overallRange(live, checkIns, subDays(today, 29), today, settings.weekStartsOn);
  const chart = weekCompletions(habits, checkIns, restDays, settings.weekStartsOn, today).map(
    (d, i) => ({
      label: weekdayFull(settings.weekStartsOn, i).slice(0, 2),
      pct: d.pct,
    }),
  );
  const insights = buildInsights(habits, checkIns, restDays, settings, today);
  const bestDay = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const dues = [0, 0, 0, 0, 0, 0, 0];
    for (const h of live) {
      for (let i = 0; i < 30; i++) {
        const day = subDays(today, i);
        const r = rateInRange(h, checkIns, day, day, settings.weekStartsOn);
        const wd = getDay(day);
        dues[wd] += r.due;
        counts[wd] += r.done;
      }
    }
    let idx = Number(settings.weekStartsOn);
    let best = -1;
    for (let i = 0; i < 7; i++) {
      if (dues[i] === 0) continue;
      const pct = counts[i]! / dues[i]!;
      if (pct > best) {
        best = pct;
        idx = i;
      }
    }
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return { name: names[idx] ?? "Monday", pct: best < 0 ? 0 : Math.round(best * 100) };
  }, [checkIns, live, settings.weekStartsOn, today]);

  const [well, setWell] = useState(existing?.well ?? "");
  const [hard, setHard] = useState(existing?.hard ?? "");
  const [next, setNext] = useState(existing?.next ?? "");

  if (live.length === 0) {
    return (
      <div className="pb-8">
        <h1 className="font-display text-[1.85rem] tracking-[-0.03em]">Progress</h1>
        <div className="mt-6">
          <EmptyNote title="No story yet" body="Keep a few days and your numbers will appear here." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header>
        <p className="text-sm text-fg-muted">Progress</p>
        <h1 className="mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em]">
          Your quiet numbers
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Panel className="flex flex-col items-center gap-2 py-5">
          <ProgressRing pct={week.pct} size={96}>
            <p className="tabular text-xl font-semibold">{week.pct}%</p>
          </ProgressRing>
          <p className="text-sm text-fg-muted">This week</p>
        </Panel>
        <Panel className="flex flex-col justify-center gap-3 py-5">
          <div>
            <p className="tabular text-2xl font-semibold">{month.pct}%</p>
            <p className="text-sm text-fg-muted">Last 30 days</p>
          </div>
          <div>
            <p className="tabular text-2xl font-semibold">{bestDay.pct}%</p>
            <p className="text-sm text-fg-muted">Best on {bestDay.name}s</p>
          </div>
        </Panel>
      </div>

      <Panel>
        <SectionLabel>Week score</SectionLabel>
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} barCategoryGap="28%">
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-fg-muted)", fontSize: 12 }}
              />
              <Bar dataKey="pct" fill="var(--color-accent)" radius={[8, 8, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {insights.length > 0 && (
        <section className="flex flex-col gap-2">
          <SectionLabel>Insights</SectionLabel>
          {insights.map((item) => (
            <Panel key={item.title}>
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{item.body}</p>
            </Panel>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-2">
        <SectionLabel>Each habit</SectionLabel>
        {live.map((habit) => (
          <HabitStat key={habit.id} habit={habit} />
        ))}
      </section>

      <Panel>
        <SectionLabel>Weekly review</SectionLabel>
        <p className="mt-2 font-display text-xl">Week of {format(weekStart, "d MMM")}</p>
        <p className="mt-1 text-sm text-fg-muted">Three short notes. That is enough.</p>
        <div className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-medium text-fg-muted">
            What went well
            <Textarea className="mt-1" value={well} onChange={(e) => setWell(e.target.value)} rows={2} />
          </label>
          <label className="text-sm font-medium text-fg-muted">
            What was hard
            <Textarea className="mt-1" value={hard} onChange={(e) => setHard(e.target.value)} rows={2} />
          </label>
          <label className="text-sm font-medium text-fg-muted">
            Next week’s one focus
            <Textarea className="mt-1" value={next} onChange={(e) => setNext(e.target.value)} rows={2} />
          </label>
          <Button
            onClick={() => saveReview({ weekStart: weekKey, well, hard, next })}
          >
            Save review
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function HabitStat({ habit }: { habit: Habit }) {
  const checkIns = useHabitStore((s) => s.checkIns);
  const restDays = useHabitStore((s) => s.restDays);
  const weekStartsOn = useHabitStore((s) => s.settings.weekStartsOn);
  const today = new Date();
  const streak = currentStreak(habit, checkIns, restDays, weekStartsOn, today);
  const best = bestStreak(habit, checkIns, restDays, weekStartsOn, today);
  const month = rateInRange(habit, checkIns, subDays(today, 29), today, weekStartsOn);

  return (
    <Panel className="flex items-center gap-3">
      <span
        className="grid size-11 place-items-center rounded-[var(--radius-md)]"
        style={{ background: colorVar(habit.color), color: "var(--color-bg-elevated)" }}
      >
        <HabitGlyph id={habit.icon} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{habit.name}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-subtle">
          <div
            className={cn("h-full rounded-full transition-[width] duration-[var(--motion-slow)]")}
            style={{ width: `${month.pct}%`, background: colorVar(habit.color) }}
          />
        </div>
      </div>
      <div className="text-right">
        <p className="flex items-center justify-end gap-1 tabular text-sm font-semibold">
          <Flame className="size-3.5" />
          {streak}
        </p>
        <p className="text-xs text-fg-muted">best {best} · {month.pct}%</p>
      </div>
    </Panel>
  );
}
