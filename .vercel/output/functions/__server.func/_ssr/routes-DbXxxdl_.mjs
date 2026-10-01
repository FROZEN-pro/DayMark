import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as ChevronLeft, C as Footprints, D as Coffee, E as Droplets, F as Brain, I as BookOpen, L as BedDouble, M as Check, N as ChartColumn, O as ChevronUp, P as CalendarDays, R as Archive, S as Heart, T as Dumbbell, _ as Moon, a as Undo2, b as Leaf, c as Sun, d as Settings, f as Plus, g as Pause, h as PenLine, i as Users, j as ChevronDown, k as ChevronRight, l as SunMedium, m as Pencil, n as Wind, p as PersonStanding, r as Waves, s as Timer, t as X, u as Smile, v as Minus, w as Flame, x as House, y as ListChecks, z as Apple } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-Bwhp2Mbx.mjs";
import { n as Slot } from "../_libs/@radix-ui/react-primitive+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as getDay, c as eachDayOfInterval, d as addMonths, f as addDays, i as isSameMonth, l as isSameDay, n as subDays, o as format, r as isToday, s as startOfMonth, t as parseISO, u as startOfWeek } from "../_libs/date-fns.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { i as ResponsiveContainer, n as XAxis, r as Bar, t as BarChart } from "../_libs/recharts+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DbXxxdl_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HABIT_COLOR_IDS = [
	"sage",
	"ocean",
	"clay",
	"cedar",
	"slate",
	"rose",
	"moss",
	"dusk"
];
var HABIT_ICON_IDS = [
	"droplets",
	"footprints",
	"book",
	"moon",
	"heart",
	"dumbbell",
	"leaf",
	"sun",
	"home",
	"brain",
	"coffee",
	"pen",
	"person",
	"apple",
	"waves",
	"users",
	"bed",
	"wind",
	"timer",
	"smile"
];
var TIME_OF_DAY = [
	"morning",
	"afternoon",
	"evening",
	"anytime"
];
var CATEGORIES = [
	"health",
	"mind",
	"home",
	"work",
	"people",
	"rest"
];
var DEFAULT_SETTINGS = {
	initialized: false,
	seenWelcome: false,
	displayName: "",
	weekStartsOn: 1,
	theme: "system",
	typeScale: "regular",
	reminders: false,
	sheetsUrl: "",
	lastSheetsSync: null
};
function checkKey(habitId, date) {
	return `${habitId}:${date}`;
}
function toISODate(date) {
	return format(date, "yyyy-MM-dd");
}
function fromISODate(iso) {
	return parseISO(`${iso}T12:00:00`);
}
function startOfDayLocal(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function weekdayLabel(weekStartsOn, index) {
	return (weekStartsOn === 1 ? [
		"M",
		"T",
		"W",
		"T",
		"F",
		"S",
		"S"
	] : [
		"S",
		"M",
		"T",
		"W",
		"T",
		"F",
		"S"
	])[index] ?? "";
}
function weekdayFull(weekStartsOn, index) {
	return (weekStartsOn === 1 ? [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	] : [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	])[index] ?? "";
}
function weekDays(anchor, weekStartsOn) {
	const start = startOfWeek(anchor, { weekStartsOn });
	return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
function monthGrid(anchor, weekStartsOn) {
	const start = startOfWeek(startOfMonth(anchor), { weekStartsOn });
	return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}
function greeting(now) {
	const hour = now.getHours();
	if (hour < 12) return {
		hello: "Good morning",
		line: "Start where you are."
	};
	if (hour < 17) return {
		hello: "Good afternoon",
		line: "There is still room in the day."
	};
	return {
		hello: "Good evening",
		line: "Close the day with care."
	};
}
function isDueOn(habit, date, weekStartsOn, checkIns) {
	if (habit.archived || habit.paused) return false;
	const created = habit.createdAt.slice(0, 10);
	if (toISODate(date) < created) return false;
	const freq = habit.frequency;
	if (freq.kind === "daily") return true;
	if (freq.kind === "days") return freq.days.includes(getDay(date));
	const iso = toISODate(date);
	const week = weekDays(date, weekStartsOn);
	if (isComplete(habit, checkIns[checkKey(habit.id, iso)])) return true;
	return week.filter((d) => {
		const di = toISODate(d);
		if (di >= iso) return false;
		return isComplete(habit, checkIns[checkKey(habit.id, di)]);
	}).length < freq.times;
}
function isComplete(habit, check) {
	if (!check || check.skipped) return false;
	const need = habit.goalType === "count" ? habit.target : 1;
	return check.value >= need;
}
function isSkipped(check) {
	return Boolean(check?.skipped);
}
function activeHabits(habits) {
	return habits.filter((h) => !h.archived).slice().sort((a, b) => a.sort - b.sort || a.createdAt.localeCompare(b.createdAt));
}
var TIME_ORDER = {
	morning: 0,
	afternoon: 1,
	evening: 2,
	anytime: 3
};
function groupedForDay(habits, date, weekStartsOn, checkIns) {
	const due = activeHabits(habits).filter((h) => !h.paused).filter((h) => isDueOn(h, date, weekStartsOn, checkIns)).sort((a, b) => TIME_ORDER[a.timeOfDay] - TIME_ORDER[b.timeOfDay] || a.sort - b.sort);
	const groups = [];
	for (const time of [
		"morning",
		"afternoon",
		"evening",
		"anytime"
	]) {
		const list = due.filter((h) => h.timeOfDay === time);
		if (list.length) groups.push({
			time,
			habits: list
		});
	}
	return groups;
}
function dayStats(habits, date, weekStartsOn, checkIns, restDays) {
	const iso = toISODate(date);
	const rest = restDays.includes(iso);
	const due = activeHabits(habits).filter((h) => !h.paused && isDueOn(h, date, weekStartsOn, checkIns));
	const done = due.filter((h) => isComplete(h, checkIns[checkKey(h.id, iso)])).length;
	const total = due.length;
	return {
		done,
		total,
		pct: total === 0 ? 0 : Math.round(done / total * 100),
		rest
	};
}
function wasKept(habit, iso, checkIns, restDays) {
	const check = checkIns[checkKey(habit.id, iso)];
	if (isComplete(habit, check)) return "complete";
	if (isSkipped(check)) return "skip";
	if (restDays.includes(iso)) return "rest";
	return "miss";
}
function currentStreak(habit, checkIns, restDays, weekStartsOn, today) {
	if (habit.frequency.kind === "weekly") return weeklyStreak(habit, checkIns, weekStartsOn, today);
	let streak = 0;
	let cursor = startOfDayLocal(today);
	for (let i = 0; i < 800; i++) {
		const iso = toISODate(cursor);
		if (iso < habit.createdAt.slice(0, 10)) break;
		if (!isDueOn(habit, cursor, weekStartsOn, checkIns)) {
			cursor = subDays(cursor, 1);
			continue;
		}
		const kept = wasKept(habit, iso, checkIns, restDays);
		if (kept === "complete") streak += 1;
		else if (kept === "skip" || kept === "rest") {} else {
			if (isSameDay(cursor, today)) {
				cursor = subDays(cursor, 1);
				continue;
			}
			break;
		}
		cursor = subDays(cursor, 1);
	}
	return streak;
}
function weeklyStreak(habit, checkIns, weekStartsOn, today) {
	const times = habit.frequency.kind === "weekly" ? habit.frequency.times : 1;
	let streak = 0;
	let cursor = startOfWeek(today, { weekStartsOn });
	for (let w = 0; w < 80; w++) {
		const hits = weekDays(cursor, weekStartsOn).filter((d) => isComplete(habit, checkIns[checkKey(habit.id, toISODate(d))])).length;
		const isThisWeek = isSameDay(cursor, startOfWeek(today, { weekStartsOn }));
		if (hits >= times) streak += 1;
		else if (isThisWeek) {
			cursor = subDays(cursor, 7);
			continue;
		} else break;
		cursor = subDays(cursor, 7);
	}
	return streak;
}
function bestStreak(habit, checkIns, restDays, weekStartsOn, today) {
	if (habit.frequency.kind === "weekly") return currentStreak(habit, checkIns, restDays, weekStartsOn, today);
	let best = 0;
	let run = 0;
	const created = startOfDayLocal(fromISODate(habit.createdAt.slice(0, 10)));
	const end = startOfDayLocal(today);
	if (created > end) return 0;
	const days = eachDayOfInterval({
		start: created,
		end
	});
	for (const day of days) {
		if (!isDueOn(habit, day, weekStartsOn, checkIns)) continue;
		const kept = wasKept(habit, toISODate(day), checkIns, restDays);
		if (kept === "complete") {
			run += 1;
			if (run > best) best = run;
		} else if (kept === "skip" || kept === "rest") {} else run = 0;
	}
	return Math.max(best, currentStreak(habit, checkIns, restDays, weekStartsOn, today));
}
function rateInRange(habit, checkIns, from, to, weekStartsOn) {
	const days = eachDayOfInterval({
		start: startOfDayLocal(from),
		end: startOfDayLocal(to)
	});
	let due = 0;
	let done = 0;
	for (const day of days) {
		if (!isDueOn(habit, day, weekStartsOn, checkIns)) continue;
		due += 1;
		if (isComplete(habit, checkIns[checkKey(habit.id, toISODate(day))])) done += 1;
	}
	return {
		done,
		due,
		pct: due === 0 ? 0 : Math.round(done / due * 100)
	};
}
function overallRange(habits, checkIns, from, to, weekStartsOn) {
	const list = activeHabits(habits).filter((h) => !h.paused);
	let done = 0;
	let due = 0;
	for (const habit of list) {
		const r = rateInRange(habit, checkIns, from, to, weekStartsOn);
		done += r.done;
		due += r.due;
	}
	return {
		done,
		due,
		pct: due === 0 ? 0 : Math.round(done / due * 100)
	};
}
function weekCompletions(habits, checkIns, restDays, weekStartsOn, anchor) {
	return weekDays(anchor, weekStartsOn).map((date) => {
		const stats = dayStats(habits, date, weekStartsOn, checkIns, restDays);
		return {
			date,
			iso: toISODate(date),
			...stats
		};
	});
}
function buildInsights(habits, checkIns, restDays, settings, today) {
	const list = activeHabits(habits).filter((h) => !h.paused);
	if (list.length === 0) return [{
		title: "Add a habit",
		body: "Start with one small promise you can keep today."
	}];
	const insights = [];
	const last30 = subDays(today, 29);
	let best = list[0];
	let bestRate = -1;
	let hardest = list[0];
	let hardRate = 101;
	for (const h of list) {
		const r = rateInRange(h, checkIns, last30, today, settings.weekStartsOn);
		if (r.due >= 3 && r.pct > bestRate) {
			best = h;
			bestRate = r.pct;
		}
		if (r.due >= 3 && r.pct < hardRate) {
			hardest = h;
			hardRate = r.pct;
		}
	}
	if (bestRate >= 0) insights.push({
		title: `${best.name} is taking root`,
		body: `${bestRate}% kept over the last 30 days. That is the one to protect.`
	});
	if (hardRate < 70 && hardest.id !== best.id) insights.push({
		title: `${hardest.name} needs a smaller step`,
		body: `${hardRate}% kept this month. Shrink it until it feels almost too easy.`
	});
	const thisWeek = overallRange(list, checkIns, weekDays(today, settings.weekStartsOn)[0], today, settings.weekStartsOn);
	const lastWeek = overallRange(list, checkIns, subDays(weekDays(today, settings.weekStartsOn)[0], 7), subDays(weekDays(today, settings.weekStartsOn)[0], 1), settings.weekStartsOn);
	if (thisWeek.due > 0 && lastWeek.due > 0) {
		const delta = thisWeek.pct - lastWeek.pct;
		if (delta >= 8) insights.push({
			title: "This week is stronger",
			body: `${thisWeek.pct}% so far, up ${delta} points from last week.`
		});
		else if (delta <= -8) insights.push({
			title: "A gentler week",
			body: `You are at ${thisWeek.pct}%. One kept promise today still turns the page.`
		});
	}
	const streaks = list.map((h) => ({
		h,
		n: currentStreak(h, checkIns, restDays, settings.weekStartsOn, today)
	}));
	streaks.sort((a, b) => b.n - a.n);
	const lead = streaks[0];
	if (lead && lead.n >= 3) insights.push({
		title: `${lead.n}-day streak on ${lead.h.name}`,
		body: "Do not break the chain today if you can help it."
	});
	const unique = [];
	for (const item of insights) if (!unique.some((u) => u.title === item.title)) unique.push(item);
	return unique.slice(0, 3);
}
function weekTimesHit(habit, checkIns, weekStartsOn, date) {
	return weekDays(date, weekStartsOn).filter((d) => isComplete(habit, checkIns[checkKey(habit.id, toISODate(d))])).length;
}
function frequencyLabel(freq) {
	if (freq.kind === "daily") return "Every day";
	if (freq.kind === "weekly") return `${freq.times}× a week`;
	const names = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	];
	if (freq.days.length === 5 && [
		1,
		2,
		3,
		4,
		5
	].every((d) => freq.days.includes(d))) return "Weekdays";
	if (freq.days.length === 2 && freq.days.includes(0) && freq.days.includes(6)) return "Weekends";
	return freq.days.map((d) => names[d]).join(" · ");
}
function hash01(key) {
	let h = 2166136261;
	for (let i = 0; i < key.length; i++) {
		h ^= key.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) % 1e4 / 1e4;
}
function newId() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function colorVar(id) {
	return `var(--color-habit-${id})`;
}
function ProgressRing({ pct, size = 88, stroke = 7, children }) {
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	const dash = Math.max(0, Math.min(100, pct)) / 100 * c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: stroke,
				className: "text-bg-subtle"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: stroke,
				strokeLinecap: "round",
				strokeDasharray: `${dash} ${c}`,
				className: "text-accent transition-[stroke-dasharray] duration-[var(--motion-slow)] ease-[var(--ease-smooth-out)]"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center",
			children
		})]
	});
}
function CheckMark({ on, color, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		"aria-pressed": on,
		onClick,
		className: cn("relative grid size-14 shrink-0 place-items-center rounded-full transition-[background-color,transform,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", "active:scale-[0.96]", on ? "check-pop" : "bg-bg-subtle"),
		style: on ? { background: colorVar(color) } : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: cn("size-6 transition-[opacity,transform,filter] duration-[var(--motion-fast)] ease-[var(--ease-out)]", on ? "scale-100 text-bg-elevated opacity-100" : "scale-75 text-fg-subtle opacity-40"),
			strokeWidth: 2.4
		})
	});
}
function WeekStrip({ anchor, selected, weekStartsOn, habits, checkIns, restDays, onSelect }) {
	const days = weekDays(anchor, weekStartsOn);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-7 gap-1",
		children: days.map((day, i) => {
			const iso = toISODate(day);
			const stats = dayStats(habits, day, weekStartsOn, checkIns, restDays);
			const selectedDay = isSameDay(day, selected);
			const today = isToday(day);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(iso),
				className: cn("flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] px-1 py-2", "transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]", selectedDay ? "bg-accent text-accent-fg" : "text-fg", !selectedDay && today && "bg-bg-subtle"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-[11px] font-medium uppercase tracking-wide", selectedDay ? "text-accent-fg/80" : "text-fg-muted"),
						children: weekdayLabel(weekStartsOn, i)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular text-base font-semibold leading-none",
						children: format(day, "d")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", selectedDay ? stats.pct === 100 ? "bg-accent-fg" : stats.pct > 0 ? "bg-accent-fg/50" : "bg-accent-fg/20" : stats.pct === 100 ? "bg-accent" : stats.pct > 0 ? "bg-accent/40" : "bg-border-strong") })
				]
			}, iso);
		})
	});
}
function MonthDots({ days, month, selected, weekStartsOn, habits, checkIns, restDays, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-7 gap-1",
		children: [Array.from({ length: 7 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pb-1 text-center text-[11px] font-medium uppercase tracking-wide text-fg-muted",
			children: weekdayLabel(weekStartsOn, i)
		}, i)), days.map((day) => {
			const iso = toISODate(day);
			const inMonth = isSameMonth(day, month);
			const stats = dayStats(habits, day, weekStartsOn, checkIns, restDays);
			const selectedDay = isSameDay(day, selected);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(iso),
				className: cn("flex min-h-12 flex-col items-center justify-center rounded-[var(--radius-md)] py-1", "transition-colors duration-[var(--motion-quick)] ease-[var(--ease-out)]", selectedDay && "bg-accent text-accent-fg", !selectedDay && isToday(day) && "bg-bg-subtle", !inMonth && "opacity-35"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular text-sm font-medium leading-none",
					children: format(day, "d")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1 h-1 w-4 rounded-full", selectedDay ? stats.pct === 100 ? "bg-accent-fg" : stats.pct > 0 ? "bg-accent-fg/55" : "bg-accent-fg/20" : stats.pct === 100 ? "bg-accent" : stats.pct > 40 ? "bg-accent/55" : stats.pct > 0 ? "bg-accent/30" : "bg-transparent") })]
			}, iso);
		})]
	});
}
function SectionLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-muted",
		children
	});
}
function EmptyNote({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-xl)] bg-bg-elevated px-5 py-8 text-center shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl text-fg",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-fg-muted",
			children: body
		})]
	});
}
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-[var(--radius-xl)] bg-bg-elevated p-4 shadow-[var(--shadow-border)]", className),
		children
	});
}
var MAP = {
	droplets: Droplets,
	footprints: Footprints,
	book: BookOpen,
	moon: Moon,
	heart: Heart,
	dumbbell: Dumbbell,
	leaf: Leaf,
	sun: Sun,
	home: House,
	brain: Brain,
	coffee: Coffee,
	pen: PenLine,
	person: PersonStanding,
	apple: Apple,
	waves: Waves,
	users: Users,
	bed: BedDouble,
	wind: Wind,
	timer: Timer,
	smile: Smile
};
function HabitGlyph({ id, className }) {
	const Icon = MAP[id] ?? Leaf;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className: cn("size-5", className),
		strokeWidth: 1.75
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background-color,color,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg",
			secondary: "bg-bg-subtle text-fg",
			ghost: "bg-transparent text-fg",
			outline: "bg-bg-elevated text-fg shadow-[var(--shadow-border)]",
			danger: "bg-danger text-danger-fg"
		},
		size: {
			sm: "h-10 px-3 text-sm rounded-[var(--radius-md)]",
			md: "h-12 px-4 text-base rounded-[var(--radius-lg)]",
			lg: "h-14 px-5 text-lg rounded-[var(--radius-xl)]",
			icon: "size-12 rounded-[var(--radius-lg)]",
			pill: "h-11 px-4 text-sm rounded-full"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function starterHabits(now = /* @__PURE__ */ new Date()) {
	const createdDay = toISODate(subDays(now, 28));
	const createdAt = `${createdDay}T08:00:00.000Z`;
	return [
		{
			id: "seed-water",
			name: "Drink water",
			identity: "I take care of this body.",
			color: "ocean",
			icon: "droplets",
			category: "health",
			timeOfDay: "anytime",
			frequency: { kind: "daily" },
			goalType: "count",
			target: 8,
			unit: "glasses",
			reminder: "10:00",
			archived: false,
			paused: false,
			createdAt: `${createdDay}T08:00:00.000Z`,
			sort: 0
		},
		{
			id: "seed-walk",
			name: "Morning walk",
			identity: "I move a little every day.",
			color: "sage",
			icon: "footprints",
			category: "health",
			timeOfDay: "morning",
			frequency: { kind: "daily" },
			goalType: "boolean",
			target: 1,
			unit: "",
			reminder: "07:30",
			archived: false,
			paused: false,
			createdAt,
			sort: 1
		},
		{
			id: "seed-stretch",
			name: "Stretch",
			identity: "I meet the morning gently.",
			color: "moss",
			icon: "person",
			category: "health",
			timeOfDay: "morning",
			frequency: { kind: "daily" },
			goalType: "boolean",
			target: 1,
			unit: "",
			reminder: null,
			archived: false,
			paused: false,
			createdAt,
			sort: 2
		},
		{
			id: "seed-read",
			name: "Read",
			identity: "I keep a quiet mind.",
			color: "clay",
			icon: "book",
			category: "mind",
			timeOfDay: "evening",
			frequency: { kind: "daily" },
			goalType: "boolean",
			target: 1,
			unit: "",
			reminder: "20:30",
			archived: false,
			paused: false,
			createdAt,
			sort: 3
		},
		{
			id: "seed-sleep",
			name: "Lights out",
			identity: "I protect my sleep.",
			color: "dusk",
			icon: "moon",
			category: "rest",
			timeOfDay: "evening",
			frequency: {
				kind: "days",
				days: [
					0,
					1,
					2,
					3,
					4
				]
			},
			goalType: "boolean",
			target: 1,
			unit: "",
			reminder: "22:30",
			archived: false,
			paused: false,
			createdAt,
			sort: 4
		}
	];
}
function seedHistory(habits, now = /* @__PURE__ */ new Date()) {
	const start = subDays(now, 27);
	const days = eachDayOfInterval({
		start,
		end: now
	});
	const out = {};
	const today = toISODate(now);
	for (const habit of habits) for (const day of days) {
		const iso = toISODate(day);
		if (iso === today) continue;
		const n = hash01(`${habit.id}:${iso}`);
		if (n < .18) continue;
		if (n < .24) {
			out[checkKey(habit.id, iso)] = {
				skipped: true,
				value: 0
			};
			continue;
		}
		if (habit.goalType === "count") out[checkKey(habit.id, iso)] = { value: n > .4 ? habit.target : Math.max(1, habit.target - 2) };
		else out[checkKey(habit.id, iso)] = { value: 1 };
		if (n > .92) out[checkKey(habit.id, iso)].note = habit.id === "seed-read" ? "A few quiet pages." : "Felt good.";
	}
	return out;
}
function nextSort(habits) {
	return habits.reduce((m, h) => Math.max(m, h.sort), -1) + 1;
}
function withUndoCheck(checkIns, key, next) {
	const prev = checkIns[key];
	const copy = { ...checkIns };
	if (!next || next.value <= 0 && !next.skipped && !next.note) delete copy[key];
	else copy[key] = next;
	return {
		checkIns: copy,
		undo: {
			kind: "check",
			key,
			prev
		}
	};
}
var useHabitStore = create()(persist((set, get) => ({
	habits: [],
	checkIns: {},
	settings: { ...DEFAULT_SETTINGS },
	reviews: {},
	restDays: [],
	undo: null,
	hydrated: false,
	selectedDate: toISODate(/* @__PURE__ */ new Date()),
	setHydrated: () => set({ hydrated: true }),
	ensureSeed: () => {
		const { settings } = get();
		if (settings.initialized) return;
		const habits = starterHabits();
		set({
			habits,
			checkIns: seedHistory(habits),
			settings: {
				...settings,
				initialized: true
			}
		});
	},
	setSelectedDate: (iso) => set({ selectedDate: iso }),
	patchSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	addHabit: (draft) => {
		const id = newId();
		const habit = {
			...draft,
			id,
			archived: false,
			paused: false,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			sort: nextSort(get().habits)
		};
		set({ habits: [...get().habits, habit] });
		return id;
	},
	updateHabit: (id, patch) => set({ habits: get().habits.map((h) => h.id === id ? {
		...h,
		...patch,
		id
	} : h) }),
	deleteHabit: (id) => {
		const habit = get().habits.find((h) => h.id === id);
		if (!habit) return;
		const related = {};
		const checkIns = { ...get().checkIns };
		for (const key of Object.keys(checkIns)) if (key.startsWith(`${id}:`)) {
			related[key] = checkIns[key];
			delete checkIns[key];
		}
		set({
			habits: get().habits.filter((h) => h.id !== id),
			checkIns,
			undo: {
				kind: "habit-delete",
				habit,
				related
			}
		});
	},
	setPaused: (id, paused) => set({ habits: get().habits.map((h) => h.id === id ? {
		...h,
		paused
	} : h) }),
	setArchived: (id, archived) => set({ habits: get().habits.map((h) => h.id === id ? {
		...h,
		archived,
		paused: archived ? h.paused : h.paused
	} : h) }),
	moveHabit: (id, dir) => {
		const habits = activeHabitsSorted(get().habits);
		const i = habits.findIndex((h) => h.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= habits.length) return;
		const a = habits[i];
		const b = habits[j];
		set({ habits: get().habits.map((h) => {
			if (h.id === a.id) return {
				...h,
				sort: b.sort
			};
			if (h.id === b.id) return {
				...h,
				sort: a.sort
			};
			return h;
		}) });
	},
	toggleBoolean: (habitId, date) => {
		const key = checkKey(habitId, date);
		const prev = get().checkIns[key];
		const next = prev && prev.value >= 1 && !prev.skipped ? void 0 : {
			value: 1,
			note: prev?.note
		};
		set(withUndoCheck(get().checkIns, key, next));
		buzz();
	},
	adjustCount: (habitId, date, delta) => {
		const habit = get().habits.find((h) => h.id === habitId);
		if (!habit) return;
		const key = checkKey(habitId, date);
		const prev = get().checkIns[key];
		const value = Math.max(0, Math.min(habit.target * 3, (prev?.value ?? 0) + delta));
		const next = value === 0 && !prev?.note ? void 0 : {
			value,
			note: prev?.note
		};
		set(withUndoCheck(get().checkIns, key, next));
		if (delta > 0) buzz();
	},
	skipDay: (habitId, date) => {
		const key = checkKey(habitId, date);
		const prev = get().checkIns[key];
		const next = prev?.skipped ? void 0 : {
			value: 0,
			skipped: true,
			note: prev?.note
		};
		set(withUndoCheck(get().checkIns, key, next));
	},
	setNote: (habitId, date, note) => {
		const key = checkKey(habitId, date);
		const prev = get().checkIns[key];
		const trimmed = note.trim();
		const next = prev ? {
			...prev,
			note: trimmed || void 0
		} : trimmed ? {
			value: 0,
			note: trimmed
		} : void 0;
		set(withUndoCheck(get().checkIns, key, next));
	},
	toggleRestDay: (date) => {
		set({ restDays: get().restDays.includes(date) ? get().restDays.filter((d) => d !== date) : [...get().restDays, date] });
	},
	saveReview: (review) => set({ reviews: {
		...get().reviews,
		[review.weekStart]: review
	} }),
	replaceAll: (data) => set({
		habits: data.habits,
		checkIns: data.checkIns,
		settings: {
			...DEFAULT_SETTINGS,
			...data.settings,
			initialized: true
		},
		reviews: data.reviews ?? {},
		restDays: data.restDays ?? []
	}),
	resetAll: () => {
		const habits = starterHabits();
		set({
			habits,
			checkIns: seedHistory(habits),
			settings: {
				...DEFAULT_SETTINGS,
				initialized: true,
				seenWelcome: true
			},
			reviews: {},
			restDays: [],
			undo: null,
			selectedDate: toISODate(/* @__PURE__ */ new Date())
		});
	},
	applyUndo: () => {
		const undo = get().undo;
		if (!undo) return;
		if (undo.kind === "check") {
			const checkIns = { ...get().checkIns };
			if (undo.prev) checkIns[undo.key] = undo.prev;
			else delete checkIns[undo.key];
			set({
				checkIns,
				undo: null
			});
			return;
		}
		set({
			habits: [...get().habits, undo.habit],
			checkIns: {
				...get().checkIns,
				...undo.related
			},
			undo: null
		});
	},
	markSheetsSync: () => set({ settings: {
		...get().settings,
		lastSheetsSync: (/* @__PURE__ */ new Date()).toISOString()
	} })
}), {
	name: "daymark-v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (s) => ({
		habits: s.habits,
		checkIns: s.checkIns,
		settings: s.settings,
		reviews: s.reviews,
		restDays: s.restDays
	})
}));
function activeHabitsSorted(habits) {
	return habits.filter((h) => !h.archived).slice().sort((a, b) => a.sort - b.sort);
}
function buzz() {
	try {
		if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
	} catch {}
}
function exportSnapshot() {
	const s = useHabitStore.getState();
	return {
		habits: s.habits,
		checkIns: s.checkIns,
		settings: s.settings,
		reviews: s.reviews,
		restDays: s.restDays
	};
}
function HabitsView({ onEdit, onAdd }) {
	const habits = useHabitStore((s) => s.habits);
	const moveHabit = useHabitStore((s) => s.moveHabit);
	const setPaused = useHabitStore((s) => s.setPaused);
	const setArchived = useHabitStore((s) => s.setArchived);
	const [showArchived, setShowArchived] = (0, import_react.useState)(false);
	const live = activeHabits(habits);
	const archived = habits.filter((h) => h.archived);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "Habits"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em]",
					children: "Your list"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onAdd,
					size: "pill",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add"]
				})]
			}),
			live.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, {
				title: "Start with one",
				body: "A single daily promise is enough. You can grow the list later."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: live.map((habit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("flex items-center gap-2 rounded-[var(--radius-xl)] bg-bg-elevated p-3 shadow-[var(--shadow-border)]", habit.paused && "opacity-70"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Move up",
								disabled: i === 0,
								onClick: () => moveHabit(habit.id, -1),
								className: "grid size-9 place-items-center rounded-[var(--radius-sm)] text-fg-muted disabled:opacity-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Move down",
								disabled: i === live.length - 1,
								onClick: () => moveHabit(habit.id, 1),
								className: "grid size-9 place-items-center rounded-[var(--radius-sm)] text-fg-muted disabled:opacity-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onEdit(habit.id),
							className: "flex min-w-0 flex-1 items-center gap-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-[var(--radius-md)]",
								style: {
									background: colorVar(habit.color),
									color: "var(--color-bg-elevated)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitGlyph, { id: habit.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-medium",
									children: habit.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-xs text-fg-muted",
									children: [
										frequencyLabel(habit.frequency),
										habit.paused ? " · Paused" : "",
										habit.goalType === "count" ? ` · ${habit.target} ${habit.unit}` : ""
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": habit.paused ? "Resume" : "Pause",
							onClick: () => setPaused(habit.id, !habit.paused),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Edit",
							onClick: () => onEdit(habit.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						})
					]
				}, habit.id))
			}),
			archived.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setShowArchived((v) => !v),
				className: "flex items-center gap-2 text-sm font-medium text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }),
					"Archived (",
					archived.length,
					")"
				]
			}), showArchived && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: archived.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-[var(--radius-lg)] bg-bg-elevated px-3 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fg-muted",
						children: habit.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "pill",
						onClick: () => setArchived(habit.id, false),
						children: "Restore"
					})]
				}, habit.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-fg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Tip" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block leading-relaxed",
					children: "Pause when life is loud. Archive when a season ends. Deleting wipes the history."
				})]
			})
		]
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-[var(--radius-lg)] bg-bg-subtle px-4 text-base text-fg placeholder:text-fg-subtle", "shadow-[inset_0_0_0_1px_var(--color-border)] outline-none", "focus-visible:shadow-[inset_0_0_0_2px_var(--color-accent)]", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("block text-sm font-medium text-fg-muted", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-[var(--radius-lg)] bg-bg-subtle px-4 py-3 text-base text-fg placeholder:text-fg-subtle", "shadow-[inset_0_0_0_1px_var(--color-border)] outline-none", "focus-visible:shadow-[inset_0_0_0_2px_var(--color-accent)]", className),
		...props
	});
}
var DAY_BITS = [
	{
		n: 1,
		l: "M"
	},
	{
		n: 2,
		l: "T"
	},
	{
		n: 3,
		l: "W"
	},
	{
		n: 4,
		l: "T"
	},
	{
		n: 5,
		l: "F"
	},
	{
		n: 6,
		l: "S"
	},
	{
		n: 0,
		l: "S"
	}
];
function fromHabit(h) {
	if (!h) return {
		name: "",
		identity: "",
		color: "sage",
		icon: "leaf",
		category: "health",
		timeOfDay: "morning",
		freqKind: "daily",
		days: [
			1,
			2,
			3,
			4,
			5
		],
		times: 3,
		goalType: "boolean",
		target: 1,
		unit: "",
		reminder: ""
	};
	return {
		name: h.name,
		identity: h.identity,
		color: h.color,
		icon: h.icon,
		category: h.category,
		timeOfDay: h.timeOfDay,
		freqKind: h.frequency.kind,
		days: h.frequency.kind === "days" ? h.frequency.days : [
			1,
			2,
			3,
			4,
			5
		],
		times: h.frequency.kind === "weekly" ? h.frequency.times : 3,
		goalType: h.goalType,
		target: h.target,
		unit: h.unit,
		reminder: h.reminder ?? ""
	};
}
function toFrequency(d) {
	if (d.freqKind === "daily") return { kind: "daily" };
	if (d.freqKind === "weekly") return {
		kind: "weekly",
		times: Math.max(1, Math.min(7, d.times))
	};
	return {
		kind: "days",
		days: d.days.length ? d.days : [1]
	};
}
function HabitEditor({ habitId, onClose }) {
	const habits = useHabitStore((s) => s.habits);
	const existing = habitId ? habits.find((h) => h.id === habitId) : void 0;
	const addHabit = useHabitStore((s) => s.addHabit);
	const updateHabit = useHabitStore((s) => s.updateHabit);
	const deleteHabit = useHabitStore((s) => s.deleteHabit);
	const setPaused = useHabitStore((s) => s.setPaused);
	const setArchived = useHabitStore((s) => s.setArchived);
	const skipDay = useHabitStore((s) => s.skipDay);
	const selectedDate = useHabitStore((s) => s.selectedDate);
	const [draft, setDraft] = (0, import_react.useState)(() => fromHabit(existing));
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const patch = (p) => setDraft((d) => ({
		...d,
		...p
	}));
	const freq = (0, import_react.useMemo)(() => toFrequency(draft), [draft]);
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
			reminder: draft.reminder || null
		};
		if (existing) updateHabit(existing.id, body);
		else addHabit(body);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex justify-center bg-fg/40 p-0 md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-[430px] flex-col bg-bg md:rounded-[var(--radius-2xl)] md:shadow-[var(--shadow-phone)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: existing ? "Edit habit" : "New habit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Close",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-4 pb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.name,
									onChange: (e) => patch({ name: e.target.value }),
									placeholder: "Morning walk",
									autoFocus: !existing
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "I am someone who…",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: draft.identity,
									onChange: (e) => patch({ identity: e.target.value }),
									placeholder: "moves a little every day",
									rows: 2
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Color",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: HABIT_COLOR_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": id,
										onClick: () => patch({ color: id }),
										className: cn("size-10 rounded-full", draft.color === id && "outline outline-2 outline-offset-2 outline-fg"),
										style: { background: colorVar(id) }
									}, id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-2",
									children: HABIT_ICON_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": id,
										onClick: () => patch({ icon: id }),
										className: cn("grid h-12 place-items-center rounded-[var(--radius-md)] bg-bg-subtle", draft.icon === id && "bg-accent text-accent-fg"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitGlyph, { id })
									}, id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Time of day",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2",
									children: TIME_OF_DAY.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										on: draft.timeOfDay === id,
										onClick: () => patch({ timeOfDay: id }),
										children: id
									}, id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Schedule",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 gap-2",
										children: [
											"daily",
											"days",
											"weekly"
										].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
											on: draft.freqKind === id,
											onClick: () => patch({ freqKind: id }),
											children: id === "daily" ? "Daily" : id === "days" ? "Days" : "Weekly"
										}, id))
									}),
									draft.freqKind === "days" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 flex gap-1",
										children: DAY_BITS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => patch({ days: draft.days.includes(d.n) ? draft.days.filter((x) => x !== d.n) : [...draft.days, d.n] }),
											className: cn("h-11 flex-1 rounded-[var(--radius-md)] text-sm font-medium", draft.days.includes(d.n) ? "bg-accent text-accent-fg" : "bg-bg-subtle"),
											children: d.l
										}, d.n))
									}),
									draft.freqKind === "weekly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 1,
											max: 7,
											value: draft.times,
											onChange: (e) => patch({ times: Number(e.target.value) || 1 }),
											className: "w-20"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-fg-muted",
											children: "times each week"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-fg-muted",
										children: frequencyLabel(freq)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "How you count it",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										on: draft.goalType === "boolean",
										onClick: () => patch({ goalType: "boolean" }),
										children: "Yes / no"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										on: draft.goalType === "count",
										onClick: () => patch({ goalType: "count" }),
										children: "A number"
									})]
								}), draft.goalType === "count" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										value: draft.target,
										onChange: (e) => patch({ target: Number(e.target.value) || 1 }),
										"aria-label": "Target"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: draft.unit,
										onChange: (e) => patch({ unit: e.target.value }),
										placeholder: "glasses",
										"aria-label": "Unit"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Area",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: CATEGORIES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										on: draft.category === id,
										onClick: () => patch({ category: id }),
										children: id
									}, id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reminder (on this device)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: draft.reminder,
									onChange: (e) => patch({ reminder: e.target.value })
								})
							}),
							existing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										onClick: () => skipDay(existing.id, selectedDate),
										children: "Skip today"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										onClick: () => setPaused(existing.id, !existing.paused),
										children: existing.paused ? "Resume" : "Pause"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										onClick: () => {
											setArchived(existing.id, true);
											onClose();
										},
										children: "Archive"
									}),
									confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-[var(--radius-lg)] bg-bg-elevated p-3 shadow-[var(--shadow-border)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm",
											children: [
												"Delete ",
												existing.name,
												" and its history?"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "danger",
												className: "flex-1",
												onClick: () => {
													deleteHabit(existing.id);
													onClose();
												},
												children: "Delete"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "secondary",
												className: "flex-1",
												onClick: () => setConfirmDelete(false),
												children: "Keep"
											})]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "text-danger",
										onClick: () => setConfirmDelete(true),
										children: "Delete"
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						size: "lg",
						onClick: save,
						disabled: !draft.name.trim(),
						children: "Save"
					})
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 rounded-[var(--radius-md)] px-3 text-sm font-medium capitalize", on ? "bg-accent text-accent-fg" : "bg-bg-subtle text-fg"),
		children
	});
}
function PlanView() {
	const habits = useHabitStore((s) => s.habits);
	const checkIns = useHabitStore((s) => s.checkIns);
	const restDays = useHabitStore((s) => s.restDays);
	const settings = useHabitStore((s) => s.settings);
	const selectedDate = useHabitStore((s) => s.selectedDate);
	const setSelectedDate = useHabitStore((s) => s.setSelectedDate);
	const toggleBoolean = useHabitStore((s) => s.toggleBoolean);
	const [mode, setMode] = (0, import_react.useState)("week");
	const [monthCursor, setMonthCursor] = (0, import_react.useState)(() => startOfMonth(/* @__PURE__ */ new Date()));
	const selected = fromISODate(selectedDate);
	const live = activeHabits(habits).filter((h) => !h.paused);
	const week = weekDays(selected, settings.weekStartsOn);
	const grid = (0, import_react.useMemo)(() => monthGrid(monthCursor, settings.weekStartsOn), [monthCursor, settings.weekStartsOn]);
	const weekDone = week.filter((d) => {
		const due = live.filter((h) => isDueOn(h, d, settings.weekStartsOn, checkIns));
		if (due.length === 0) return false;
		return due.every((h) => isComplete(h, checkIns[checkKey(h.id, toISODate(d))]));
	}).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "Plan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em]",
					children: mode === "week" ? "This week at a glance" : format(monthCursor, "MMMM yyyy")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-fg-muted",
					children: mode === "week" ? `${weekDone} of 7 days fully kept. Tap a circle to check a day.` : "Scan the month. Darker marks mean a fuller day."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex rounded-full bg-bg-subtle p-1",
				children: ["week", "month"].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(id),
					className: cn("h-10 flex-1 rounded-full text-sm font-medium capitalize", mode === id ? "bg-bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-fg-muted"),
					children: id
				}, id))
			}),
			live.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, {
				title: "No active habits",
				body: "Add something small you can repeat."
			}) : mode === "week" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "overflow-x-auto p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[20rem]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 grid",
						style: { gridTemplateColumns: `minmax(7rem,1.4fr) repeat(7, 1fr)` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), week.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelectedDate(toISODate(d)),
							className: cn("flex flex-col items-center rounded-[var(--radius-md)] py-1 text-[11px]", toISODate(d) === selectedDate ? "bg-accent text-accent-fg" : "text-fg-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "uppercase tracking-wide",
								children: weekdayLabel(settings.weekStartsOn, i)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular font-semibold text-sm",
								children: format(d, "d")
							})]
						}, toISODate(d)))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1.5",
						children: live.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid items-center",
							style: { gridTemplateColumns: `minmax(7rem,1.4fr) repeat(7, 1fr)` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-center gap-2 pr-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 shrink-0 rounded-full",
									style: { background: colorVar(habit.color) }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-sm font-medium",
									children: habit.name
								})]
							}), week.map((d) => {
								const iso = toISODate(d);
								const due = isDueOn(habit, d, settings.weekStartsOn, checkIns);
								const done = isComplete(habit, checkIns[checkKey(habit.id, iso)]);
								const rest = restDays.includes(iso);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: !due,
										onClick: () => {
											if (habit.goalType === "boolean") toggleBoolean(habit.id, iso);
											setSelectedDate(iso);
										},
										"aria-label": `${habit.name} ${iso}`,
										className: cn("size-8 rounded-full transition-transform duration-[var(--motion-quick)] active:scale-[0.96]", !due && "opacity-20", due && !done && "bg-bg-subtle", rest && due && !done && "outline outline-1 outline-border-strong"),
										style: done ? { background: colorVar(habit.color) } : void 0
									})
								}, iso);
							})]
						}, habit.id))
					})]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Previous month",
						onClick: () => setMonthCursor((m) => addMonths(m, -1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: format(monthCursor, "MMMM yyyy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Next month",
						onClick: () => setMonthCursor((m) => addMonths(m, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthDots, {
				days: grid,
				month: monthCursor,
				selected,
				weekStartsOn: settings.weekStartsOn,
				habits,
				checkIns,
				restDays,
				onSelect: (iso) => {
					setSelectedDate(iso);
					const d = fromISODate(iso);
					if (!isSameMonth(d, monthCursor)) setMonthCursor(startOfMonth(d));
				}
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: ["On ", format(selected, "EEEE d MMM")] }), live.filter((h) => isDueOn(h, selected, settings.weekStartsOn, checkIns)).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "Nothing scheduled."
				}) : live.filter((h) => isDueOn(h, selected, settings.weekStartsOn, checkIns)).map((h) => {
					const done = isComplete(h, checkIns[checkKey(h.id, selectedDate)]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-[var(--radius-lg)] bg-bg-elevated px-3 py-3 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 place-items-center rounded-[var(--radius-sm)]",
								style: {
									background: colorVar(h.color),
									color: "var(--color-bg-elevated)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitGlyph, {
									id: h.icon,
									className: "size-4"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 font-medium",
								children: h.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-fg-muted",
								children: done ? "Kept" : "Open"
							})
						]
					}, h.id);
				})]
			})
		]
	});
}
function ProgressView() {
	const habits = useHabitStore((s) => s.habits);
	const checkIns = useHabitStore((s) => s.checkIns);
	const restDays = useHabitStore((s) => s.restDays);
	const settings = useHabitStore((s) => s.settings);
	const reviews = useHabitStore((s) => s.reviews);
	const saveReview = useHabitStore((s) => s.saveReview);
	const today = /* @__PURE__ */ new Date();
	const live = activeHabits(habits);
	const weekStart = startOfWeek(today, { weekStartsOn: settings.weekStartsOn });
	const weekKey = toISODate(weekStart);
	const existing = reviews[weekKey];
	const week = overallRange(live, checkIns, weekStart, today, settings.weekStartsOn);
	const month = overallRange(live, checkIns, subDays(today, 29), today, settings.weekStartsOn);
	const chart = weekCompletions(habits, checkIns, restDays, settings.weekStartsOn, today).map((d, i) => ({
		label: weekdayFull(settings.weekStartsOn, i).slice(0, 2),
		pct: d.pct
	}));
	const insights = buildInsights(habits, checkIns, restDays, settings, today);
	const bestDay = (0, import_react.useMemo)(() => {
		const counts = [
			0,
			0,
			0,
			0,
			0,
			0,
			0
		];
		const dues = [
			0,
			0,
			0,
			0,
			0,
			0,
			0
		];
		for (const h of live) for (let i = 0; i < 30; i++) {
			const day = subDays(today, i);
			const r = rateInRange(h, checkIns, day, day, settings.weekStartsOn);
			const wd = getDay(day);
			dues[wd] += r.due;
			counts[wd] += r.done;
		}
		let idx = Number(settings.weekStartsOn);
		let best = -1;
		for (let i = 0; i < 7; i++) {
			if (dues[i] === 0) continue;
			const pct = counts[i] / dues[i];
			if (pct > best) {
				best = pct;
				idx = i;
			}
		}
		return {
			name: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			][idx] ?? "Monday",
			pct: best < 0 ? 0 : Math.round(best * 100)
		};
	}, [
		checkIns,
		live,
		settings.weekStartsOn,
		today
	]);
	const [well, setWell] = (0, import_react.useState)(existing?.well ?? "");
	const [hard, setHard] = (0, import_react.useState)(existing?.hard ?? "");
	const [next, setNext] = (0, import_react.useState)(existing?.next ?? "");
	if (live.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-[1.85rem] tracking-[-0.03em]",
			children: "Progress"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNote, {
				title: "No story yet",
				body: "Keep a few days and your numbers will appear here."
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg-muted",
				children: "Progress"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em]",
				children: "Your quiet numbers"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "flex flex-col items-center gap-2 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
						pct: week.pct,
						size: 96,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tabular text-xl font-semibold",
							children: [week.pct, "%"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg-muted",
						children: "This week"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "flex flex-col justify-center gap-3 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "tabular text-2xl font-semibold",
						children: [month.pct, "%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg-muted",
						children: "Last 30 days"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "tabular text-2xl font-semibold",
						children: [bestDay.pct, "%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-fg-muted",
						children: [
							"Best on ",
							bestDay.name,
							"s"
						]
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Week score" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: chart,
						barCategoryGap: "28%",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "label",
							axisLine: false,
							tickLine: false,
							tick: {
								fill: "var(--color-fg-muted)",
								fontSize: 12
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "pct",
							fill: "var(--color-accent)",
							radius: [
								8,
								8,
								4,
								4
							]
						})]
					})
				})
			})] }),
			insights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Insights" }), insights.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-fg-muted",
					children: item.body
				})] }, item.title))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Each habit" }), live.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitStat, { habit }, habit.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Weekly review" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-display text-xl",
					children: ["Week of ", format(weekStart, "d MMM")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-fg-muted",
					children: "Three short notes. That is enough."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-medium text-fg-muted",
							children: ["What went well", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1",
								value: well,
								onChange: (e) => setWell(e.target.value),
								rows: 2
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-medium text-fg-muted",
							children: ["What was hard", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1",
								value: hard,
								onChange: (e) => setHard(e.target.value),
								rows: 2
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-medium text-fg-muted",
							children: ["Next week’s one focus", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1",
								value: next,
								onChange: (e) => setNext(e.target.value),
								rows: 2
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => saveReview({
								weekStart: weekKey,
								well,
								hard,
								next
							}),
							children: "Save review"
						})
					]
				})
			] })
		]
	});
}
function HabitStat({ habit }) {
	const checkIns = useHabitStore((s) => s.checkIns);
	const restDays = useHabitStore((s) => s.restDays);
	const weekStartsOn = useHabitStore((s) => s.settings.weekStartsOn);
	const today = /* @__PURE__ */ new Date();
	const streak = currentStreak(habit, checkIns, restDays, weekStartsOn, today);
	const best = bestStreak(habit, checkIns, restDays, weekStartsOn, today);
	const month = rateInRange(habit, checkIns, subDays(today, 29), today, weekStartsOn);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 place-items-center rounded-[var(--radius-md)]",
				style: {
					background: colorVar(habit.color),
					color: "var(--color-bg-elevated)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitGlyph, { id: habit.icon })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-medium",
					children: habit.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1.5 overflow-hidden rounded-full bg-bg-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("h-full rounded-full transition-[width] duration-[var(--motion-slow)]"),
						style: {
							width: `${month.pct}%`,
							background: colorVar(habit.color)
						}
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center justify-end gap-1 tabular text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }), streak]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-fg-muted",
					children: [
						"best ",
						best,
						" · ",
						month.pct,
						"%"
					]
				})]
			})
		]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("relative h-8 w-14 shrink-0 rounded-full bg-bg-subtle shadow-[inset_0_0_0_1px_var(--color-border)]", "data-[state=checked]:bg-accent", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("block size-6 translate-x-1 rounded-full bg-bg-elevated shadow-sm transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]", "data-[state=checked]:translate-x-7 data-[state=checked]:bg-accent-fg") })
	});
}
var APPS_SCRIPT = `/**
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
function snapshotToJson(data) {
	return JSON.stringify({
		app: "daymark",
		version: 1,
		...data
	}, null, 2);
}
function parseSnapshot(raw) {
	const parsed = JSON.parse(raw);
	if (!Array.isArray(parsed.habits)) throw new Error("This file is not a Daymark backup.");
	return {
		habits: parsed.habits,
		checkIns: parsed.checkIns ?? {},
		settings: {
			...DEFAULT_SETTINGS,
			...parsed.settings ?? {},
			initialized: true
		},
		reviews: parsed.reviews ?? {},
		restDays: parsed.restDays ?? []
	};
}
function snapshotToCsv(data) {
	const names = new Map(data.habits.map((h) => [h.id, h.name]));
	const lines = ["Date,Habit,HabitId,Value,Skipped,Note"];
	const keys = Object.keys(data.checkIns).sort();
	for (const key of keys) {
		const [id, date] = splitKey(key);
		const c = data.checkIns[key];
		lines.push([
			date,
			csv(names.get(id) ?? ""),
			csv(id),
			String(c.value ?? 0),
			c.skipped ? "yes" : "no",
			csv(c.note ?? "")
		].join(","));
	}
	return lines.join("\n");
}
function habitsToCsv(habits) {
	const lines = ["Name,Identity,Color,Category,Time,Frequency,Type,Target,Unit,Reminder,Paused,Archived"];
	for (const h of habits) lines.push([
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
		h.archived ? "yes" : "no"
	].join(","));
	return lines.join("\n");
}
function splitKey(key) {
	const i = key.indexOf(":");
	return [key.slice(0, i), key.slice(i + 1)];
}
function csv(value) {
	if (/[",\n]/.test(value)) return `"${value.replaceAll("\"", "\"\"")}"`;
	return value;
}
function downloadText(filename, text, mime) {
	const blob = new Blob([text], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function stamp() {
	return format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
}
async function syncToSheets(url, data) {
	const payload = {
		app: "daymark",
		version: 1,
		...data
	};
	await fetch(url, {
		method: "POST",
		mode: "no-cors",
		headers: { "Content-Type": "text/plain;charset=utf-8" },
		body: JSON.stringify(payload)
	});
}
function SettingsScreen({ onClose }) {
	const settings = useHabitStore((s) => s.settings);
	const patchSettings = useHabitStore((s) => s.patchSettings);
	const replaceAll = useHabitStore((s) => s.replaceAll);
	const resetAll = useHabitStore((s) => s.resetAll);
	const markSheetsSync = useHabitStore((s) => s.markSheetsSync);
	const online = useOnline();
	const fileRef = (0, import_react.useRef)(null);
	const [confirmReset, setConfirmReset] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	function set(key, value) {
		patchSettings({ [key]: value });
	}
	async function onImport(file) {
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
	async function enableReminders(on) {
		if (on && typeof Notification !== "undefined" && Notification.permission === "default") try {
			await Notification.requestPermission();
		} catch {}
		set("reminders", on);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex justify-center bg-fg/40 md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-[430px] flex-col bg-bg md:rounded-[var(--radius-2xl)] md:shadow-[var(--shadow-phone)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Settings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": "Close",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-4 pb-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5",
					children: [
						!online && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "You are offline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-fg-muted",
							children: "Check-offs still save on this phone. Sheets sync waits until you are back."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "You" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "display-name",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "display-name",
									value: settings.displayName,
									onChange: (e) => set("displayName", e.target.value),
									placeholder: "Optional"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Comfort" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Larger text",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: settings.typeScale === "large",
										onCheckedChange: (v) => set("typeScale", v ? "large" : "regular")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Week starts on Monday",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: settings.weekStartsOn === 1,
										onCheckedChange: (v) => set("weekStartsOn", v ? 1 : 0)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg-muted",
									children: "Theme"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										"light",
										"dark",
										"system"
									].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: settings.theme === id ? "primary" : "secondary",
										size: "pill",
										onClick: () => set("theme", id),
										className: "capitalize",
										children: id
									}, id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Gentle reminders",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: settings.reminders,
										onCheckedChange: enableReminders
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Backup" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-fg-muted",
									children: "Everything lives on this device. Download a copy, or send it to a Google Sheet."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => downloadText(`daymark-${stamp()}.json`, snapshotToJson(exportSnapshot()), "application/json"),
									children: "Download JSON"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => {
										const data = exportSnapshot();
										downloadText(`daymark-checkins-${stamp()}.csv`, snapshotToCsv(data), "text/csv");
										downloadText(`daymark-habits-${stamp()}.csv`, habitsToCsv(data.habits), "text/csv");
									},
									children: "Download CSV for Sheets"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "application/json,.json",
									className: "hidden",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (file) onImport(file);
										e.target.value = "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => fileRef.current?.click(),
									children: "Restore JSON"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Google Sheets" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-fg-muted",
									children: "Paste the Apps Script below into your spreadsheet, deploy it as a web app, then paste the URL here."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sheets-url",
									children: "Web app URL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sheets-url",
									value: settings.sheetsUrl,
									onChange: (e) => set("sheetsUrl", e.target.value),
									placeholder: "https://script.google.com/macros/s/…/exec"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => void onSync(),
									disabled: busy || !online,
									children: busy ? "Sending…" : "Sync to Sheets"
								}),
								settings.lastSheetsSync && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-fg-muted",
									children: ["Last sent ", settings.lastSheetsSync.slice(0, 16).replace("T", " ")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: async () => {
										try {
											await navigator.clipboard.writeText(APPS_SCRIPT);
											toast.success("Apps Script copied");
										} catch {
											downloadText("daymark-apps-script.gs", APPS_SCRIPT, "text/plain");
											toast.success("Script downloaded");
										}
									},
									children: "Copy Apps Script"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-3 pb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Reset" }), confirmReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "Replace everything with the starter week?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									className: "flex-1",
									onClick: () => {
										resetAll();
										setConfirmReset(false);
										toast.success("Starter week restored");
									},
									children: "Reset"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									className: "flex-1",
									onClick: () => setConfirmReset(false),
									children: "Keep"
								})]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "text-danger",
								onClick: () => setConfirmReset(true),
								children: "Reset demo data"
							})]
						})
					]
				})
			})]
		})
	});
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-12 items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-base",
			children: label
		}), children]
	});
}
function useOnline() {
	const [online, setOnline] = (0, import_react.useState)(typeof navigator === "undefined" ? true : navigator.onLine);
	(0, import_react.useEffect)(() => {
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
var TIME_LABEL = {
	morning: "Morning",
	afternoon: "Afternoon",
	evening: "Evening",
	anytime: "Anytime"
};
function TodayView({ onEdit, onAdd }) {
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
	const greet = greeting(/* @__PURE__ */ new Date());
	const groups = groupedForDay(habits, date, settings.weekStartsOn, checkIns);
	const stats = dayStats(habits, date, settings.weekStartsOn, checkIns, restDays);
	const name = settings.displayName.trim();
	const rest = restDays.includes(selectedDate);
	const dueReminders = (0, import_react.useMemo)(() => {
		if (!settings.reminders || !today) return [];
		const hhmm = format(/* @__PURE__ */ new Date(), "HH:mm");
		return groups.flatMap((g) => g.habits).filter((h) => {
			if (!h.reminder || h.reminder > hhmm) return false;
			const c = checkIns[checkKey(h.id, selectedDate)];
			return !isComplete(h, c) && !isSkipped(c);
		});
	}, [
		checkIns,
		groups,
		selectedDate,
		settings.reminders,
		today
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "stagger-in flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg-muted",
						children: format(date, "EEEE d MMMM")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-[1.85rem] leading-tight tracking-[-0.03em] text-fg",
						children: today ? `${greet.hello}${name ? `, ${name}` : ""}` : format(date, "d MMMM")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-fg-muted",
						children: today ? greet.line : "A day in the record."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
					pct: stats.pct,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tabular text-lg font-semibold leading-none",
							children: [stats.pct, "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[10px] uppercase tracking-wide text-fg-muted",
							children: [
								stats.done,
								"/",
								stats.total
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekStrip, {
				anchor: date,
				selected: date,
				weekStartsOn: settings.weekStartsOn,
				habits,
				checkIns,
				restDays,
				onSelect: setSelectedDate
			}),
			dueReminders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-lg)] bg-bg-elevated px-4 py-3 text-sm shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Still waiting"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-fg-muted",
					children: dueReminders.map((h) => h.name).join(", ")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: rest ? "primary" : "secondary",
						size: "pill",
						onClick: () => toggleRestDay(selectedDate),
						children: rest ? "Rest day on" : "Mark rest day"
					}),
					!today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "pill",
						onClick: () => setSelectedDate(toISODate(/* @__PURE__ */ new Date())),
						children: "Back to today"
					}),
					undo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "pill",
						onClick: applyUndo,
						className: "ml-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" }), "Undo"]
					})
				]
			}),
			groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-xl)] bg-bg-elevated px-5 py-10 text-center shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Nothing due"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-fg-muted",
						children: rest ? "Rest is part of the plan. Enjoy the quiet." : "Add a habit, or pick another day on the strip."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-5",
						onClick: onAdd,
						children: "Add a habit"
					})
				]
			}) : groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: TIME_LABEL[group.time] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: group.habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitRow, {
						habit,
						date: selectedDate,
						onOpen: () => onEdit(habit.id),
						onToggle: () => toggleBoolean(habit.id, selectedDate),
						onAdjust: (d) => adjustCount(habit.id, selectedDate, d),
						onSkip: () => skipDay(habit.id, selectedDate)
					}) }, habit.id))
				})]
			}, group.time))
		]
	});
}
function HabitRow({ habit, date, onOpen, onToggle, onAdjust, onSkip }) {
	const check = useHabitStore((s) => s.checkIns[checkKey(habit.id, date)]);
	const checkIns = useHabitStore((s) => s.checkIns);
	const restDays = useHabitStore((s) => s.restDays);
	const weekStartsOn = useHabitStore((s) => s.settings.weekStartsOn);
	const done = isComplete(habit, check);
	const skipped = isSkipped(check);
	const streak = currentStreak(habit, checkIns, restDays, weekStartsOn, fromISODate(date));
	const weekly = habit.frequency.kind === "weekly" ? weekTimesHit(habit, checkIns, weekStartsOn, fromISODate(date)) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("flex items-center gap-3 rounded-[var(--radius-xl)] bg-bg-elevated p-3 pr-3 shadow-[var(--shadow-border)]", (done || skipped) && "opacity-80"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-12 w-1.5 shrink-0 rounded-full",
				style: { background: colorVar(habit.color) },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onOpen,
				className: "min-w-0 flex-1 text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-8 place-items-center rounded-[var(--radius-sm)]",
						style: {
							background: colorVar(habit.color),
							color: "var(--color-bg-elevated)"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitGlyph, {
							id: habit.icon,
							className: "size-4"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("truncate font-medium", done && "text-fg-muted"),
							children: habit.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-fg-muted",
							children: habit.identity || (weekly !== null ? `${weekly} of ${habit.frequency.kind === "weekly" ? habit.frequency.times : 0} this week` : "Keep the promise")
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [streak > 0 && !skipped && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-0.5 text-xs font-medium text-fg-muted tabular",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }), streak]
				}), skipped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "pill",
					onClick: onSkip,
					className: "h-10",
					children: "Skipped"
				}) : habit.goalType === "count" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Decrease",
							onClick: () => onAdjust(-1),
							className: "grid size-11 place-items-center rounded-full bg-bg-subtle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular min-w-8 text-center text-sm font-semibold",
							children: [check?.value ?? 0, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-[10px] font-medium text-fg-muted",
								children: ["/", habit.target]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Increase",
							onClick: () => onAdjust(1),
							className: "grid size-11 place-items-center rounded-full bg-bg-subtle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckMark, {
					on: done,
					color: habit.color,
					onClick: onToggle,
					label: done ? `Undo ${habit.name}` : `Complete ${habit.name}`
				})]
			})
		]
	});
}
var TABS = [
	{
		id: "today",
		label: "Today",
		icon: SunMedium
	},
	{
		id: "plan",
		label: "Plan",
		icon: CalendarDays
	},
	{
		id: "progress",
		label: "Progress",
		icon: ChartColumn
	},
	{
		id: "habits",
		label: "Habits",
		icon: ListChecks
	}
];
function AppShell({ tab }) {
	const settings = useHabitStore((s) => s.settings);
	const patchSettings = useHabitStore((s) => s.patchSettings);
	const [editor, setEditor] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	useTheme(settings.theme);
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.scale = settings.typeScale;
	}, [settings.typeScale]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-studio",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-bg text-fg md:min-h-[min(860px,100dvh)] md:rounded-[2rem] md:shadow-[var(--shadow-phone)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg tracking-[-0.02em]",
							children: "Daymark"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Add habit",
								onClick: () => setEditor("new"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Settings",
								onClick: () => setSettingsOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex-1 overflow-y-auto px-4 pt-2",
						children: [
							tab === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayView, {
								onEdit: (id) => setEditor(id),
								onAdd: () => setEditor("new")
							}),
							tab === "plan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanView, {}),
							tab === "progress" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressView, {}),
							tab === "habits" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitsView, {
								onEdit: (id) => setEditor(id),
								onAdd: () => setEditor("new")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "grid grid-cols-4 border-t border-border bg-bg px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
						"aria-label": "Primary",
						children: TABS.map((item) => {
							const Icon = item.icon;
							const active = tab === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								search: { tab: item.id },
								"aria-current": active ? "page" : void 0,
								className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] text-[11px] font-medium", active ? "text-accent" : "text-fg-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5",
									strokeWidth: active ? 2.2 : 1.75
								}), item.label]
							}, item.id);
						})
					})
				]
			}),
			editor !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitEditor, {
				habitId: editor === "new" ? null : editor,
				onClose: () => setEditor(null)
			}),
			settingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsScreen, { onClose: () => setSettingsOpen(false) }),
			!settings.seenWelcome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Welcome, { onDone: () => patchSettings({ seenWelcome: true }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				toastOptions: {
					className: "font-sans",
					style: {
						background: "var(--color-bg-elevated)",
						color: "var(--color-fg)",
						border: "1px solid var(--color-border)"
					}
				}
			})
		]
	});
}
function Welcome({ onDone }) {
	const displayName = useHabitStore((s) => s.settings.displayName);
	const patchSettings = useHabitStore((s) => s.patchSettings);
	const [name, setName] = (0, import_react.useState)(displayName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-[430px] flex-col justify-between px-6 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger-in pt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-muted",
						children: "Daymark"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-4xl leading-[1.1] tracking-[-0.03em]",
						children: "A quieter way to keep daily promises."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base leading-relaxed text-fg-muted",
						children: "Check off the day. Watch the week. Your record stays on this phone, even offline."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-8 block text-sm font-medium text-fg-muted",
						children: ["What should we call you?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "mt-2 h-14 w-full rounded-[var(--radius-lg)] bg-bg-subtle px-4 text-lg text-fg outline-none",
							placeholder: "Optional"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "w-full",
				onClick: () => {
					patchSettings({
						displayName: name.trim(),
						seenWelcome: true
					});
					onDone();
				},
				children: "Begin"
			})]
		})
	});
}
function useTheme(theme) {
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		const apply = (dark) => root.classList.toggle("dark", dark);
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
function Splash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-studio",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-bg md:min-h-[min(860px,100dvh)] md:rounded-[2rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted",
				children: "Daily direction"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl tracking-[-0.03em]",
				children: "Daymark"
			})]
		})
	});
}
function Home() {
	const { tab } = Route.useSearch();
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		Promise.resolve(useHabitStore.persist.rehydrate()).then(() => {
			if (cancelled) return;
			useHabitStore.getState().ensureSeed();
			useHabitStore.getState().setHydrated();
			setReady(true);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { tab });
}
//#endregion
export { Home as component };
