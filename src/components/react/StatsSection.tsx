import { useMemo } from "react";
import { useSessionsStore } from "@/stores/sessions-store";
import { formatDuration } from "@/lib/format";
import { DAY_LABELS } from "@/lib/constants";

export default function StatsSection() {
  const sessions = useSessionsStore((s) => s.sessions);

  const totalFocus = sessions.reduce((acc, s) => acc + s.duration, 0);
  const sessionCount = sessions.length;

  const todayFocus = sessions
    .filter((s) => {
      const d = new Date(s.timestamp);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    })
    .reduce((acc, s) => acc + s.duration, 0);

  const weekData = useMemo(() => {
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const total = sessions
        .filter((s) => new Date(s.timestamp).toDateString() === dStr)
        .reduce((acc, s) => acc + s.duration, 0);
      days.push(total);
    }
    return days;
  }, [sessions]);

  const maxDay = Math.max(...weekData, 1);

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          className="stats-card"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg, 16px)",
            padding: "16px",
            textAlign: "center",
            transition:
              "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}
          >
            Total
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {formatDuration(totalFocus)}
          </div>
        </div>
        <div
          className="stats-card"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg, 16px)",
            padding: "16px",
            textAlign: "center",
            transition:
              "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}
          >
            Sessions
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {sessionCount}
          </div>
        </div>
        <div
          className="stats-card"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg, 16px)",
            padding: "16px",
            textAlign: "center",
            transition:
              "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}
          >
            Today
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {formatDuration(todayFocus)}
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "14px",
          letterSpacing: "-0.01em",
        }}
      >
        This Week
      </h3>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "20px",
          marginBottom: "24px",
          transition:
            "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
        role="img"
        aria-label={`Focus minutes per day: ${weekData
          .map((m, i) => `${DAY_LABELS[i]} ${Math.round(m / 60)}m`)
          .join(", ")}`}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "4px",
            height: "120px",
            paddingBottom: "8px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {weekData.map((m, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  background:
                    i === 6 ? "var(--accent)" : "var(--tick-bg)",
                  borderRadius:
                    "var(--radius-sm, 8px) var(--radius-sm, 8px) 0 0",
                  height: `${Math.max((m / maxDay) * 100, 4)}%`,
                  transition:
                    "background var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), height 0.3s ease",
                  minHeight: "4px",
                  opacity: i === 6 ? 1 : 0.5,
                }}
              />
              <span
                style={{
                  fontSize: "9px",
                  color: "var(--muted)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "14px",
          letterSpacing: "-0.01em",
        }}
      >
        History
      </h3>

      {sessions.length === 0 ? (
        <p
          style={{
            color: "var(--muted)",
            textAlign: "center",
            padding: "32px 16px",
            fontSize: "14px",
          }}
        >
          No sessions yet. Start your first flow!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[...sessions].reverse().map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md, 12px)",
                fontSize: "14px",
                transition:
                  "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
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
                <span style={{ color: "var(--muted)", marginLeft: "8px" }}>
                  {new Date(s.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                {formatDuration(s.duration)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
