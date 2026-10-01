import { format } from "date-fns";
import type { CheckIn, Habit, PersistedState } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { frequencyLabel } from "./logic";

export const APPS_SCRIPT = `/**
 * Daymark → Google Sheets
 *
 * 1. Open a Google Sheet (or create one)
 * 2. Extensions → Apps Script
 * 3. Delete any stub code, paste this file, click Save
 * 4. Deploy → New deployment → Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Copy the web app URL into Daymark → Settings → Sheets URL
 * 6. Tap "Sync to Sheets"
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActive();
    writeSheet_(ss, "Habits", habitRows_(payload.habits || []));
    writeSheet_(ss, "Check-ins", checkInRows_(payload.checkIns || {}, payload.habits || []));
    writeSheet_(ss, "Rest days", [["Date"]].concat((payload.restDays || []).map(function (d) { return [d]; })));
    writeSheet_(ss, "Meta", [
      ["Key", "Value"],
      ["Synced at", new Date().toISOString()],
      ["Display name", (payload.settings && payload.settings.displayName) || ""],
      ["Week starts on", (payload.settings && payload.settings.weekStartsOn) === 0 ? "Sunday" : "Monday"],
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, at: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, app: "Daymark" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function habitRows_(habits) {
  var rows = [["Id", "Name", "Identity", "Color", "Icon", "Category", "Time of day", "Frequency", "Type", "Target", "Unit", "Reminder", "Paused", "Archived"]];
  habits.forEach(function (h) {
    rows.push([
      h.id, h.name, h.identity || "", h.color, h.icon, h.category, h.timeOfDay,
      freq_(h.frequency), h.goalType, h.target, h.unit || "", h.reminder || "",
      h.paused ? "yes" : "no", h.archived ? "yes" : "no",
    ]);
  });
  return rows;
}

function checkInRows_(checkIns, habits) {
  var names = {};
  habits.forEach(function (h) { names[h.id] = h.name; });
  var rows = [["Date", "Habit", "Habit id", "Value", "Skipped", "Note"]];
  Object.keys(checkIns).sort().forEach(function (key) {
    var parts = key.split(":");
    var id = parts[0];
    var date = parts.slice(1).join(":");
    var c = checkIns[key] || {};
    rows.push([date, names[id] || "", id, c.value || 0, c.skipped ? "yes" : "no", c.note || ""]);
  });
  return rows;
}

function freq_(f) {
  if (!f) return "";
  if (f.kind === "daily") return "daily";
  if (f.kind === "weekly") return f.times + "x/week";
  return (f.days || []).join(",");
}

function writeSheet_(ss, name, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  if (!rows.length) return;
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);
  try { sheet.autoResizeColumns(1, rows[0].length); } catch (e) {}
}
`;

export function snapshotToJson(data: PersistedState): string {
  return JSON.stringify({ app: "daymark", version: 1, ...data }, null, 2);
}

export function parseSnapshot(raw: string): PersistedState {
  const parsed = JSON.parse(raw) as Partial<PersistedState> & { habits?: Habit[] };
  if (!Array.isArray(parsed.habits)) throw new Error("This file is not a Daymark backup.");
  return {
    habits: parsed.habits,
    checkIns: (parsed.checkIns ?? {}) as Record<string, CheckIn>,
    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}), initialized: true },
    reviews: parsed.reviews ?? {},
    restDays: parsed.restDays ?? [],
  };
}

export function snapshotToCsv(data: PersistedState): string {
  const names = new Map(data.habits.map((h) => [h.id, h.name]));
  const lines = ["Date,Habit,HabitId,Value,Skipped,Note"];
  const keys = Object.keys(data.checkIns).sort();
  for (const key of keys) {
    const [id, date] = splitKey(key);
    const c = data.checkIns[key]!;
    lines.push(
      [date, csv(names.get(id) ?? ""), csv(id), String(c.value ?? 0), c.skipped ? "yes" : "no", csv(c.note ?? "")].join(","),
    );
  }
  return lines.join("\n");
}

export function habitsToCsv(habits: Habit[]): string {
  const lines = [
    "Name,Identity,Color,Category,Time,Frequency,Type,Target,Unit,Reminder,Paused,Archived",
  ];
  for (const h of habits) {
    lines.push(
      [
        csv(h.name),
        csv(h.identity),
        h.color,
        h.category,
        h.timeOfDay,
        csv(frequencyLabel(h.frequency)),
        h.goalType,
        String(h.target),
        csv(h.unit),
        h.reminder ?? "",
        h.paused ? "yes" : "no",
        h.archived ? "yes" : "no",
      ].join(","),
    );
  }
  return lines.join("\n");
}

function splitKey(key: string): [string, string] {
  const i = key.indexOf(":");
  return [key.slice(0, i), key.slice(i + 1)];
}

function csv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function stamp(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export async function syncToSheets(url: string, data: PersistedState): Promise<void> {
  const payload = { app: "daymark", version: 1, ...data };
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
