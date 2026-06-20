import { useMemo } from "react";
import { formatTime } from "@/lib/format";
import type { AppState } from "@/stores/types";

interface AnalogDialProps {
  time: number;
  state: AppState;
  reducedMotion: boolean;
}

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 148;
const TICK_COUNT = 60;

export default function AnalogDial({ time, state, reducedMotion }: AnalogDialProps) {
  const seconds = time % 60;
  const secondsAngle = (seconds / 60) * 360;
  const progress =
    state === "resting" ? 0 : Math.min(time / 3600, 1);

  const ticks = useMemo(() => {
    const arr: { x1: number; y1: number; x2: number; y2: number; filled: boolean }[] = [];
    for (let i = 0; i < TICK_COUNT; i++) {
      const angle = (i / TICK_COUNT) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const filled = state === "resting" ? false : i / TICK_COUNT < progress;
      const x1 = CX + (OUTER_R - 18) * Math.cos(rad);
      const y1 = CY + (OUTER_R - 18) * Math.sin(rad);
      const x2 = CX + (OUTER_R - 8) * Math.cos(rad);
      const y2 = CY + (OUTER_R - 8) * Math.sin(rad);
      arr.push({ x1, y1, x2, y2, filled });
    }
    return arr;
  }, [progress, state]);

  const circumference = 2 * Math.PI * (OUTER_R - 26);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ width: SIZE, height: SIZE, display: "block" }}
      role="img"
      aria-label={`Timer showing ${formatTime(time)}`}
    >
      {/* Tick marks */}
      <g style={{ transition: "opacity 0.3s ease" }}>
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.filled ? "var(--accent)" : "var(--tick-bg)"}
            strokeWidth={2}
            strokeLinecap="round"
            style={{
              transition: reducedMotion ? "none" : "stroke 0.4s ease",
              opacity: t.filled ? 1 : 0.5,
            }}
          />
        ))}
      </g>

      {/* Ring background */}
      {state !== "idle" && (
        <circle
          cx={CX}
          cy={CY}
          r={OUTER_R - 26}
          fill="none"
          stroke="var(--ring-bg)"
          strokeWidth={4}
        />
      )}

      {/* Progress ring (focusing) */}
      {state === "focusing" && (
        <circle
          cx={CX}
          cy={CY}
          r={OUTER_R - 26}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{
            transition: reducedMotion ? "none" : "stroke-dashoffset 1s linear",
            opacity: 0.6,
          }}
        />
      )}

      {/* Resting ring */}
      {state === "resting" && (
        <circle
          cx={CX}
          cy={CY}
          r={OUTER_R - 26}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={0}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ opacity: 0.6 }}
        />
      )}

      {/* Seconds hand */}
      {state !== "idle" && (
        <>
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - OUTER_R + 20}
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.55}
            transform={`rotate(${secondsAngle} ${CX} ${CY})`}
            style={{
              transition: reducedMotion ? "none" : "transform 0.3s linear",
            }}
          />
          <circle
            cx={CX}
            cy={CY}
            r={4}
            fill="var(--fg)"
            opacity={0.3}
          />
        </>
      )}

      {/* Time display */}
      <text
        x={CX}
        y={CY - 12}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--fg)"
        style={{
          fontFamily: "var(--font-display, -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif)",
          fontSize: "52px",
          fontWeight: 250,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.03em",
        }}
      >
        {formatTime(time)}
      </text>

      {/* State label */}
      <text
        x={CX}
        y={CY + 36}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--muted)"
        style={{
          fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif)",
          fontSize: "12px",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
        }}
      >
        {state === "idle" ? "READY" : state === "focusing" ? "FLOW" : "REST"}
      </text>
    </svg>
  );
}
