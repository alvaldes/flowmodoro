import { useTimerStore } from "@/stores/timer-store";
import { useSessionsStore } from "@/stores/sessions-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDuration } from "@/lib/format";
import AnalogDial from "./AnalogDial";

export default function TimerSection() {
  const { appState, time, start, takeBreak, end } = useTimerStore();
  const { addSession } = useSessionsStore();
  const { restRatio } = useSettingsStore();
  const reducedMotion = useReducedMotion();

  const handleStart = () => start();

  const handleBreak = () => {
    if (time > 0) {
      addSession({ duration: time, timestamp: Date.now() });
    }
    takeBreak(restRatio, time);
  };

  const handleEnd = () => {
    const session = end(time);
    if (session) {
      addSession(session);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "24px",
      }}
    >
      <AnalogDial time={time} state={appState} reducedMotion={reducedMotion} />

      {appState === "idle" && time > 0 && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          Last session: {formatDuration(time)}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "16px",
          width: "100%",
          marginTop: "48px",
          flexDirection: "column",
        }}
      >
        {appState === "idle" && (
          <>
            <button
              className="btn-primary"
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "white",
                padding: "16px 24px",
                fontWeight: 600,
                fontSize: "16px",
                letterSpacing: "0.02em",
              }}
              onClick={handleStart}
              aria-label="Start new flow session"
            >
              Start New Flow
            </button>
            {time > 0 && (
              <button
                className="btn-secondary"
                style={{
                  width: "100%",
                  background: "var(--surface)",
                  color: "var(--fg)",
                  border: "1px solid var(--border)",
                  padding: "12px 20px",
                }}
                onClick={handleEnd}
                aria-label="Save and close current session"
              >
                Save and Close Session
              </button>
            )}
          </>
        )}

        {appState === "focusing" && (
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <button
              className="btn-secondary"
              style={{
                flex: 1,
                background: "var(--surface)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                padding: "12px 20px",
              }}
              onClick={handleBreak}
              aria-label="Take a break"
            >
              Take Break
            </button>
            <button
              className="btn-primary"
              style={{
                flex: 1,
                background: "var(--accent)",
                color: "white",
                padding: "16px 24px",
                fontWeight: 600,
                fontSize: "16px",
                letterSpacing: "0.02em",
              }}
              onClick={handleEnd}
              aria-label="End focus session"
            >
              End Flow
            </button>
          </div>
        )}

        {appState === "resting" && (
          <button
            className="btn-primary"
            style={{
              width: "100%",
              background: "var(--accent)",
              color: "white",
              padding: "16px 24px",
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "0.02em",
            }}
            onClick={handleStart}
            aria-label="Resume focus"
          >
            Resume Focus
          </button>
        )}
      </div>
    </div>
  );
}
