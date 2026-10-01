import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Splash } from "@/components/app/shell";
import { useHabitStore } from "@/lib/habits/store";
import type { TabId } from "@/lib/habits/types";

function parseTab(raw: unknown): TabId {
  if (raw === "plan" || raw === "progress" || raw === "habits") return raw;
  return "today";
}

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): { tab: TabId } => ({
    tab: parseTab(raw.tab),
  }),
  component: Home,
});

function Home() {
  const { tab } = Route.useSearch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      useHabitStore.getState().ensureSeed();
      useHabitStore.getState().setHydrated();
      setReady(true);
    };

    const persistApi = useHabitStore.persist;
    const unsub = persistApi.onFinishHydration(() => finish());
    if (persistApi.hasHydrated()) finish();
    else {
      const result = persistApi.rehydrate();
      void Promise.resolve(result).then(finish, finish);
    }
    const fallback = window.setTimeout(finish, 400);

    return () => {
      cancelled = true;
      unsub();
      window.clearTimeout(fallback);
    };
  }, []);

  if (!ready) return <Splash />;
  return <AppShell tab={tab} />;
}
