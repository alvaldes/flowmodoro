import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDuration } from "@/lib/format";
import type { AppState } from "@/stores/types";
import AnalogDial from "./AnalogDial";
import { Play, Square, Coffee, X } from "lucide-react";

interface TimerSectionProps {
  appState: AppState;
  time: number;
  initialRestTime: number;
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
  style,
}: PillButtonProps) {
  const hasLabel = label !== undefined && label !== "";

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
  onStart,
  onBreak,
  onEnd,
}: TimerSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "16px",
      }}
    >
      <AnalogDial time={time} state={appState} reducedMotion={reducedMotion} initialRestTime={initialRestTime} />

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

      {/* Action buttons */}
      {appState !== "completed" && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            width: "100%",
            marginTop: "48px",
            flexDirection: "column",
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
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
