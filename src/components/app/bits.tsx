import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { dayStats, toISODate, weekdayLabel, weekDays } from "@/lib/habits/logic";
import type { CheckIn, Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

export function colorVar(id: string) {
  return `var(--color-habit-${id})`;
}

export function ProgressRing({
  pct,
  size = 88,
  stroke = 7,
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = (clamped / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-bg-subtle"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="text-accent transition-[stroke-dasharray] duration-[var(--motion-slow)] ease-[var(--ease-smooth-out)]"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function CheckMark({
  on,
  color,
  onClick,
  label,
}: {
  on: boolean;
  color: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "relative grid size-14 shrink-0 place-items-center rounded-full transition-[background-color,transform,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "active:scale-[0.96]",
        on ? "check-pop" : "bg-bg-subtle",
      )}
      style={on ? { background: colorVar(color) } : undefined}
    >
      <Check
        className={cn(
          "size-6 transition-[opacity,transform,filter] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
          on ? "scale-100 text-bg-elevated opacity-100" : "scale-75 text-fg-subtle opacity-40",
        )}
        strokeWidth={2.4}
      />
    </button>
  );
}

export function WeekStrip({
  anchor,
  selected,
  weekStartsOn,
  habits,
  checkIns,
  restDays,
  onSelect,
}: {
  anchor: Date;
  selected: Date;
  weekStartsOn: 0 | 1;
  habits: Habit[];
  checkIns: Record<string, CheckIn>;
  restDays: string[];
  onSelect: (iso: string) => void;
}) {
  const days = weekDays(anchor, weekStartsOn);
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day, i) => {
        const iso = toISODate(day);
        const stats = dayStats(habits, day, weekStartsOn, checkIns, restDays);
        const selectedDay = isSameDay(day, selected);
        const today = isToday(day);
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onSelect(iso)}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] px-1 py-2",
              "transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
              selectedDay ? "bg-accent text-accent-fg" : "text-fg",
              !selectedDay && today && "bg-bg-subtle",
            )}
          >
            <span className={cn("text-[11px] font-medium uppercase tracking-wide", selectedDay ? "text-accent-fg/80" : "text-fg-muted")}>
              {weekdayLabel(weekStartsOn, i)}
            </span>
            <span className="tabular text-base font-semibold leading-none">{format(day, "d")}</span>
            <span
              className={cn(
                "size-1.5 rounded-full",
                selectedDay
                  ? stats.pct === 100
                    ? "bg-accent-fg"
                    : stats.pct > 0
                      ? "bg-accent-fg/50"
                      : "bg-accent-fg/20"
                  : stats.pct === 100
                    ? "bg-accent"
                    : stats.pct > 0
                      ? "bg-accent/40"
                      : "bg-border-strong",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function MonthDots({
  days,
  month,
  selected,
  weekStartsOn,
  habits,
  checkIns,
  restDays,
  onSelect,
}: {
  days: Date[];
  month: Date;
  selected: Date;
  weekStartsOn: 0 | 1;
  habits: Habit[];
  checkIns: Record<string, CheckIn>;
  restDays: string[];
  onSelect: (iso: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="pb-1 text-center text-[11px] font-medium uppercase tracking-wide text-fg-muted">
          {weekdayLabel(weekStartsOn, i)}
        </div>
      ))}
      {days.map((day) => {
        const iso = toISODate(day);
        const inMonth = isSameMonth(day, month);
        const stats = dayStats(habits, day, weekStartsOn, checkIns, restDays);
        const selectedDay = isSameDay(day, selected);
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onSelect(iso)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center rounded-[var(--radius-md)] py-1",
              "transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]",
              selectedDay && "bg-accent text-accent-fg",
              !selectedDay && isToday(day) && "bg-bg-subtle",
              !inMonth && "opacity-35",
            )}
          >
            <span className="tabular text-sm font-medium leading-none">{format(day, "d")}</span>
            <span
              className={cn(
                "mt-1 h-1 w-4 rounded-full",
                selectedDay
                  ? stats.pct === 100
                    ? "bg-accent-fg"
                    : stats.pct > 0
                      ? "bg-accent-fg/55"
                      : "bg-accent-fg/20"
                  : stats.pct === 100
                    ? "bg-accent"
                    : stats.pct > 40
                      ? "bg-accent/55"
                      : stats.pct > 0
                        ? "bg-accent/30"
                        : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
      {children}
    </p>
  );
}

export function EmptyNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-bg-elevated px-5 py-8 text-center shadow-[var(--shadow-border)]">
      <p className="font-display text-xl text-fg">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-xl)] bg-bg-elevated p-4 shadow-[var(--shadow-border)]", className)}>
      {children}
    </div>
  );
}
