import { X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { colorVar } from "@/components/app/bits";
import { HABIT_ICON_IDS, HabitGlyph } from "@/components/app/habit-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { frequencyLabel } from "@/lib/habits/logic";
import { useHabitStore } from "@/lib/habits/store";
import {
  CATEGORIES,
  HABIT_COLOR_IDS,
  TIME_OF_DAY,
  type Category,
  type Frequency,
  type Habit,
  type HabitColorId,
  type HabitIconId,
  type TimeOfDay,
} from "@/lib/habits/types";
import { cn } from "@/lib/utils";

const DAY_BITS = [
  { n: 1, l: "M" },
  { n: 2, l: "T" },
  { n: 3, l: "W" },
  { n: 4, l: "T" },
  { n: 5, l: "F" },
  { n: 6, l: "S" },
  { n: 0, l: "S" },
];

type Draft = {
  name: string;
  identity: string;
  color: HabitColorId;
  icon: HabitIconId;
  category: Category;
  timeOfDay: TimeOfDay;
  freqKind: "daily" | "days" | "weekly";
  days: number[];
  times: number;
  goalType: "boolean" | "count";
  target: number;
  unit: string;
  reminder: string;
};

function fromHabit(h?: Habit): Draft {
  if (!h) {
    return {
      name: "",
      identity: "",
      color: "sage",
      icon: "leaf",
      category: "health",
      timeOfDay: "morning",
      freqKind: "daily",
      days: [1, 2, 3, 4, 5],
      times: 3,
      goalType: "boolean",
      target: 1,
      unit: "",
      reminder: "",
    };
  }
  return {
    name: h.name,
    identity: h.identity,
    color: h.color,
    icon: h.icon,
    category: h.category,
    timeOfDay: h.timeOfDay,
    freqKind: h.frequency.kind,
    days: h.frequency.kind === "days" ? h.frequency.days : [1, 2, 3, 4, 5],
    times: h.frequency.kind === "weekly" ? h.frequency.times : 3,
    goalType: h.goalType,
    target: h.target,
    unit: h.unit,
    reminder: h.reminder ?? "",
  };
}

function toFrequency(d: Draft): Frequency {
  if (d.freqKind === "daily") return { kind: "daily" };
  if (d.freqKind === "weekly") return { kind: "weekly", times: Math.max(1, Math.min(7, d.times)) };
  return { kind: "days", days: d.days.length ? d.days : [1] };
}

export function HabitEditor({
  habitId,
  onClose,
}: {
  habitId: string | null;
  onClose: () => void;
}) {
  const habits = useHabitStore((s) => s.habits);
  const existing = habitId ? habits.find((h) => h.id === habitId) : undefined;
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const setPaused = useHabitStore((s) => s.setPaused);
  const setArchived = useHabitStore((s) => s.setArchived);
  const skipDay = useHabitStore((s) => s.skipDay);
  const selectedDate = useHabitStore((s) => s.selectedDate);

  const [draft, setDraft] = useState<Draft>(() => fromHabit(existing));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));
  const freq = useMemo(() => toFrequency(draft), [draft]);

  function save() {
    const name = draft.name.trim();
    if (!name) return;
    const body = {
      name,
      identity: draft.identity.trim(),
      color: draft.color,
      icon: draft.icon,
      category: draft.category,
      timeOfDay: draft.timeOfDay,
      frequency: freq,
      goalType: draft.goalType,
      target: draft.goalType === "count" ? Math.max(1, draft.target) : 1,
      unit: draft.goalType === "count" ? draft.unit.trim() : "",
      reminder: draft.reminder || null,
    };
    if (existing) updateHabit(existing.id, body);
    else addHabit(body);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-fg/40 p-0 md:p-6">
      <div className="flex h-full w-full max-w-[430px] flex-col bg-bg md:rounded-[var(--radius-2xl)] md:shadow-[var(--shadow-phone)]">
        <header className="flex items-center justify-between px-4 py-3">
          <p className="font-display text-xl">{existing ? "Edit habit" : "New habit"}</p>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="flex flex-col gap-5">
            <Field label="Name">
              <Input
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="Morning walk"
                autoFocus={!existing}
              />
            </Field>
            <Field label="I am someone who…">
              <Textarea
                value={draft.identity}
                onChange={(e) => patch({ identity: e.target.value })}
                placeholder="moves a little every day"
                rows={2}
              />
            </Field>

            <Field label="Color">
              <div className="flex flex-wrap gap-2">
                {HABIT_COLOR_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={id}
                    onClick={() => patch({ color: id })}
                    className={cn(
                      "size-10 rounded-full",
                      draft.color === id && "outline outline-2 outline-offset-2 outline-fg",
                    )}
                    style={{ background: colorVar(id) }}
                  />
                ))}
              </div>
            </Field>

            <Field label="Icon">
              <div className="grid grid-cols-5 gap-2">
                {HABIT_ICON_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-label={id}
                    onClick={() => patch({ icon: id })}
                    className={cn(
                      "grid h-12 place-items-center rounded-[var(--radius-md)] bg-bg-subtle",
                      draft.icon === id && "bg-accent text-accent-fg",
                    )}
                  >
                    <HabitGlyph id={id} />
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Time of day">
              <div className="grid grid-cols-2 gap-2">
                {TIME_OF_DAY.map((id) => (
                  <Chip key={id} on={draft.timeOfDay === id} onClick={() => patch({ timeOfDay: id })}>
                    {id}
                  </Chip>
                ))}
              </div>
            </Field>

            <Field label="Schedule">
              <div className="grid grid-cols-3 gap-2">
                {(["daily", "days", "weekly"] as const).map((id) => (
                  <Chip key={id} on={draft.freqKind === id} onClick={() => patch({ freqKind: id })}>
                    {id === "daily" ? "Daily" : id === "days" ? "Days" : "Weekly"}
                  </Chip>
                ))}
              </div>
              {draft.freqKind === "days" && (
                <div className="mt-3 flex gap-1">
                  {DAY_BITS.map((d) => (
                    <button
                      key={d.n}
                      type="button"
                      onClick={() =>
                        patch({
                          days: draft.days.includes(d.n)
                            ? draft.days.filter((x) => x !== d.n)
                            : [...draft.days, d.n],
                        })
                      }
                      className={cn(
                        "h-11 flex-1 rounded-[var(--radius-md)] text-sm font-medium",
                        draft.days.includes(d.n) ? "bg-accent text-accent-fg" : "bg-bg-subtle",
                      )}
                    >
                      {d.l}
                    </button>
                  ))}
                </div>
              )}
              {draft.freqKind === "weekly" && (
                <div className="mt-3 flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={7}
                    value={draft.times}
                    onChange={(e) => patch({ times: Number(e.target.value) || 1 })}
                    className="w-20"
                  />
                  <span className="text-sm text-fg-muted">times each week</span>
                </div>
              )}
              <p className="mt-2 text-xs text-fg-muted">{frequencyLabel(freq)}</p>
            </Field>

            <Field label="How you count it">
              <div className="grid grid-cols-2 gap-2">
                <Chip on={draft.goalType === "boolean"} onClick={() => patch({ goalType: "boolean" })}>
                  Yes / no
                </Chip>
                <Chip on={draft.goalType === "count"} onClick={() => patch({ goalType: "count" })}>
                  A number
                </Chip>
              </div>
              {draft.goalType === "count" && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={draft.target}
                    onChange={(e) => patch({ target: Number(e.target.value) || 1 })}
                    aria-label="Target"
                  />
                  <Input
                    value={draft.unit}
                    onChange={(e) => patch({ unit: e.target.value })}
                    placeholder="glasses"
                    aria-label="Unit"
                  />
                </div>
              )}
            </Field>

            <Field label="Area">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((id) => (
                  <Chip key={id} on={draft.category === id} onClick={() => patch({ category: id })}>
                    {id}
                  </Chip>
                ))}
              </div>
            </Field>

            <Field label="Reminder (on this device)">
              <Input
                type="time"
                value={draft.reminder}
                onChange={(e) => patch({ reminder: e.target.value })}
              />
            </Field>

            {existing && (
              <div className="flex flex-col gap-2">
                <Button variant="secondary" onClick={() => skipDay(existing.id, selectedDate)}>
                  Skip today
                </Button>
                <Button variant="secondary" onClick={() => setPaused(existing.id, !existing.paused)}>
                  {existing.paused ? "Resume" : "Pause"}
                </Button>
                <Button variant="secondary" onClick={() => { setArchived(existing.id, true); onClose(); }}>
                  Archive
                </Button>
                {confirmDelete ? (
                  <div className="rounded-[var(--radius-lg)] bg-bg-elevated p-3 shadow-[var(--shadow-border)]">
                    <p className="text-sm">Delete {existing.name} and its history?</p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="danger"
                        className="flex-1"
                        onClick={() => {
                          deleteHabit(existing.id);
                          onClose();
                        }}
                      >
                        Delete
                      </Button>
                      <Button variant="secondary" className="flex-1" onClick={() => setConfirmDelete(false)}>
                        Keep
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" className="text-danger" onClick={() => setConfirmDelete(true)}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-border px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <Button className="w-full" size="lg" onClick={save} disabled={!draft.name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium capitalize",
        on ? "bg-accent text-accent-fg" : "bg-bg-subtle text-fg",
      )}
    >
      {children}
    </button>
  );
}
