import { Link } from "@tanstack/react-router";
import { BarChart3, CalendarDays, ListChecks, Plus, Settings as SettingsIcon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { HabitsView } from "@/components/app/habits";
import { HabitEditor } from "@/components/app/editor";
import { PlanView } from "@/components/app/plan";
import { ProgressView } from "@/components/app/progress";
import { SettingsScreen } from "@/components/app/settings";
import { TodayView } from "@/components/app/today";
import { Button } from "@/components/ui/button";
import { useHabitStore } from "@/lib/habits/store";
import type { TabId } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

const TABS: { id: TabId; label: string; icon: typeof SunMedium }[] = [
  { id: "today", label: "Today", icon: SunMedium },
  { id: "plan", label: "Plan", icon: CalendarDays },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "habits", label: "Habits", icon: ListChecks },
];

export function AppShell({ tab }: { tab: TabId }) {
  const settings = useHabitStore((s) => s.settings);
  const patchSettings = useHabitStore((s) => s.patchSettings);
  const [editor, setEditor] = useState<string | null | "new">(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useTheme(settings.theme);

  useEffect(() => {
    document.documentElement.dataset.scale = settings.typeScale;
  }, [settings.typeScale]);

  return (
    <div className="min-h-dvh bg-studio">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-bg text-fg md:min-h-[min(860px,100dvh)] md:rounded-[2rem] md:shadow-[var(--shadow-phone)]">
        <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <p className="font-display text-lg tracking-[-0.02em]">Daymark</p>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Add habit"
              onClick={() => setEditor("new")}
            >
              <Plus />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon />
            </Button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pt-2">
          {tab === "today" && (
            <TodayView onEdit={(id) => setEditor(id)} onAdd={() => setEditor("new")} />
          )}
          {tab === "plan" && <PlanView />}
          {tab === "progress" && <ProgressView />}
          {tab === "habits" && (
            <HabitsView onEdit={(id) => setEditor(id)} onAdd={() => setEditor("new")} />
          )}
        </main>

        <nav
          className="grid grid-cols-4 border-t border-border bg-bg px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          aria-label="Primary"
        >
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <Link
                key={item.id}
                to="/"
                search={{ tab: item.id }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] text-[11px] font-medium",
                  active ? "text-accent" : "text-fg-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {editor !== null && (
        <HabitEditor habitId={editor === "new" ? null : editor} onClose={() => setEditor(null)} />
      )}
      {settingsOpen && <SettingsScreen onClose={() => setSettingsOpen(false)} />}
      {!settings.seenWelcome && (
        <Welcome onDone={() => patchSettings({ seenWelcome: true })} />
      )}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-sans",
          style: {
            background: "var(--color-bg-elevated)",
            color: "var(--color-fg)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </div>
  );
}

function Welcome({ onDone }: { onDone: () => void }) {
  const displayName = useHabitStore((s) => s.settings.displayName);
  const patchSettings = useHabitStore((s) => s.patchSettings);
  const [name, setName] = useState(displayName);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-bg">
      <div className="flex h-full w-full max-w-[430px] flex-col justify-between px-6 py-10">
        <div className="stagger-in pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-muted">Daymark</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-[-0.03em]">
            A quieter way to keep daily promises.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-fg-muted">
            Check off the day. Watch the week. Your record stays on this phone, even offline.
          </p>
          <label className="mt-8 block text-sm font-medium text-fg-muted">
            What should we call you?
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-14 w-full rounded-[var(--radius-lg)] bg-bg-subtle px-4 text-lg text-fg outline-none"
              placeholder="Optional"
            />
          </label>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            patchSettings({ displayName: name.trim(), seenWelcome: true });
            onDone();
          }}
        >
          Begin
        </Button>
      </div>
    </div>
  );
}

function useTheme(theme: "light" | "dark" | "system") {
  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark: boolean) => root.classList.toggle("dark", dark);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);
      const onChange = () => apply(mq.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    apply(theme === "dark");
  }, [theme]);
}

export function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-studio">
      <div className="flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-bg md:min-h-[min(860px,100dvh)] md:rounded-[2rem]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted">Daily direction</p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.03em]">Daymark</h1>
      </div>
    </div>
  );
}
