import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDuration, formatTimeShort, formatDate } from "@/lib/format";
import { useSettingsStore } from "@/stores/settings-store";
import type { AppState, SessionEntry } from "@/stores/types";
import type { CurrentSessionInfo } from "@/hooks/usePreciseTimer";
import AnalogDial from "./AnalogDial";
import { Play, Square, Coffee, X } from "lucide-react";

interface TimerSectionProps {
  appState: AppState;
  time: number;
  initialRestTime: number;
  currentSession: CurrentSessionInfo | null;
  onStart: () => void;
  onBreak: () => void;
  onEnd: () => void;
}

// ---------------------------------------------------------------------------
// Pill button sub-component
// ---------------------------------------------------------------------------
export interface PillButtonProps {
  label?: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  size?: number;
  progress?: number; // 0-1, renders circular progress ring around icon
  style?: React.CSSProperties;
}

export const PILL_HEIGHT = 48;

export function PillButton({
  label,
  active,
  icon,
  onClick,
  ariaLabel,
  size = PILL_HEIGHT,
  progress,
  style,
}: PillButtonProps) {
  const hasLabel = label !== undefined && label !== "";
  const circumference = 2 * Math.PI * (size / 2 - 4);

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: hasLabel ? undefined : "center",
        gap: hasLabel ? "12px" : 0,
        width: hasLabel ? "100%" : size,
        height: size,
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        padding: 0,
        paddingRight: hasLabel ? "20px" : 0,
        background: active ? "var(--accent)" : "var(--accent-dim)",
        boxShadow: active
          ? "0 4px 12px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.12)"
          : "0 2px 6px rgba(0,0,0,0.06)",
        transition: "background 200ms ease, box-shadow 200ms ease",
        ...style,
      }}
    >
      {/* Circular icon container — fully rounded, darker than button bg */}
      <span
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          borderRadius: "50%",
          flexShrink: 0,
          background: active ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.08)",
        }}
      >
        {icon}
        {progress !== undefined && (
          <svg
            viewBox={`0 0 ${size} ${size}`}
            style={{
              position: "absolute",
              inset: 0,
              width: size,
              height: size,
              transform: "rotate(-90deg)",
            }}
          >
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 4}
              fill="none"
              stroke="rgba(0,0,0,0.00)"
              strokeWidth={3}
            />
            {/* Progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 4}
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
        )}
      </span>

      {/* Text label — centered in remaining space, hidden when no label */}
      {hasLabel && (
        <span
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "15px",
            letterSpacing: "0.01em",
            color: active
              ? "var(--accent-foreground)"
              : "var(--text-secondary)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function TimerSection({
  appState,
  time,
  initialRestTime,
  currentSession,
  onStart,
  onBreak,
  onEnd,
}: TimerSectionProps) {
  const reducedMotion = useReducedMotion();
  const autoFocusAfterBreak = useSettingsStore((s) => s.autoFocusAfterBreak);
  const breakProgress =
    appState === "resting" && initialRestTime > 0 && autoFocusAfterBreak
      ? time / initialRestTime
      : undefined;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "16px",
      }}
    >
      <AnalogDial
        time={time}
        state={appState}
        reducedMotion={reducedMotion}
        initialRestTime={initialRestTime}
      />

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

      {/* Action buttons — always rendered to prevent layout jump */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          width: "100%",
          marginTop: "48px",
          flexDirection: "column",
          minHeight: 48,
        }}
      >
        {appState === "idle" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: time > 0 ? "stretch" : "center",
                gap: "12px",
              }}
            >
              <div style={{ width: time > 0 ? "100%" : "calc(55% - 6px)" }}>
                <PillButton
                  label="New Session"
                  active
                  icon={<Play size={18} fill="currentColor" />}
                  onClick={onStart}
                  ariaLabel="Start new flow session"
                />
              </div>
              {time > 0 && (
                <PillButton
                  label="Save and Close Session"
                  active={false}
                  icon={<X size={18} />}
                  onClick={onEnd}
                  ariaLabel="Save and close current session"
                />
              )}
            </div>
          )}

          {appState === "focusing" && (
            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
              <PillButton
                label="Take Break"
                active
                icon={<Coffee size={18} />}
                onClick={onBreak}
                ariaLabel="Take a break"
                style={{ flex: 1 }}
              />
              <PillButton
                label="End Session"
                active={false}
                icon={<Square size={18} fill="currentColor" />}
                onClick={onEnd}
                ariaLabel="End focus session"
                style={{ flex: 1 }}
              />
            </div>
          )}

          {appState === "resting" && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "calc(55% - 6px)" }}>
                <PillButton
                  label="Resume Focus"
                  active
                  icon={<Play size={18} fill="currentColor" />}
                  onClick={onStart}
                  ariaLabel="Resume focus"
                  progress={breakProgress}
                />
              </div>
            </div>
          )}
        </div>

      {/* Current session info */}
      {currentSession && (
        <div
          style={{
            width: "100%",
            marginTop: "32px",
            background: "var(--surface)",
            borderRadius: "var(--radius-lg, 22px)",
            padding: "16px 20px",
            boxShadow: "var(--neu-raised-sm)",
          }}
        >
          {/* Session header */}
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-tertiary)",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Started {formatDate(currentSession.startedAt)}{" "}
              {formatTimeShort(currentSession.startedAt)}
            </span>
          </div>

          {/* Entry list */}
          {currentSession.entries.map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderTop: i > 0 ? "1px solid var(--tick-bg)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color:
                    entry.type === "focus"
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {entry.type === "focus" ? "Focus" : "Break"}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--fg)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatDuration(entry.duration)}
              </span>
            </div>
          ))}

          {/* In-progress entry */}
          {appState === "focusing" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderTop:
                  currentSession.entries.length > 0
                    ? "1px solid var(--tick-bg)"
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--accent)",
                }}
              >
                Focus
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--fg)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatDuration(currentSession.focusSeconds)}
              </span>
            </div>
          )}
          {appState === "resting" && currentSession.breakSeconds > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderTop:
                  currentSession.entries.length > 0
                    ? "1px solid var(--tick-bg)"
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                Break
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--fg)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatDuration(currentSession.breakSeconds)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
