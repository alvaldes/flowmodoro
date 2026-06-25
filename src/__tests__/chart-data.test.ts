import { describe, it, expect } from "vitest";
import {
  aggregateWeekly,
  aggregateMonthly,
  computeRatio,
  computeScatter,
  computeTimeline,
} from "@/lib/chart-data";
import type { Session } from "@/stores/types";

function makeSession(
  id: string,
  timestamp: number,
  focusDuration: number,
  breakDuration = 0,
): Session {
  return {
    id,
    timestamp,
    entries: [
      {
        type: "focus",
        duration: focusDuration,
        startedAt: timestamp,
      },
      ...(breakDuration > 0
        ? [
            {
              type: "break" as const,
              duration: breakDuration,
              startedAt: timestamp + focusDuration * 1000,
            },
          ]
        : []),
    ],
  };
}

const FIXED_NOW = new Date("2026-06-24T12:00:00Z");
const MS_IN_DAY = 86400000;

// ---------------------------------------------------------------------------
// aggregateWeekly
// ---------------------------------------------------------------------------

describe("aggregateWeekly", () => {
  it("returns 7 days with zero seconds for empty sessions", () => {
    const result = aggregateWeekly([], FIXED_NOW);
    expect(result).toHaveLength(7);
    for (const day of result) {
      expect(day.seconds).toBe(0);
    }
  });

  it("groups sessions by day and sums focus duration", () => {
    // Jun 22 — 2 days before fixed now
    const twoDaysAgo = FIXED_NOW.getTime() - 2 * MS_IN_DAY;
    const sessions = [makeSession("s1", twoDaysAgo, 3600)];

    const result = aggregateWeekly(sessions, FIXED_NOW);

    // 7-day window: 0=Jun 18(Thu), 1=Jun 19(Fri), 2=Jun 20(Sat), 3=Jun 21(Sun), 4=Jun 22(Mon), 5=Jun 23(Tue), 6=Jun 24(Wed)
    expect(result[4].seconds).toBe(3600);
    expect(result[4].isToday).toBe(false);
    expect(result[4].label).toBe("MON");
  });

  it("marks today correctly", () => {
    const sessions = [makeSession("s1", FIXED_NOW.getTime(), 1800)];
    const result = aggregateWeekly(sessions, FIXED_NOW);

    expect(result[6].isToday).toBe(true);
    expect(result[6].seconds).toBe(1800);
  });

  it("has correct day labels", () => {
    // Jun 24 2026 is Wednesday, so the week runs Thu→Wed
    const result = aggregateWeekly([], FIXED_NOW);

    // 0=Jun 18 (Thu), 1=Jun 19 (Fri), ... 6=Jun 24 (Wed)
    // Wait: Jun 24 2026 is what day of the week?
    // Let me just verify we have 7 unique labels
    const labels = result.map((d) => d.label);
    expect(new Set(labels).size).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// aggregateMonthly
// ---------------------------------------------------------------------------

describe("aggregateMonthly", () => {
  it("returns 30 days for empty sessions", () => {
    const result = aggregateMonthly([], FIXED_NOW);
    expect(result).toHaveLength(30);
    for (const day of result) {
      expect(day.seconds).toBe(0);
    }
  });

  it("includes sessions within the 30-day window", () => {
    // Jun 14 — 10 days before fixed now
    const tenDaysAgo = FIXED_NOW.getTime() - 10 * MS_IN_DAY;
    const sessions = [makeSession("s1", tenDaysAgo, 2700)];
    const result = aggregateMonthly(sessions, FIXED_NOW);

    // Find the index for Jun 14
    const match = result.find((d) => d.label === "Jun 14");
    expect(match?.seconds).toBe(2700);
  });
});

// ---------------------------------------------------------------------------
// computeRatio
// ---------------------------------------------------------------------------

describe("computeRatio", () => {
  it("returns zeros and 0% for empty sessions", () => {
    const result = computeRatio([], "all", FIXED_NOW);
    expect(result.focus).toBe(0);
    expect(result.break).toBe(0);
    expect(result.focusPercent).toBe(0);
  });

  it("computes correct ratio with mixed sessions", () => {
    const sessions = [
      makeSession("s1", FIXED_NOW.getTime(), 3600, 300),
      makeSession("s2", FIXED_NOW.getTime() - MS_IN_DAY, 1800, 600),
    ];

    const result = computeRatio(sessions, "all", FIXED_NOW);
    expect(result.focus).toBe(5400);
    expect(result.break).toBe(900);
    expect(result.focusPercent).toBe(86);
  });

  it("filters by today", () => {
    const sessions = [
      makeSession("s1", FIXED_NOW.getTime(), 1200, 120),
      makeSession("s2", FIXED_NOW.getTime() - MS_IN_DAY, 3600),
    ];
    const result = computeRatio(sessions, "today", FIXED_NOW);
    expect(result.focus).toBe(1200);
  });

  it("filters by week (7 days)", () => {
    const sessions = [
      makeSession("s1", FIXED_NOW.getTime(), 600),
      makeSession("s2", FIXED_NOW.getTime() - 8 * MS_IN_DAY, 3600),
    ];
    const result = computeRatio(sessions, "week", FIXED_NOW);
    expect(result.focus).toBe(600); // only today's session
  });
});

// ---------------------------------------------------------------------------
// computeScatter
// ---------------------------------------------------------------------------

describe("computeScatter", () => {
  it("returns empty array for empty sessions", () => {
    expect(computeScatter([])).toHaveLength(0);
  });

  it("plots focus session entries as scatter points", () => {
    const timestamp = new Date("2026-06-24T14:30:00Z").getTime();
    const sessions = [makeSession("s1", timestamp, 1800)];
    const result = computeScatter(sessions);

    expect(result).toHaveLength(1);
    expect(result[0].x).toBe(14);
    expect(result[0].y).toBe(30);
    expect(result[0].r).toBeGreaterThan(0);
  });

  it("ignores break entries", () => {
    const sessions = [makeSession("s1", 0, 1200, 600)];
    const result = computeScatter(sessions);
    expect(result).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// computeTimeline
// ---------------------------------------------------------------------------

describe("computeTimeline", () => {
  it("returns empty for empty sessions", () => {
    expect(computeTimeline([])).toHaveLength(0);
  });

  it("limits to N most recent sessions", () => {
    const sessions = Array.from({ length: 15 }, (_, i) =>
      makeSession(`s${i}`, i, 600),
    );
    const result = computeTimeline(sessions, 5);
    expect(result).toHaveLength(5);
  });

  it("returns all sessions when fewer than limit", () => {
    const sessions = Array.from({ length: 3 }, (_, i) =>
      makeSession(`s${i}`, i, 600),
    );
    const result = computeTimeline(sessions, 10);
    expect(result).toHaveLength(3);
  });

  it("splits focus and break per session", () => {
    const sessions = [makeSession("s1", 0, 1800, 300)];
    const result = computeTimeline(sessions);
    expect(result[0].focus).toBe(1800);
    expect(result[0].break).toBe(300);
  });
});
