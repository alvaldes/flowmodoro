import { useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDuration } from "@/lib/format";
import type { AppState } from "@/stores/types";
import AnalogDial from "./AnalogDial";

interface TimerSectionProps {
  appState: AppState;
  time: number;
  onStart: () => void;
  onBreak: () => void;
  onEnd: () => void;
  onDismissCompleted: () => void;
  onNameSession: (name: string, tags: string[]) => void;
}

export default function TimerSection({
  appState,
  time,
  onStart,
  onBreak,
  onEnd,
  onDismissCompleted,
  onNameSession,
}: TimerSectionProps) {
  const reducedMotion = useReducedMotion();
  const [sessionName, setSessionName] = useState("");
  const [sessionTags, setSessionTags] = useState("");

  const handleSaveName = () => {
    const tags = sessionTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onNameSession(sessionName, tags);
    onDismissCompleted();
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

      {/* Completed state */}
      {appState === "completed" && (
        <div
          style={{
            marginTop: "32px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "16px",
              letterSpacing: "-0.01em",
            }}
          >
            Session Complete!
          </div>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg, 16px)",
              padding: "20px",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <input
              type="text"
              placeholder="Session name (optional)"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              aria-label="Session name"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 8px)",
                padding: "12px 16px",
                fontSize: "14px",
                color: "var(--fg)",
                fontFamily: "var(--font-body)",
                outline: "none",
                width: "100%",
              }}
            />
            <input
              type="text"
              placeholder="Tags (comma separated, optional)"
              value={sessionTags}
              onChange={(e) => setSessionTags(e.target.value)}
              aria-label="Session tags"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 8px)",
                padding: "12px 16px",
                fontSize: "14px",
                color: "var(--fg)",
                fontFamily: "var(--font-body)",
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          <button
            onClick={handleSaveName}
            style={{
              width: "100%",
              background: "var(--accent)",
              color: "white",
              padding: "16px 24px",
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "0.02em",
              borderRadius: "var(--radius-md, 12px)",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Save session and continue"
          >
            Done
          </button>
        </div>
      )}

      {/* Action buttons (only when NOT completed) */}
      {appState !== "completed" && (
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
                onClick={onStart}
                aria-label="Start new flow session"
                style={{
                  width: "100%",
                  background: "var(--accent)",
                  color: "white",
                  padding: "16px 24px",
                  fontWeight: 600,
                  fontSize: "16px",
                  letterSpacing: "0.02em",
                  borderRadius: "var(--radius-md, 12px)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start New Flow
              </button>
              {time > 0 && (
                <button
                  onClick={onEnd}
                  aria-label="Save and close current session"
                  style={{
                    width: "100%",
                    background: "var(--surface)",
                    color: "var(--fg)",
                    border: "1px solid var(--border)",
                    padding: "12px 20px",
                    borderRadius: "var(--radius-md, 12px)",
                    cursor: "pointer",
                  }}
                >
                  Save and Close Session
                </button>
              )}
            </>
          )}

          {appState === "focusing" && (
            <div style={{ display: "flex", gap: "16px", width: "100%" }}>
              <button
                onClick={onBreak}
                aria-label="Take a break"
                style={{
                  flex: 1,
                  background: "var(--surface)",
                  color: "var(--fg)",
                  border: "1px solid var(--border)",
                  padding: "12px 20px",
                  borderRadius: "var(--radius-md, 12px)",
                  cursor: "pointer",
                }}
              >
                Take Break
              </button>
              <button
                onClick={onEnd}
                aria-label="End focus session"
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "white",
                  padding: "16px 24px",
                  fontWeight: 600,
                  fontSize: "16px",
                  letterSpacing: "0.02em",
                  borderRadius: "var(--radius-md, 12px)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                End Flow
              </button>
            </div>
          )}

          {appState === "resting" && (
            <button
              onClick={onStart}
              aria-label="Resume focus"
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "white",
                padding: "16px 24px",
                fontWeight: 600,
                fontSize: "16px",
                letterSpacing: "0.02em",
                borderRadius: "var(--radius-md, 12px)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Resume Focus
            </button>
          )}
        </div>
      )}
    </div>
  );
}
