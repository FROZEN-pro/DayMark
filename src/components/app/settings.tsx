import { X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Panel, SectionLabel } from "@/components/app/bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  APPS_SCRIPT,
  downloadText,
  habitsToCsv,
  parseSnapshot,
  snapshotToCsv,
  snapshotToJson,
  stamp,
  syncToSheets,
} from "@/lib/habits/backup";
import { exportSnapshot, useHabitStore } from "@/lib/habits/store";
import type { Settings } from "@/lib/habits/types";

export function SettingsScreen({ onClose }: { onClose: () => void }) {
  const settings = useHabitStore((s) => s.settings);
  const patchSettings = useHabitStore((s) => s.patchSettings);
  const replaceAll = useHabitStore((s) => s.replaceAll);
  const resetAll = useHabitStore((s) => s.resetAll);
  const markSheetsSync = useHabitStore((s) => s.markSheetsSync);
  const online = useOnline();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    patchSettings({ [key]: value } as Partial<Settings>);
  }

  async function onImport(file: File) {
    try {
      const text = await file.text();
      replaceAll(parseSnapshot(text));
      toast.success("Backup restored");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that file");
    }
  }

  async function onSync() {
    const url = settings.sheetsUrl.trim();
    if (!url) {
      toast.error("Paste your Apps Script web app URL first");
      return;
    }
    setBusy(true);
    try {
      await syncToSheets(url, exportSnapshot());
      markSheetsSync();
      toast.success("Sent to Google Sheets");
    } catch {
      toast.error("Could not reach Sheets. Check the URL.");
    } finally {
      setBusy(false);
    }
  }

  async function enableReminders(on: boolean) {
    if (on && typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        /* ignore */
      }
    }
    set("reminders", on);
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-bg">
        <header className="flex items-center justify-between px-4 py-3">
          <p className="font-display text-xl">Settings</p>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 pb-10">
          <div className="flex flex-col gap-5">
            {!online && (
              <Panel>
                <p className="font-medium">You are offline</p>
                <p className="mt-1 text-sm text-fg-muted">
                  Check-offs still save on this phone. Sheets sync waits until you are back.
                </p>
              </Panel>
            )}

            <section className="flex flex-col gap-3">
              <SectionLabel>You</SectionLabel>
              <Label htmlFor="display-name">Name</Label>
              <Input
                id="display-name"
                value={settings.displayName}
                onChange={(e) => set("displayName", e.target.value)}
                placeholder="Optional"
              />
            </section>

            <section className="flex flex-col gap-3">
              <SectionLabel>Comfort</SectionLabel>
              <Row label="Larger text">
                <Switch
                  checked={settings.typeScale === "large"}
                  onCheckedChange={(v) => set("typeScale", v ? "large" : "regular")}
                />
              </Row>
              <Row label="Week starts on Monday">
                <Switch
                  checked={settings.weekStartsOn === 1}
                  onCheckedChange={(v) => set("weekStartsOn", v ? 1 : 0)}
                />
              </Row>
              <p className="text-sm font-medium text-fg-muted">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {(["light", "dark", "system"] as const).map((id) => (
                  <Button
                    key={id}
                    variant={settings.theme === id ? "primary" : "secondary"}
                    size="pill"
                    onClick={() => set("theme", id)}
                    className="capitalize"
                  >
                    {id}
                  </Button>
                ))}
              </div>
              <Row label="Gentle reminders">
                <Switch checked={settings.reminders} onCheckedChange={enableReminders} />
              </Row>
            </section>

            <section className="flex flex-col gap-3">
              <SectionLabel>Backup</SectionLabel>
              <p className="text-sm leading-relaxed text-fg-muted">
                Everything lives on this device. Download a copy, or send it to a Google Sheet.
              </p>
              <Button
                variant="secondary"
                onClick={() =>
                  downloadText(`daymark-${stamp()}.json`, snapshotToJson(exportSnapshot()), "application/json")
                }
              >
                Download JSON
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const data = exportSnapshot();
                  downloadText(`daymark-checkins-${stamp()}.csv`, snapshotToCsv(data), "text/csv");
                  downloadText(`daymark-habits-${stamp()}.csv`, habitsToCsv(data.habits), "text/csv");
                }}
              >
                Download CSV for Sheets
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onImport(file);
                  e.target.value = "";
                }}
              />
              <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                Restore JSON
              </Button>
            </section>

            <section className="flex flex-col gap-3">
              <SectionLabel>Google Sheets</SectionLabel>
              <p className="text-sm leading-relaxed text-fg-muted">
                Paste the Apps Script below into your spreadsheet, deploy it as a web app, then paste the URL here.
              </p>
              <Label htmlFor="sheets-url">Web app URL</Label>
              <Input
                id="sheets-url"
                value={settings.sheetsUrl}
                onChange={(e) => set("sheetsUrl", e.target.value)}
                placeholder="https://script.google.com/macros/s/…/exec"
              />
              <Button onClick={() => void onSync()} disabled={busy || !online}>
                {busy ? "Sending…" : "Sync to Sheets"}
              </Button>
              {settings.lastSheetsSync && (
                <p className="text-xs text-fg-muted">Last sent {settings.lastSheetsSync.slice(0, 16).replace("T", " ")}</p>
              )}
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(APPS_SCRIPT);
                    toast.success("Apps Script copied");
                  } catch {
                    downloadText("daymark-apps-script.gs", APPS_SCRIPT, "text/plain");
                    toast.success("Script downloaded");
                  }
                }}
              >
                Copy Apps Script
              </Button>
            </section>

            <section className="flex flex-col gap-3 pb-6">
              <SectionLabel>Reset</SectionLabel>
              {confirmReset ? (
                <Panel>
                  <p className="text-sm">Replace everything with the starter week?</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="danger"
                      className="flex-1"
                      onClick={() => {
                        resetAll();
                        setConfirmReset(false);
                        toast.success("Starter week restored");
                      }}
                    >
                      Reset
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={() => setConfirmReset(false)}>
                      Keep
                    </Button>
                  </div>
                </Panel>
              ) : (
                <Button variant="ghost" className="text-danger" onClick={() => setConfirmReset(true)}>
                  Reset demo data
                </Button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-3">
      <p className="text-base">{label}</p>
      {children}
    </div>
  );
}

function useOnline() {
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}
