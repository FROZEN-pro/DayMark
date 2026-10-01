import { addMonths, format, isSameMonth, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyNote, MonthDots, Panel, SectionLabel, colorVar } from "@/components/app/bits";
import { HabitGlyph } from "@/components/app/habit-icon";
import { Button } from "@/components/ui/button";
import {
  activeHabits,
  fromISODate,
  isComplete,
  isDueOn,
  monthGrid,
  toISODate,
  weekDays,
  weekdayLabel,
} from "@/lib/habits/logic";
import { useHabitStore } from "@/lib/habits/store";
import { checkKey } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

export function PlanView() {
  const habits = useHabitStore((s) => s.habits);
  const checkIns = useHabitStore((s) => s.checkIns);
  const restDays = useHabitStore((s) => s.restDays);
  const settings = useHabitStore((s) => s.settings);
  const selectedDate = useHabitStore((s) => s.selectedDate);
  const setSelectedDate = useHabitStore((s) => s.setSelectedDate);
  const toggleBoolean = useHabitStore((s) => s.toggleBoolean);
  const [mode, setMode] = useState<"week" | "month">("week");
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));

  const selected = fromISODate(selectedDate);
  const live = activeHabits(habits).filter((h) => !h.paused);
  const week = weekDays(selected, settings.weekStartsOn);
  const grid = useMemo(
    () => monthGrid(monthCursor, settings.weekStartsOn),
    [monthCursor, settings.weekStartsOn],
  );

  const weekDone = week.filter((d) => {
    const due = live.filter((h) => isDueOn(h, d, settings.weekStartsOn, checkIns));
    if (due.length === 0) return false;
    return due.every((h) => isComplete(h, checkIns[checkKey(h.id, toISODate(d))]));
  }).length;

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header>
        <p className="text-sm text-fg-muted">Plan</p>
        <h1 className="mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em]">
          {mode === "week" ? "This week at a glance" : format(monthCursor, "MMMM yyyy")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          {mode === "week"
            ? `${weekDone} of 7 days fully kept. Tap a circle to check a day.`
            : "Scan the month. Darker marks mean a fuller day."}
        </p>
      </header>

      <div className="flex rounded-full bg-bg-subtle p-1">
        {(["week", "month"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={cn(
              "h-10 flex-1 rounded-full text-sm font-medium capitalize",
              mode === id ? "bg-bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-fg-muted",
            )}
          >
            {id}
          </button>
        ))}
      </div>

      {live.length === 0 ? (
        <EmptyNote title="No active habits" body="Add something small you can repeat." />
      ) : mode === "week" ? (
        <Panel className="overflow-x-auto p-3">
          <div className="min-w-[20rem]">
            <div className="mb-2 grid" style={{ gridTemplateColumns: `minmax(7rem,1.4fr) repeat(7, 1fr)` }}>
              <div />
              {week.map((d, i) => (
                <button
                  key={toISODate(d)}
                  type="button"
                  onClick={() => setSelectedDate(toISODate(d))}
                  className={cn(
                    "flex flex-col items-center rounded-[var(--radius-md)] py-1 text-[11px]",
                    toISODate(d) === selectedDate ? "bg-accent text-accent-fg" : "text-fg-muted",
                  )}
                >
                  <span className="uppercase tracking-wide">{weekdayLabel(settings.weekStartsOn, i)}</span>
                  <span className="tabular font-semibold text-sm">{format(d, "d")}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              {live.map((habit) => (
                <div
                  key={habit.id}
                  className="grid items-center"
                  style={{ gridTemplateColumns: `minmax(7rem,1.4fr) repeat(7, 1fr)` }}
                >
                  <div className="flex min-w-0 items-center gap-2 pr-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: colorVar(habit.color) }}
                    />
                    <span className="truncate text-sm font-medium">{habit.name}</span>
                  </div>
                  {week.map((d) => {
                    const iso = toISODate(d);
                    const due = isDueOn(habit, d, settings.weekStartsOn, checkIns);
                    const done = isComplete(habit, checkIns[checkKey(habit.id, iso)]);
                    const rest = restDays.includes(iso);
                    return (
                      <div key={iso} className="grid place-items-center">
                        <button
                          type="button"
                          disabled={!due}
                          onClick={() => {
                            if (habit.goalType === "boolean") toggleBoolean(habit.id, iso);
                            setSelectedDate(iso);
                          }}
                          aria-label={`${habit.name} ${iso}`}
                          className={cn(
                            "size-8 rounded-full transition-transform duration-[var(--motion-quick)] active:scale-[0.96]",
                            !due && "opacity-20",
                            due && !done && "bg-bg-subtle",
                            rest && due && !done && "outline outline-1 outline-border-strong",
                          )}
                          style={done ? { background: colorVar(habit.color) } : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      ) : (
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous month"
              onClick={() => setMonthCursor((m) => addMonths(m, -1))}
            >
              <ChevronLeft />
            </Button>
            <p className="font-display text-lg">{format(monthCursor, "MMMM yyyy")}</p>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next month"
              onClick={() => setMonthCursor((m) => addMonths(m, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <MonthDots
            days={grid}
            month={monthCursor}
            selected={selected}
            weekStartsOn={settings.weekStartsOn}
            habits={habits}
            checkIns={checkIns}
            restDays={restDays}
            onSelect={(iso) => {
              setSelectedDate(iso);
              const d = fromISODate(iso);
              if (!isSameMonth(d, monthCursor)) setMonthCursor(startOfMonth(d));
            }}
          />
        </Panel>
      )}

      <section className="flex flex-col gap-2">
        <SectionLabel>On {format(selected, "EEEE d MMM")}</SectionLabel>
        {live.filter((h) => isDueOn(h, selected, settings.weekStartsOn, checkIns)).length === 0 ? (
          <p className="text-sm text-fg-muted">Nothing scheduled.</p>
        ) : (
          live
            .filter((h) => isDueOn(h, selected, settings.weekStartsOn, checkIns))
            .map((h) => {
              const done = isComplete(h, checkIns[checkKey(h.id, selectedDate)]);
              return (
                <div
                  key={h.id}
                  className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-bg-elevated px-3 py-3 shadow-[var(--shadow-border)]"
                >
                  <span
                    className="grid size-9 place-items-center rounded-[var(--radius-sm)]"
                    style={{ background: colorVar(h.color), color: "var(--color-bg-elevated)" }}
                  >
                    <HabitGlyph id={h.icon} className="size-4" />
                  </span>
                  <span className="flex-1 font-medium">{h.name}</span>
                  <span className="text-sm text-fg-muted">{done ? "Kept" : "Open"}</span>
                </div>
              );
            })
        )}
      </section>
    </div>
  );
}
