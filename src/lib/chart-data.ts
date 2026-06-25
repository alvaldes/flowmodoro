import type { Session } from "@/stores/types";

// ---------------------------------------------------------------------------
// Data helpers — pure functions, no side effects, testable in isolation
// All time-dependent functions accept an optional `now` parameter
// (defaults to new Date()) for deterministic testing.
// ---------------------------------------------------------------------------

const DAY_LABELS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

function getFocusSeconds(session: Session): number {
  return session.entries
    .filter((e) => e.type === "focus")
    .reduce((sum, e) => sum + e.duration, 0);
}

function getBreakSeconds(session: Session): number {
  return session.entries
    .filter((e) => e.type === "break")
    .reduce((sum, e) => sum + e.duration, 0);
}

function toDaysAgo(timestamp: number, now: Date): number {
  const day = new Date(timestamp);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  day.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - day.getTime()) / 86400000);
}

// ---------------------------------------------------------------------------
// Weekly bar chart — last 7 days
// ---------------------------------------------------------------------------

export interface WeeklyDataPoint {
  label: string;
  seconds: number;
  isToday: boolean;
}

export function aggregateWeekly(
  sessions: Session[],
  now: Date = new Date(),
): WeeklyDataPoint[] {
  const days: WeeklyDataPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dStr = d.toDateString();

    const seconds = sessions
      .filter((s) => new Date(s.timestamp).toDateString() === dStr)
      .reduce((acc, s) => acc + getFocusSeconds(s), 0);

    days.push({
      label: DAY_LABELS_SHORT[d.getDay()],
      seconds,
      isToday: i === 0,
    });
  }

  return days;
}

// ---------------------------------------------------------------------------
// Monthly trend — last 30 days
// ---------------------------------------------------------------------------

export interface MonthlyDataPoint {
  label: string; // "Jun 1"
  seconds: number;
}

export function aggregateMonthly(
  sessions: Session[],
  now: Date = new Date(),
): MonthlyDataPoint[] {
  const days: MonthlyDataPoint[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dStr = d.toDateString();

    const seconds = sessions
      .filter((s) => new Date(s.timestamp).toDateString() === dStr)
      .reduce((acc, s) => acc + getFocusSeconds(s), 0);

    days.push({
      label: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      seconds,
    });
  }

  return days;
}

// ---------------------------------------------------------------------------
// Focus vs Break ratio
// ---------------------------------------------------------------------------

export interface RatioData {
  focus: number;
  break: number;
  focusPercent: number;
}

export type RatioPeriod = "today" | "week" | "month" | "all";

function filterByPeriod(
  sessions: Session[],
  period: RatioPeriod,
  now: Date,
): Session[] {
  if (period === "all") return sessions;

  const msInDay = 86400000;
  const nowMs = now.getTime();

  return sessions.filter((s) => {
    const age = nowMs - s.timestamp;
    switch (period) {
      case "today":
        return toDaysAgo(s.timestamp, now) === 0;
      case "week":
        return age < 7 * msInDay;
      case "month":
        return age < 30 * msInDay;
      default:
        return true;
    }
  });
}

export function computeRatio(
  sessions: Session[],
  period: RatioPeriod = "all",
  now: Date = new Date(),
): RatioData {
  const filtered = filterByPeriod(sessions, period, now);
  const focus = filtered.reduce((acc, s) => acc + getFocusSeconds(s), 0);
  const breakDur = filtered.reduce((acc, s) => acc + getBreakSeconds(s), 0);
  const total = focus + breakDur;

  return {
    focus,
    break: breakDur,
    focusPercent: total > 0 ? Math.round((focus / total) * 100) : 0,
  };
}

// ---------------------------------------------------------------------------
// Productivity scatter — hour of day × focus duration
// ---------------------------------------------------------------------------

export interface ScatterPoint {
  x: number; // hour (0-23)
  y: number; // duration in minutes
  r: number; // radius (relative intensity)
}

export function computeScatter(sessions: Session[]): ScatterPoint[] {
  const points: ScatterPoint[] = [];

  for (const session of sessions) {
    for (const entry of session.entries) {
      if (entry.type !== "focus") continue;

      const hour = new Date(entry.startedAt).getHours();
      const minutes = Math.round(entry.duration / 60);
      const r = Math.min(Math.max(minutes / 5, 4), 12);

      points.push({ x: hour, y: minutes, r });
    }
  }

  return points;
}

// ---------------------------------------------------------------------------
// Session timeline — stacked focus/break per session
// ---------------------------------------------------------------------------

export interface TimelineBar {
  label: string; // "Jun 14"
  focus: number;
  break: number;
}

export function computeTimeline(
  sessions: Session[],
  limit = 10,
): TimelineBar[] {
  return sessions
    .slice(-limit)
    .map((s) => ({
      label: new Date(s.timestamp).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      focus: getFocusSeconds(s),
      break: getBreakSeconds(s),
    }));
}
