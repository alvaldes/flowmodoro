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
        paddingTop: "16px",
      }}
    >
      <AnalogDial time={time} state={appState} reducedMotion={reducedMotion} />

      {appState === "idle" && time > 0 && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: "12px",
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
              marginBottom: "20px",
              letterSpacing: "-0.01em",
            }}
          >
            Session Complete!
          </div>

          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-lg, 22px)",
              padding: "20px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "var(--neu-raised-md)",
              transition:
                "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
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
                borderRadius: "var(--radius-sm, 10px)",
                padding: "12px 16px",
                fontSize: "14px",
                color: "var(--fg)",
                border: "none",
                width: "100%",
                boxShadow: "var(--neu-pressed-xs)",
                transition:
                  "box-shadow var(--motion-fast, 150ms) var(--ease-standard)",
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
                borderRadius: "var(--radius-sm, 10px)",
                padding: "12px 16px",
                fontSize: "14px",
                color: "var(--fg)",
                border: "none",
                width: "100%",
                boxShadow: "var(--neu-pressed-xs)",
                transition:
                  "box-shadow var(--motion-fast, 150ms) var(--ease-standard)",
              }}
            />
          </div>

          <button
            onClick={handleSaveName}
            aria-label="Save session and continue"
            style={{
              width: "100%",
              background: "var(--accent)",
              color: "white",
              padding: "16px 24px",
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "0.02em",
              borderRadius: "var(--radius-md, 16px)",
              border: "none",
              cursor: "pointer",
              boxShadow: "var(--neu-accent-raised)",
              transition:
                "box-shadow var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), transform var(--motion-fast, 150ms) var(--ease-standard)",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "var(--neu-accent-pressed)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "var(--neu-accent-raised)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "var(--neu-accent-raised)";
            }}
          >
            Done
          </button>
        </div>
      )}

      {/* Action buttons */}
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
                  borderRadius: "var(--radius-md, 16px)",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "var(--neu-accent-raised)",
                  transition:
                    "box-shadow var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), transform var(--motion-fast, 150ms) var(--ease-standard)",
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-accent-pressed)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-accent-raised)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-accent-raised)";
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
                    padding: "14px 20px",
                    borderRadius: "var(--radius-md, 16px)",
                    cursor: "pointer",
                    border: "none",
                    boxShadow: "var(--neu-raised-sm)",
                    transition:
                      "box-shadow var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), transform var(--motion-fast, 150ms) var(--ease-standard)",
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "var(--neu-pressed-sm)";
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "var(--neu-raised-sm)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "var(--neu-raised-sm)";
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
                  padding: "14px 20px",
                  borderRadius: "var(--radius-md, 16px)",
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "var(--neu-raised-sm)",
                  transition:
                    "box-shadow var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), transform var(--motion-fast, 150ms) var(--ease-standard)",
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-pressed-sm)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-raised-sm)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-raised-sm)";
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
                  borderRadius: "var(--radius-md, 16px)",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "var(--neu-accent-raised)",
                  transition:
                    "box-shadow var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), transform var(--motion-fast, 150ms) var(--ease-standard)",
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-accent-pressed)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-accent-raised)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "var(--neu-accent-raised)";
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
                borderRadius: "var(--radius-md, 16px)",
                border: "none",
                cursor: "pointer",
                boxShadow: "var(--neu-accent-raised)",
                transition:
                  "box-shadow var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), transform var(--motion-fast, 150ms) var(--ease-standard)",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "var(--neu-accent-pressed)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "var(--neu-accent-raised)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "var(--neu-accent-raised)";
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
