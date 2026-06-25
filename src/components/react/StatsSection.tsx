import { useMemo, useState } from "react";
import { useSessionsStore } from "@/stores/sessions-store";
import { formatDuration } from "@/lib/format";
import { Card } from "@/components/ui/card";
import WeeklyFocusChart from "@/components/react/WeeklyFocusChart";
import FocusBreakDoughnut from "@/components/react/FocusBreakDoughnut";
import MonthlyTrendChart from "@/components/react/MonthlyTrendChart";
import ProductivityHeatmap from "@/components/react/ProductivityHeatmap";
import SessionTimeline from "@/components/react/SessionTimeline";
import { aggregateWeekly } from "@/lib/chart-data";

function getFocusDuration(
  entries: { type: string; duration: number }[] | undefined,
): number {
  if (!entries) return 0;
  return entries
    .filter((e) => e.type === "focus")
    .reduce((sum, e) => sum + e.duration, 0);
}

function getBreakDuration(
  entries: { type: string; duration: number }[] | undefined,
): number {
  if (!entries) return 0;
  return entries
    .filter((e) => e.type === "break")
    .reduce((sum, e) => sum + e.duration, 0);
}

export default function StatsSection() {
  const sessions = useSessionsStore((s) => s.sessions);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const todayFocus = useMemo(
    () =>
      sessions
        .filter((s) => {
          const d = new Date(s.timestamp);
          const now = new Date();
          return d.toDateString() === now.toDateString();
        })
        .reduce((acc, s) => acc + getFocusDuration(s.entries), 0),
    [sessions],
  );

  const todaySessionCount = useMemo(
    () =>
      sessions.filter((s) => {
        const d = new Date(s.timestamp);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length,
    [sessions],
  );

  const weeklySeconds = useMemo(
    () => aggregateWeekly(sessions).reduce((acc, d) => acc + d.seconds, 0),
    [sessions],
  );

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Today's stat cards — neumorphic raised */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <Card style={{ padding: "18px 12px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}
          >
            Total Today
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "var(--fg)",
            }}
          >
            {formatDuration(todayFocus)}
          </div>
        </Card>
        <Card style={{ padding: "18px 12px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}
          >
            Sessions Today
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "var(--fg)",
            }}
          >
            {todaySessionCount}
          </div>
        </Card>
        <Card style={{ padding: "12px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "10px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "4px",
            }}
          >
            Focus vs Break
          </div>
          <FocusBreakDoughnut
            sessions={sessions}
            period="today"
            className="h-[40px]"
          />
        </Card>
      </div>

      {/* Weekly chart — Chart.js */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--fg)",
          }}
        >
          This Week
        </h3>
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-tertiary)",
          }}
        >
          {formatDuration(weeklySeconds)} total
        </span>
      </div>

      <Card style={{ padding: "16px", marginBottom: "28px" }}>
        <WeeklyFocusChart sessions={sessions} />
      </Card>

      {/* Monthly trend */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "14px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        30-Day Trend
      </h3>

      <Card style={{ padding: "16px", marginBottom: "28px" }}>
        <MonthlyTrendChart sessions={sessions} />
      </Card>

      {/* Productivity scatter */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "14px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        When You Focus
      </h3>

      <Card style={{ padding: "16px", marginBottom: "28px" }}>
        <ProductivityHeatmap sessions={sessions} />
      </Card>

      {/* Session timeline */}
      {/* <h3 */}
      {/*   style={{ */}
      {/*     fontSize: "15px", */}
      {/*     fontWeight: 600, */}
      {/*     marginBottom: "14px", */}
      {/*     letterSpacing: "-0.01em", */}
      {/*     color: "var(--fg)", */}
      {/*   }} */}
      {/* > */}
      {/*   Session Breakdown */}
      {/* </h3> */}
      {/**/}
      {/* <Card style={{ padding: "16px", marginBottom: "28px" }}> */}
      {/*   <SessionTimeline sessions={sessions} limit={10} /> */}
      {/* </Card> */}

      {/* History title */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "14px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        History
      </h3>

      {sessions.length === 0 ? (
        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            padding: "32px 16px",
            fontSize: "14px",
          }}
        >
          No sessions yet. Start your first flow!
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "60dvh",
            overflowY: "auto",
          }}
          className="px-3 py-3"
        >
          {[...sessions].reverse().map((s) => {
            const entries = s.entries ?? [];
            const focusDur = getFocusDuration(entries);
            const breakDur = getBreakDuration(entries);
            const isOpen = expanded.has(s.id);
            return (
              <div
                key={s.id ?? s.timestamp}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "14px 18px",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md, 16px)",
                  fontSize: "14px",
                  boxShadow: "var(--neu-raised-sm)",
                  cursor: "pointer",
                  transition:
                    "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
                }}
                onClick={() => toggleExpanded(s.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleExpanded(s.id);
                }}
                className="max-w-[431px]"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--fg)", fontWeight: 500 }}>
                      {new Date(s.timestamp).toLocaleDateString([], {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      style={{
                        color: "var(--text-tertiary)",
                        marginLeft: "8px",
                      }}
                    >
                      {new Date(s.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                    {formatDuration(focusDur)}
                  </span>
                </div>

                {(s.name || (s.tags && s.tags.length > 0)) && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    {s.name && (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "var(--fg)",
                        }}
                      >
                        {s.name}
                      </span>
                    )}
                    {s.tags?.map((tag, ti) => (
                      <span
                        key={ti}
                        style={{
                          fontSize: "10px",
                          fontWeight: 500,
                          background: "var(--accent-dim)",
                          color: "var(--accent)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expandable details: focus + break breakdown */}
                {isOpen && (
                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "12px",
                      borderTop: "1px solid var(--tick-bg)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            display: "inline-block",
                          }}
                        />
                        Focus
                      </span>
                      <span style={{ fontWeight: 500, color: "var(--fg)" }}>
                        {formatDuration(focusDur)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "var(--text-tertiary)",
                            display: "inline-block",
                          }}
                        />
                        Break
                      </span>
                      <span style={{ fontWeight: 500, color: "var(--fg)" }}>
                        {breakDur > 0 ? formatDuration(breakDur) : "—"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
