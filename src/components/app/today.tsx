import { format, isToday } from "date-fns";
import { Flame, Minus, Plus, Undo2 } from "lucide-react";
import { useMemo } from "react";
import { CheckMark, ProgressRing, SectionLabel, WeekStrip, colorVar } from "@/components/app/bits";
import { HabitGlyph } from "@/components/app/habit-icon";
import { Button } from "@/components/ui/button";
import {
  currentStreak,
  dayStats,
  fromISODate,
  greeting,
  groupedForDay,
  isComplete,
  isSkipped,
  toISODate,
  weekTimesHit,
} from "@/lib/habits/logic";
import { useHabitStore } from "@/lib/habits/store";
import { checkKey } from "@/lib/habits/types";
import type { Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

const TIME_LABEL = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  anytime: "Anytime",
};

export function TodayView({
  onEdit,
  onAdd,
}: {
  onEdit: (id: string) => void;
  onAdd: () => void;
}) {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useHabitStore((s) => s.checkIns);
  const restDays = useHabitStore((s) => s.restDays);
  const settings = useHabitStore((s) => s.settings);
  const selectedDate = useHabitStore((s) => s.selectedDate);
  const undo = useHabitStore((s) => s.undo);
  const setSelectedDate = useHabitStore((s) => s.setSelectedDate);
  const toggleBoolean = useHabitStore((s) => s.toggleBoolean);
  const adjustCount = useHabitStore((s) => s.adjustCount);
  const skipDay = useHabitStore((s) => s.skipDay);
  const toggleRestDay = useHabitStore((s) => s.toggleRestDay);
  const applyUndo = useHabitStore((s) => s.applyUndo);

  const date = fromISODate(selectedDate);
  const today = isToday(date);
  const greet = greeting(new Date());
  const groups = groupedForDay(habits, date, settings.weekStartsOn, checkIns);
  const stats = dayStats(habits, date, settings.weekStartsOn, checkIns, restDays);
  const name = settings.displayName.trim();
  const rest = restDays.includes(selectedDate);

  const dueReminders = useMemo(() => {
    if (!settings.reminders || !today) return [];
    const hhmm = format(new Date(), "HH:mm");
    return groups.flatMap((g) => g.habits).filter((h) => {
      if (!h.reminder || h.reminder > hhmm) return false;
      const c = checkIns[checkKey(h.id, selectedDate)];
      return !isComplete(h, c) && !isSkipped(c);
    });
  }, [checkIns, groups, selectedDate, settings.reminders, today]);

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header className="stagger-in flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-fg-muted">{format(date, "EEEE d MMMM")}</p>
          <h1 className="mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em] text-fg">
            {today ? `${greet.hello}${name ? `, ${name}` : ""}` : format(date, "d MMMM")}
          </h1>
          <p className="mt-1 text-sm text-fg-muted">{today ? greet.line : "A day in the record."}</p>
        </div>
        <ProgressRing pct={stats.pct}>
          <div className="text-center">
            <p className="tabular text-lg font-semibold leading-none">{stats.pct}%</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-fg-muted">
              {stats.done}/{stats.total}
            </p>
          </div>
        </ProgressRing>
      </header>

      <WeekStrip
        anchor={date}
        selected={date}
        weekStartsOn={settings.weekStartsOn}
        habits={habits}
        checkIns={checkIns}
        restDays={restDays}
        onSelect={setSelectedDate}
      />

      {dueReminders.length > 0 && (
        <div className="rounded-[var(--radius-lg)] bg-bg-elevated px-4 py-3 text-sm shadow-[var(--shadow-border)]">
          <p className="font-medium">Still waiting</p>
          <p className="mt-0.5 text-fg-muted">
            {dueReminders.map((h) => h.name).join(", ")}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant={rest ? "primary" : "secondary"}
          size="pill"
          onClick={() => toggleRestDay(selectedDate)}
        >
          {rest ? "Rest day on" : "Mark rest day"}
        </Button>
        {!today && (
          <Button variant="ghost" size="pill" onClick={() => setSelectedDate(toISODate(new Date()))}>
            Back to today
          </Button>
        )}
        {undo && (
          <Button variant="ghost" size="pill" onClick={applyUndo} className="ml-auto">
            <Undo2 className="size-4" />
            Undo
          </Button>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] bg-bg-elevated px-5 py-10 text-center shadow-[var(--shadow-border)]">
          <p className="font-display text-2xl">Nothing due</p>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {rest
              ? "Rest is part of the plan. Enjoy the quiet."
              : "Add a habit, or pick another day on the strip."}
          </p>
          <Button className="mt-5" onClick={onAdd}>
            Add a habit
          </Button>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.time} className="flex flex-col gap-2">
            <SectionLabel>{TIME_LABEL[group.time]}</SectionLabel>
            <ul className="flex flex-col gap-2">
              {group.habits.map((habit) => (
                <li key={habit.id}>
                  <HabitRow
                    habit={habit}
                    date={selectedDate}
                    onOpen={() => onEdit(habit.id)}
                    onToggle={() => toggleBoolean(habit.id, selectedDate)}
                    onAdjust={(d) => adjustCount(habit.id, selectedDate, d)}
                    onSkip={() => skipDay(habit.id, selectedDate)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function HabitRow({
  habit,
  date,
  onOpen,
  onToggle,
  onAdjust,
  onSkip,
}: {
  habit: Habit;
  date: string;
  onOpen: () => void;
  onToggle: () => void;
  onAdjust: (delta: number) => void;
  onSkip: () => void;
}) {
  const check = useHabitStore((s) => s.checkIns[checkKey(habit.id, date)]);
  const checkIns = useHabitStore((s) => s.checkIns);
  const restDays = useHabitStore((s) => s.restDays);
  const weekStartsOn = useHabitStore((s) => s.settings.weekStartsOn);
  const done = isComplete(habit, check);
  const skipped = isSkipped(check);
  const streak = currentStreak(habit, checkIns, restDays, weekStartsOn, fromISODate(date));
  const weekly =
    habit.frequency.kind === "weekly"
      ? weekTimesHit(habit, checkIns, weekStartsOn, fromISODate(date))
      : null;

  return (
    <article
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-xl)] bg-bg-elevated p-3 pr-3 shadow-[var(--shadow-border)]",
        (done || skipped) && "opacity-80",
      )}
    >
      <span
        className="h-12 w-1.5 shrink-0 rounded-full"
        style={{ background: colorVar(habit.color) }}
        aria-hidden
      />
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-[var(--radius-sm)]"
            style={{ background: colorVar(habit.color), color: "var(--color-bg-elevated)" }}
          >
            <HabitGlyph id={habit.icon} className="size-4" />
          </span>
          <div className="min-w-0">
            <p className={cn("truncate font-medium", done && "text-fg-muted")}>{habit.name}</p>
            <p className="truncate text-xs text-fg-muted">
              {habit.identity || (weekly !== null ? `${weekly} of ${habit.frequency.kind === "weekly" ? habit.frequency.times : 0} this week` : "Keep the promise")}
            </p>
          </div>
        </div>
      </button>
      <div className="flex items-center gap-2">
        {streak > 0 && !skipped && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-fg-muted tabular">
            <Flame className="size-3.5" />
            {streak}
          </span>
        )}
        {skipped ? (
          <Button variant="secondary" size="pill" onClick={onSkip} className="h-10">
            Skipped
          </Button>
        ) : habit.goalType === "count" ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease"
              onClick={() => onAdjust(-1)}
              className="grid size-11 place-items-center rounded-full bg-bg-subtle"
            >
              <Minus className="size-4" />
            </button>
            <span className="tabular min-w-8 text-center text-sm font-semibold">
              {check?.value ?? 0}
              <span className="block text-[10px] font-medium text-fg-muted">/{habit.target}</span>
            </span>
            <button
              type="button"
              aria-label="Increase"
              onClick={() => onAdjust(1)}
              className="grid size-11 place-items-center rounded-full bg-bg-subtle"
            >
              <Plus className="size-4" />
            </button>
          </div>
        ) : (
          <CheckMark
            on={done}
            color={habit.color}
            onClick={onToggle}
            label={done ? `Undo ${habit.name}` : `Complete ${habit.name}`}
          />
        )}
      </div>
    </article>
  );
}
