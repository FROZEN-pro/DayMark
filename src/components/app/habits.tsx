import { Archive, ChevronDown, ChevronUp, Pause, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { EmptyNote, SectionLabel, colorVar } from "@/components/app/bits";
import { HabitGlyph } from "@/components/app/habit-icon";
import { Button } from "@/components/ui/button";
import { activeHabits, frequencyLabel } from "@/lib/habits/logic";
import { useHabitStore } from "@/lib/habits/store";
import { cn } from "@/lib/utils";

export function HabitsView({
  onEdit,
  onAdd,
}: {
  onEdit: (id: string) => void;
  onAdd: () => void;
}) {
  const habits = useHabitStore((s) => s.habits);
  const moveHabit = useHabitStore((s) => s.moveHabit);
  const setPaused = useHabitStore((s) => s.setPaused);
  const setArchived = useHabitStore((s) => s.setArchived);
  const [showArchived, setShowArchived] = useState(false);
  const live = activeHabits(habits);
  const archived = habits.filter((h) => h.archived);

  return (
    <div className="flex flex-col gap-5 pb-8">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-fg-muted">Habits</p>
          <h1 className="mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em]">
            Your list
          </h1>
        </div>
        <Button onClick={onAdd} size="pill">
          <Plus className="size-4" />
          Add
        </Button>
      </header>

      {live.length === 0 ? (
        <EmptyNote
          title="Start with one"
          body="A single daily promise is enough. You can grow the list later."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {live.map((habit, i) => (
            <li
              key={habit.id}
              className={cn(
                "flex items-center gap-2 rounded-[var(--radius-xl)] bg-bg-elevated p-3 shadow-[var(--shadow-border)]",
                habit.paused && "opacity-70",
              )}
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => moveHabit(habit.id, -1)}
                  className="grid size-9 place-items-center rounded-[var(--radius-sm)] text-fg-muted disabled:opacity-30"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={i === live.length - 1}
                  onClick={() => moveHabit(habit.id, 1)}
                  className="grid size-9 place-items-center rounded-[var(--radius-sm)] text-fg-muted disabled:opacity-30"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <button type="button" onClick={() => onEdit(habit.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <span
                  className="grid size-11 place-items-center rounded-[var(--radius-md)]"
                  style={{ background: colorVar(habit.color), color: "var(--color-bg-elevated)" }}
                >
                  <HabitGlyph id={habit.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{habit.name}</span>
                  <span className="block truncate text-xs text-fg-muted">
                    {frequencyLabel(habit.frequency)}
                    {habit.paused ? " · Paused" : ""}
                    {habit.goalType === "count" ? ` · ${habit.target} ${habit.unit}` : ""}
                  </span>
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={habit.paused ? "Resume" : "Pause"}
                onClick={() => setPaused(habit.id, !habit.paused)}
              >
                <Pause className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(habit.id)}>
                <Pencil className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {archived.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-fg-muted"
          >
            <Archive className="size-4" />
            Archived ({archived.length})
          </button>
          {showArchived && (
            <ul className="mt-2 flex flex-col gap-2">
              {archived.map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center justify-between rounded-[var(--radius-lg)] bg-bg-elevated px-3 py-3 shadow-[var(--shadow-border)]"
                >
                  <span className="font-medium text-fg-muted">{habit.name}</span>
                  <Button variant="secondary" size="pill" onClick={() => setArchived(habit.id, false)}>
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="text-sm text-fg-muted">
        <SectionLabel>Tip</SectionLabel>
        <span className="mt-1 block leading-relaxed">
          Pause when life is loud. Archive when a season ends. Deleting wipes the history.
        </span>
      </p>
    </div>
  );
}
